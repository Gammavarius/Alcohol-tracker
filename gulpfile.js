const gulp = require('gulp');
const concat = require('gulp-concat');
const cleanCSS = require('gulp-clean-css');
const rename = require('gulp-rename');
const postcss = require('gulp-postcss');
const atImport = require('postcss-import');

gulp.task('css', function() {
    return gulp.src('src/css/main.css')
    .pipe(postcss([atImport()]))
    .pipe(concat('style.css'))
    .pipe(gulp.dest('dist/css'))
    .pipe(cleanCSS())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('dist/css'));
});