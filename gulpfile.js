var gulp = require('gulp'),
    del = require('del'),
    concat = require('gulp-concat'),
    webpack = require('gulp-webpack'),
    connect = require('gulp-connect');

gulp.task('clean', function() {
    return del([
        'dist/'
    ]);
});

gulp.task('webpack', function() {
    return gulp.src('./src/musical-scales-d3.js')
        .pipe(webpack({
            module: {
                loaders: [
                    { test: /\.json$/, loader: 'json' }
                ]
            },
            output: {
                filename: 'musical-scales-d3.bundle.js'
            }
        }))
        .pipe(gulp.dest('dist/'));
});

gulp.task('connect', function() {
    connect.server({
        root: './',
        port: 5150
    });
});

gulp.task('default', ['clean', 'webpack', 'connect']);
