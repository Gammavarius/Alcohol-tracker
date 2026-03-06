const gulp = require('gulp');
const concat = require('gulp-concat');
const cleanCSS = require('gulp-clean-css');
const rename = require('gulp-rename');
const postcss = require('gulp-postcss');
const atImport = require('postcss-import');
const terser = require('gulp-terser');
const bro = require('gulp-bro');
const babelify = require('babelify');

gulp.task('css', function() {
    return gulp.src('src/css/main.css')
    .pipe(postcss([atImport()]))
    .pipe(concat('style.css'))
    .pipe(gulp.dest('dist/css'))
    .pipe(cleanCSS())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('dist/css'));
});

gulp.task('watch', function() {
    gulp.watch('src/css/**/*.css', gulp.series('css'));
    gulp.watch('src/js/**/*.js', gulp.series('js'));        
});

gulp.task('js', function() {
    return gulp.src('src/js/main.js')
    .pipe(bro({
        transform: [
            babelify.configure({
                presets: ['@babel/preset-env']
            })
        ]
    }))
    .pipe(gulp.dest('dist/js'))
    .pipe(terser())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('dist/js'));
});