// have simpLESS compiler running in conjunction with gulp !important

var gulp = require('gulp'),
    less = require('gulp-less'),
    sass = require('gulp-sass'),
    postcss = require('gulp-postcss'),
    rucksack = require('gulp-rucksack'),
    // sourcemaps = require('gulp-sourcemaps'),
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

    // .pipe(sourcemaps.init())

    .pipe(sass().on('error', sass.logError))

    .pipe(rucksack({autoprefixer: true}))

    .pipe(postcss(processors))

    // .pipe(sourcemaps.write('./maps'))

    .pipe(gulp.dest('/Volumes/sites/files.list.co.uk/assets/css/www'))
    // .pipe(gulp.dest('/Volumes/sites/files.list.co.uk/assets/css/food'))
    // .pipe(gulp.dest('/Volumes/sites/files.list.co.uk/assets/css/film'))
    // .pipe(gulp.dest('/Volumes/sites/files.list.co.uk/assets/css/edinburghfestival'))
    // .pipe(gulp.dest('/Volumes/sites/files.list.co.uk/assets/css/www')) /* for update form page */
    // .pipe(gulp.dest('/Volumes/sites/files.list.co.uk/assets/css/archive')) /* for archive */

    .pipe(gulp.dest('./css'))

    .pipe(browsersync.reload({stream: true}));
});


gulp.task('less', function(){
    return gulp.src('/Volumes/sites/less/awe-less/www/screen.less')
    // return gulp.src('/Volumes/sites/less/awe-less/food/screen.less')
    // return gulp.src('/Volumes/sites/less/dev-less/film/screen.less')
    // return gulp.src('/Volumes/sites/less/awe-less/edinburghfestival/screen.less')
    // return gulp.src('/Volumes/sites/less/awe-less/update/update.less') /* for update form page */
    // return gulp.src('/Volumes/sites/less/awe-less/archive_07_03/screen.less') /* for archive */

    // .pipe(sourcemaps.init())

    .pipe(less()).on('error', console.error.bind(console))

    // .pipe(sourcemaps.write('./maps'))

    .pipe(browsersync.reload({stream: true}));
});


gulp.task('build/admin', function(){
    var processors = [
            cssnano({discardUnused: false}),
    ];

    var lessStream = gulp.src(['/Volumes/sites/less/awe-less/www/screen.less'])
    // var lessStream = gulp.src(['/Volumes/sites/less/awe-less/food/screen.less'])
    // var lessStream = gulp.src(['/Volumes/sites/less/dev-less/film/screen.less'])
    // var lessStream = gulp.src(['/Volumes/sites/less/awe-less/edinburghfestival/screen.less'])
    // var lessStream = gulp.src(['/Volumes/sites/less/awe-less/update/update.less']) /* for update form page */
    // var lessStream = gulp.src(['/Volumes/sites/less/awe-less/archive_07_03/screen.less']) /* for archive */
    .pipe(less());

    var scssStream = gulp.src(['./scss/**/*.scss'])
    .pipe(sass());

    var cssStream = gulp.src(['./css/**/*.css'])
    .pipe(concat('css-files.css'));

    var mergedStream = merge(lessStream, scssStream, cssStream)
    .pipe(concat('screen.css'))
    // .pipe(concat('update.css')) /* for update form page */
    .pipe(postcss(processors))
    .pipe(gulp.dest('/Volumes/sites/files.list.co.uk/assets/css/www'));
    // .pipe(gulp.dest('/Volumes/sites/files.list.co.uk/assets/css/food'));
    // .pipe(gulp.dest('/Volumes/sites/files.list.co.uk/assets/css/film'));
    // .pipe(gulp.dest('/Volumes/sites/files.list.co.uk/assets/css/edinburghfestival'));
    // .pipe(gulp.dest('/Volumes/sites/files.list.co.uk/assets/css/www')); /* for update form page */
    // .pipe(gulp.dest('/Volumes/sites/files.list.co.uk/assets/css/archive')); /* for archive */

    return mergedStream

    .pipe(browsersync.reload({stream: true}));
});


gulp.task('watch', ['browser-sync'], function(){
    gulp.watch('./scss/**/*.scss', ['sass']);
    gulp.watch('./scss/**/*.scss', ['build/admin']);
    gulp.watch('/Volumes/sites/less/awe-less/**/*.less', ['build/admin']).on('change', browsersync.reload);
    gulp.watch('/Volumes/sites/less/dev-less/**/*.less').on('change', browsersync.reload);
    gulp.watch('/Volumes/sites/codebase/common/**/*.cfm').on('change', browsersync.reload);
});


gulp.task('default', ['sass', 'less', 'build/admin', 'watch', 'browser-sync']);
