const gulp = require('gulp');
const babel = require('gulp-babel');
const nodemon = require('gulp-nodemon');

gulp.task('compile', function () {
        gulp.src('src/**/*.js')
            .pipe(babel({
                presets: ['@babel/preset-env']
            }))
            .pipe(gulp.dest('dist'));
    }
);

gulp.task('watch', function () {
        gulp.watch('src/**/*.js', gulp.series('compile'));
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

gulp.task('default', gulp.parallel(['compile', 'watch'], 'start'));
