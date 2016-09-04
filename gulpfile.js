'use strict';

var gulp = require('gulp');
var jshint = require('gulp-jshint');

gulp.task('jshint', function(){
  gulp
  .src(['./server/**/*.js','./client/**/*.js',])
  .pipe(jshint())
  .pipe(jshint.reporter('jshint-stylish'))
  .pipe(jshint.reporter('fail'));
});