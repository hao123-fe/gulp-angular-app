'use strict';

var gulp = require('gulp');

var $ = require('gulp-load-plugins')({
  pattern: ['gulp-*', 'main-bower-files', 'uglify-save-license']
});

module.exports = function (options) {

  gulp.task('html', ['inject'], function () {

    var htmlFilter = $.filter('**/*.html');
    var jsFilter = $.filter('**/*.js');
    var cssFilter = $.filter('**/*.css');
    var assets;

    return gulp.src(options.tmp +  '/'+options.namespace + '/**/*.html')
      .pipe(assets = $.useref.assets({searchPath: [options.tmp, options.src]}))
      .pipe($.rev())
      .pipe(jsFilter)
      .pipe($.ngAnnotate())
      .pipe($.uglify({preserveComments: $.uglifySaveLicense})).on('error', options.errorHandler('Uglify'))
      .pipe(jsFilter.restore())
      .pipe(cssFilter)
      .pipe($.csso())
      .pipe(cssFilter.restore())
      .pipe(assets.restore())
      .pipe($.useref())
      .pipe($.revReplace())
      //.pipe(htmlFilter)
      //.pipe($.minifyHtml({
      //  empty: true,
      //  spare: true,
      //  quotes: true,
      //  conditionals: true
      //}))
      //.pipe(htmlFilter.restore())
      .pipe(gulp.dest(options.dist + '/' + options.namespace))
      .pipe($.size({title: 'release', showFiles: true}));
  });

  // Only applies for fonts from bower dependencies
  // Custom fonts are handled by the "other" task
  gulp.task('fonts', function () {
    return gulp.src($.mainBowerFiles())
      .pipe($.filter('**/*.{eot,svg,ttf,woff,woff2}'))
      .pipe($.flatten())
      .pipe(gulp.dest(options.dist + '/' + options.namespace + '/fonts/'));
  });

  gulp.task('other', function () {
    return gulp.src([
      options.src + '/**/*',
      '!' + options.src + '/**/*.{jade,less,js}'
    ]).pipe(gulp.dest(options.dist + '/' + options.namespace + '/'));
  });

  gulp.task('clean', function () {
    return gulp.src([options.dist, options.tmp])
      .pipe($.clean());
  });


  gulp.task('release', ['html', 'fonts', 'other']);

};
