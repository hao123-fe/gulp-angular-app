'use strict';

var gulp = require('gulp');
var browserSync = require('browser-sync');

function isOnlyChange(event) {
  return event.type === 'changed';
}

module.exports = function (options) {
  gulp.task('watch', ['inject'], function () {

    gulp.watch([options.src + '/**/*.jade', 'bower.json'], ['inject']);

    gulp.watch(options.src + '/**/*.less', ['inject']);

    gulp.watch(options.src + '/**/*.js', function (event) {
      if (isOnlyChange(event)) {
        gulp.start('scripts');
      } else {
        gulp.start('inject');
      }
    });

  });
};
