var gulp = require('gulp'),
    less = require('gulp-less'),
    sass = require('gulp-sass'),
    postcss = require('gulp-postcss'),
    rucksack = require('gulp-rucksack'),
    sourcemaps = require('gulp-sourcemaps'),
    concat = require('gulp-concat'),
    cssnano = require('cssnano'),
    lost = require('lost'),
    merge = require('merge-stream'),
    browsersync = require('browser-sync').create();


gulp.task('browser-sync', function(){
    browsersync.init({
        proxy: "http://dev.www.list.co.uk/"
    });
});


gulp.task('sass', function(){
    var processors = [
            cssnano({discardUnused: false}),
            lost()
    ];

    return gulp.src('./scss/**/*.{scss, sass}')

    .pipe(sourcemaps.init())

    .pipe(sass().on('error', sass.logError))

    .pipe(rucksack({autoprefixer: true}))

    .pipe(postcss(processors))

    .pipe(sourcemaps.write('./maps'))

    .pipe(gulp.dest('/Volumes/sites/files.list.co.uk/assets/www/css'))

    .pipe(gulp.dest('./css'))

    .pipe(browsersync.reload({stream: true}));
});


gulp.task('less', function(){
    return gulp.src('/Volumes/sites/less/awe-less/www/screen.less')

    .pipe(sourcemaps.init())

    .pipe(less()).on('error', console.error.bind(console))

    .pipe(sourcemaps.write('./maps'))

    .pipe(browsersync.reload({stream: true}));
});


gulp.task('build/admin', function(){
    var processors = [
            cssnano({discardUnused: false}),
    ];

    var lessStream = gulp.src(['/Volumes/sites/less/awe-less/www/screen.less'])
    .pipe(less());

    var scssStream = gulp.src(['./scss/**/*.scss'])
    .pipe(sass());

    var cssStream = gulp.src(['./css/**/*.css'])
    .pipe(concat('css-files.css'));

    var mergedStream = merge(lessStream, scssStream, cssStream)
    .pipe(concat('screen.css'))
    .pipe(postcss(processors))
    .pipe(gulp.dest('/Volumes/sites/files.list.co.uk/assets/css/www'));

    return mergedStream

    .pipe(browsersync.reload({stream: true}));
});


gulp.task('watch', ['browser-sync'], function(){
    gulp.watch('./scss/**/*.scss', ['sass']);
    gulp.watch('/Volumes/sites/less/awe-less/www/screen.less', ['less']).on('change', browsersync.reload);
    gulp.watch('./scss/**/*.scss', ['build/admin']);
    gulp.watch('/Volumes/sites/less/awe-less/**/*.less', ['build/admin']).on('change', browsersync.reload);
    gulp.watch('/Volumes/sites/codebase/common/**/*.cfm').on('change', browsersync.reload);
});


gulp.task('default', ['sass', 'less', 'build/admin', 'watch', 'browser-sync']);
