// MUST have simpLESS compiler running in conjunction with gulp

var gulp = require('gulp'),
    less = require('gulp-less'),
    sass = require('gulp-sass'),
    postcss = require('gulp-postcss'),
    rucksack = require('gulp-rucksack')
    plumber = require('gulp-plumber'),
    concat = require('gulp-concat'),
    cssnano = require('cssnano'),
    lost = require('lost'),
    merge = require('merge-stream'),
    browsersync = require('browser-sync');


    // Browser-sync serve task
    gulp.task('browser-sync', function(){
        browsersync.init({
            // proxy: 'http://dev.www.list.co.uk/'
            // proxy: 'http://dev.edinburghfestival.list.co.uk/'
            proxy: 'http://dev.film.list.co.uk'
        });
    });


// SASS compilation task
gulp.task('sass', function() {
    var processors = [
        cssnano({discardUnused: false}),
        lost()
    ];

    // compile single SASS file of choice
    gulp.src('./scss/**/*.{scss, sass}')

    .pipe(plumber())
    .pipe(sass())
    .pipe(rucksack({autoprefixer: true}))
    .pipe(postcss(processors))

    .pipe(gulp.dest('/Volumes/sites/files.list.co.uk/assets/css/www'))
    .pipe(gulp.dest('./css'))

    .pipe(browsersync.reload({stream: true}));
});


// LESS task
gulp.task('less', function() {
    return gulp.src('/Volumes/sites/less/awe-less/www/screen.less')

    .pipe(less()).on('error', console.error.bind(console))

    .pipe(browsersync.reload({stream: true}));
});


// LESS file merge task
gulp.task('build/admin', function(){
    var processors = [
        cssnano({discardUnused: false})
    ];

    // var lessStream = gulp.src('/Volumes/sites/less/awe-less/www/screen.less')
    // var lessStream = gulp.src(['/Volumes/sites/less/awe-less/food/screen.less'])
    var lessStream = gulp.src(['/Volumes/sites/less/dev-less/film/screen.less'])
    // var lessStream = gulp.src(['/Volumes/sites/less/awe-less/edinburghfestival/screen.less'])
    // var lessStream = gulp.src(['/Volumes/sites/less/awe-less/update/update.less'])   // UPDATE form page
    // var lessStream = gulp.src(['/Volumes/sites/less/awe-less/archive_07_03/screen.less'])   // ARCHIVE
    // var lessStream = gulp.src(['/Volumes/sites/less/awe-less/admin/preview.less'])  // ADMIN
    // var lessStream = gulp.src(['/Volumes/sites/less/awe-less/members/members.less'])  // MEMBERS
    .pipe(less());

    var scssStream = gulp.src('./scss/**/*.scss')
    .pipe(sass());

    var cssStream = gulp.src('./css/**/*.css')
    .pipe(concat('css-files.css'))

    var mergedStream = merge(lessStream, scssStream, cssStream)
    .pipe(concat('screen.css'))
    // .pipe(concat('update.css')) // UPDATE form page
    // .pipe(concat('preview.css'))  // ADMIN
    // .pipe(concat('members.css')) // MEMBERS

    .pipe(postcss(processors))

    // .pipe(gulp.dest('/Volumes/sites/files.list.co.uk/assets/css/www')); // compile last to rectify skewing of styles caused by processing of other files
    // .pipe(gulp.dest('/Volumes/sites/files.list.co.uk/assets/css/food'));
    .pipe(gulp.dest('/Volumes/sites/files.list.co.uk/assets/css/film'));
    // .pipe(gulp.dest('/Volumes/sites/files.list.co.uk/assets/css/edinburghfestival'));
    // .pipe(gulp.dest('/Volumes/sites/files.list.co.uk/assets/css/www'));    // UPDATE form page
    // .pipe(gulp.dest('/Volumes/sites/files.list.co.uk/assets/css/archive'));    // ARCHIVE
    // .pipe(gulp.dest('/Volumes/sites/files.list.co.uk/assets/css/admin'));  // ADMIN
    // .pipe(gulp.dest('/Volumes/sites/files.list.co.uk/assets/css/www'));  // MEMBERS

    return mergedStream

    .pipe(browsersync.reload({stream: true}));
});


// GULP watch task
gulp.task('watch', function(){
    gulp.watch('./scss/**/*.scss', ['sass']);
    gulp.watch('./scss/**/*.scss', ['build/admin']);
    gulp.watch('/Volumes/sites/less/awe-less/**/*.less', ['build/admin']).on('change', browsersync.reload);
    gulp.watch('/Volumes/sites/less/dev-less/**/*.less').on('change', browsersync.reload);
    gulp.watch('/Volumes/sites/codebase/common/**/*.cfm').on('change', browsersync.reload);
});


gulp.task('default', ['sass', 'less', 'build/admin', 'watch', 'browser-sync']);
