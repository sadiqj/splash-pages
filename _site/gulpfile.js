var gulp = require('gulp');
var pipe = require('pipe/gulp');
var connect = require('gulp-connect');
var concat = require('gulp-concat');
var awspublish = require('gulp-awspublish');
var jshint = require('gulp-jshint');
var size = require('gulp-size');
var uglify = require('gulp-uglify');
var imagemin = require('gulp-imagemin');
var filter = require('gulp-filter');
var cache = require('gulp-cache');
var useref = require('gulp-useref');
var exec = require('gulp-exec');
var rework = require('gulp-rework');
var suitRework = require('rework-suit');
var pseudos = require('rework-pseudos');
var csso = require('gulp-csso');
var streamAutoprefixer = require('gulp-autoprefixer');
var autoprefixer = require('autoprefixer');
var wiredep = require('wiredep');

var paths = {
  jsSrc: './js/**/*.js'
};

gulp.task('jshint', function() {
  return gulp.src(paths.jsSrc)
      .pipe(jshint('./.jshintrc'))
      .pipe(jshint.reporter('default'));
})

gulp.task('transpile', function() {
  gulp.src(paths.jsSrc)
      .pipe(pipe.traceur({
        sourceMaps: true
      }))
      .pipe(gulp.dest('dist/js'))
      .pipe(size());
});

gulp.task('libs', function() {
  gulp.src([
    './node_modules/requirejs/require.js',
    './node_modules/traceur/bin/traceur-runtime.js',
    './node_modules/pipe/node_modules/assert/dist/amd/assert.js',
    './node_modules/q/q.js',
    './node_modules/es6-shim/es6-shim.js'
  ]).pipe(gulp.dest('dist/js'))
    .pipe(size());

  gulp.src([
    './node_modules/di/dist/amd/*.js'
  ]).pipe(gulp.dest('dist/js/di'))
    .pipe(size());
});

gulp.task('js', ['transpile', 'libs']);

gulp.task('public', function() {
  return gulp.src('./public/**/*', { base: './public' })
    .pipe(gulp.dest('dist'))
    .pipe(size());
});

gulp.task('css', function () {
  return gulp.src([
    './css/normalize.css',
    './css/**/*.css'
  ]).pipe(
      streamAutoprefixer('> 1%', 'last 2 versions', 'Firefox ESR', 'Opera 12.1')
    )
    .pipe(rework(
      rework.at2x(),
      suitRework,
      pseudos(),
      {
        sourcemap: false
      }
    ))
    .pipe(concat('main.css'))
    .pipe(gulp.dest('dist/css'))
    .pipe(size());
});

gulp.task('html', ['css', 'js'], function () {
    var jsFilter = filter('*.js');
    var cssFilter = filter('*.css');

    return gulp.src('dist/**/*.html')
        .pipe(useref.assets())
        .pipe(jsFilter)
        .pipe(uglify())
        .pipe(jsFilter.restore())
        .pipe(cssFilter)
        .pipe(csso())
        .pipe(cssFilter.restore())
        .pipe(useref.restore())
        .pipe(useref())
        .pipe(gulp.dest('dist'))
        .pipe(size());
});

gulp.task('images', function () {
    return gulp.src('./images/**/*')
        .pipe(cache(imagemin({
            optimizationLevel: 3,
            progressive: true,
            interlaced: true
        })))
        .pipe(gulp.dest('dist/images'))
        .pipe(size());
});

gulp.task('clean', function () {
    return gulp.src(['dist'], { read: false })
      .pipe(clean());
});

gulp.task('upload', function () {
  var publisher = awspublish.create({
    key: process.env.AWS_ACCESS_KEY,
    secret: process.env.AWS_SECRET,
    bucket: 'invadedbynorway.com',
    region: 'eu-west-1'
  });

  //'Cache-Control': 'max-age=315360000, public'
  var headers = {
    'x-amz-acl': 'public-read'
  };

  // should work but retard headers are set
  //.pipe(awspublish.gzip({ ext: '.gz' }))

  // gzip and publish all js files (uploaded files will have a .gz extension)
  // Set Content-Length, Content-Type and Cache-Control headers
  // Set x-amz-acl to public-read by default
  // Set Content-Encoding headers
  return gulp.src('dist/**/*')
    .pipe(publisher.publish(headers))
    .pipe(publisher.sync())
    .pipe(publisher.cache()) // create a cache file to speed up next uploads
    .pipe(awspublish.reporter()); // print upload updates to console
});

gulp.task('metalsmith', function() {
  gulp.src(__dirname)
    .pipe(exec('node scripts/metalsmith.js', {
      silent: false
    }));
});

gulp.task('watch', ['build', 'connect'], function () {
  gulp.watch([
    './dist/**/*'
  ], function (event) {
      return gulp.src(event.path)
        .pipe(connect.reload());
  });

  gulp.watch(['./site/**/*.html', './templates/**/*.html'], ['metalsmith']);
  gulp.watch('./public/**/*', ['public']);
  gulp.watch('./css/**/*.css', ['css']);
  gulp.watch('./js/**/*.js', ['js']);
  gulp.watch('./images/**/*', ['images']);
});

gulp.task('connect', connect.server({
  root: './dist',
  port: 9000,
  open: {
    browser: 'Google Chrome'
  },
  livereload: true
}));

gulp.task('build', ['metalsmith', 'html', 'images', 'public']);

gulp.task('publish', ['build', 'upload']);
