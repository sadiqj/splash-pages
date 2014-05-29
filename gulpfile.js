'use strict';

var gulp = require('gulp');
var exec = require('child_process').exec;

gulp.task('watch', function (cb) {
  var child = exec('make watch');
  child.stderr.pipe(process.stderr);
  child.stdout.pipe(process.stdout);
});

gulp.task('default', function () {
  gulp.start('watch');
});
