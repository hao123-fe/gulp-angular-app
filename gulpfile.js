'use strict';

var gulp = require('gulp');
var gutil = require('gulp-util');
var $ = require('gulp-load-plugins')();
var wrench = require('wrench');

var options = {
  src: 'src', //项目的源码目录
  dist: 'dist', //项目发布后的目录
  tmp: '.tmp', //执行gulp serve 临时预览目录
  namespace: 'demo',  //项目的模块名
  errorHandler: function(title) {
    return function(err) {
      gutil.log(gutil.colors.red('[' + title + ']'), err.toString());
      this.emit('end');
    };
  }
};

wrench.readdirSyncRecursive('./gulp').filter(function(file) {
  return (/\.(js|coffee)$/i).test(file);
}).map(function(file) {
  require('./gulp/' + file)(options);
});

gulp.task('default', ['clean'], function () {
  gulp.start('release');
});
