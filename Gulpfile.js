var babel = require('gulp-babel');
var gulp = require('gulp');
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');

gulp.task('compile', function() {
    return gulp
        .src([
            'src/**/*.js',
        ])
        .pipe(sourcemaps.init())
        .pipe(babel())
        .pipe(uglify())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('dist'))
    ;
});

gulp.task('watch', function() {
    gulp.watch('src/**/*.js', [
        'compile',
    ]);
});

gulp.task('default', [
    'compile',
    'watch',
]);
