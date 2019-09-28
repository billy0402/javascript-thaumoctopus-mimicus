const gulp = require('gulp');
const babel = require('gulp-babel');
const nodemon = require('gulp-nodemon');
const browserify = require('browserify');
const source = require('vinyl-source-stream');

gulp.task('compile', function () {
        gulp.src('src/**/*.js')
            .pipe(babel({
                presets: ['@babel/preset-env']
            }))
            .pipe(gulp.dest('dist'));
    }
);

gulp.task('bundle', function () {
    const b = browserify({
        entries: 'src/index.js',
        debug: true
    })
        .transform('babelify', {presets: ['@babel/preset-env']});

    return b.bundle()
        .pipe(source('build/application.js'))
        .pipe(gulp.dest('dist'))
});

gulp.task('copy', function () {
        gulp.src('src/**/*.html')
            .pipe(gulp.dest('dist'));
    }
);

gulp.task('watch', function () {
        gulp.watch('src/**/*.js', gulp.series('compile', 'bundle'));
        gulp.watch('src/**/*.html', gulp.series('copy'));
    }
);

gulp.task('start', function () {
        nodemon({
            watch: 'dist',
            script: 'dist/index.js',
            ext: 'js',
            env: {'NODE_ENV': 'development'}
        });
    }
);

gulp.task('default', gulp.parallel(['compile', 'bundle', 'copy', 'watch'], 'start'));
