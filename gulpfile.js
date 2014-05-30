'use strict';

var gulp = require('gulp');

gulp.task('watch', function (cb) {
  console.error('DEPRECATED COMMAND, PLEASE USE: make watch');
});

gulp.task('default', function () {
  gulp.start('watch');
});
