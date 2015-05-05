'use strict';

var gulp = require('gulp');

var $ = require('gulp-load-plugins')();

var wiredep = require('wiredep').stream;

module.exports = function (options) {
  gulp.task('inject', ['scripts'], function () {
    var injectStyles = gulp.src([
      options.src + '/**/*.less'
    ]).pipe($.less())
      .pipe(gulp.dest(options.tmp + '/' + options.namespace));

    var injectScripts = gulp.src([
      options.src + '/**/*.js'
    ]).pipe($.angularFilesort())
      .on('error', options.errorHandler('AngularFilesort'));

    var injectOptions = {
      ignorePath: [options.src, options.tmp + '/' + options.namespace],
      addRootSlash: false
    };

    var wiredepOptions = {
      directory: 'bower_components',
      exclude: [/bootstrap\.js/]
    };

    return gulp.src(options.src + '/**/*.jade')
      .pipe($.jade({pretty: true}))
      .pipe($.inject(injectStyles, injectOptions))
      .pipe($.inject(injectScripts, injectOptions))
      .pipe(wiredep(wiredepOptions))
      .pipe(gulp.dest(options.tmp + '/' + options.namespace))
      .pipe($.size({title: 'inject:', showFiles: true}));
  });
};
