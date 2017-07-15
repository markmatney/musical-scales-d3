var gulp = require('gulp'),
    del = require('del'),
    webpack = require('gulp-webpack'),
    connect = require('gulp-connect');

gulp.task('clean', function() {
    return del([
        './dist/'
    ]);
});

gulp.task('assets', ['clean'], function() {
    gulp.src('node_modules/tether/dist/**/*')
        .pipe(gulp.dest('dist/assets/tether/'));
    gulp.src('node_modules/bootstrap/dist/**/*')
        .pipe(gulp.dest('dist/assets/bootstrap/'));
    gulp.src('node_modules/jquery/dist/**/*')
        .pipe(gulp.dest('dist/assets/jquery/'));
    gulp.src('./src/*.css')
        .pipe(gulp.dest('./dist/'));
});

gulp.task('webpack', ['clean'], function() {
    return gulp.src('./src/musical-scales-d3.js')
        .pipe(webpack(require('./webpack.config.js')))
        .pipe(gulp.dest('./dist/'));
});

gulp.task('build', ['clean', 'assets', 'webpack']);

gulp.task('server:start', ['build'], function() {
    connect.server({
        root: './',
        port: process.env.PORT || 5150
    });
});

gulp.task('watch', ['server:start'], function() {
    gulp.watch(['./src/**', 'index.html'], ['build']);
});

gulp.task('default', ['build', 'server:start', 'watch']);
