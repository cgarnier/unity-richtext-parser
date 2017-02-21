const gulp = require('gulp');
const babel = require('gulp-babel');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
gulp.task('default', () =>
  gulp.src('src/index.js')
    .pipe(babel({
      presets: ['es2015']
    }))
    .pipe(uglify())
    .pipe(concat('index.min.js', {newLine: ';'}))
    .pipe(gulp.dest('dist'))
);