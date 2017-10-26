var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync').create();
var useref = require('gulp-useref');
var uglify =require('gulp-uglify');
var gulpif = require('gulp-if');
var cssnano = require('gulp-cssnano');
var imagemin = require('gulp-imagemin');
var cache = require('gulp-cache');
var del = require('del');
var runSequence = require('run-sequence');

gulp.task('hello', function() {
  console.log('Hello zell');
});

gulp.task('sass',function() {
  return gulp.src('app/scss/style.scss')
    .pipe(sass())
    .pipe(gulp.dest('app/css'))
    .pipe(browserSync.reload({
      stream: true
    }))
});

gulp.task('watch',['browserSync', 'sass'], function() {
  gulp.watch('app/scss/**/*.scss', ['sass']);
  gulp.watch('app/*.html', browserSync.reload);
  gulp.watch('app/js/**/*.js', browserSync.reload);
})


gulp.task('browserSync', function() {
  browserSync.init({
    server: {
      baseDir: 'app',
      routes: {
	"/bower_components": "bower_components"
      }
    },
  })
})

gulp.task('useref', function() {
  return gulp.src('app/*.html')
    .pipe(useref())
    .pipe(gulpif('*.js', uglify()))
    .pipe(gulp.dest('dist'))
});

gulp.task('images', function(){
  return gulp.src('app/images/**/*.+(png|jpg|gif|svg)')
  .pipe(cache(imagemin({
        // Setting interlaced to true
           interlaced: true
               })))
  .pipe(gulp.dest('dist/images'))
});

gulp.task('fonts', function() {
  return gulp.src('app/fonts/**/*')
  .pipe(gulp.dest('dist/fonts'))
})

gulp.task('build', function (callback) {
  runSequence('clean:dist', 
      ['sass', 'useref', 'images', 'fonts'],
      callback
    )
})

gulp.task('clean:dist', function() {
  return del.sync('dist');
})

gulp.task('default', function (callback) {
  runSequence(['sass','browserSync', 'watch'],
      callback
    )
})
