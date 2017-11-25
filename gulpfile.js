var gulp  = require('gulp'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    javascriptObfuscator = require('gulp-javascript-obfuscator'),
    templateCache = require('gulp-angular-templatecache');

//Now requiring custom modules
var dataProcessor = require('./tools/node-tools/data-processor/process');
 
//Process script files
gulp.task('concatScripts', function() {
  return gulp.src([
        'www/scripts/app.js',
        'www/modules/common/*Service.js',
        'www/modules/common/*Controller.js',
        'www/modules/**/*Service.js',
        'www/modules/**/*Controller.js',
        'www/scripts/router.js'
    ])
    .pipe(concat('nexaa.js'))
    .pipe(uglify())
    .pipe(javascriptObfuscator())
    .pipe(gulp.dest('www/dist/js/'));
});


//Create template.js
gulp.task('createTemplateCache', function () {
  return gulp.src(['www/**/*.html'])
    .pipe(templateCache({
        "module": "skillseval"
    }))
    .pipe(gulp.dest('www/dist/js/'));
});


// Copy all static assets
gulp.task('copyAssets', function() {
    gulp.src('www/configs/**')
    .pipe(gulp.dest('www/dist/configs'));

    gulp.src('www/css/**')
    .pipe(gulp.dest('www/dist/css'));

    gulp.src('www/favicon/**')
    .pipe(gulp.dest('www/dist/favicon'));

    gulp.src('www/fonts/**')
    .pipe(gulp.dest('www/dist/fonts'));

    gulp.src('www/images/**')
    .pipe(gulp.dest('www/dist/images'));

    gulp.src('www/lib/**')
    .pipe(gulp.dest('www/dist/lib'));

    gulp.src('www/data/**')
    .pipe(gulp.dest('www/dist/data'));

    gulp.src(['www/scripts/**', '!www/scripts/app.js', '!www/scripts/router.js'])
    .pipe(gulp.dest('www/dist/scripts'));

    gulp.src('www/index.html')
    .pipe(gulp.dest('www/dist'));
});


// create a default task and just log a message
gulp.task('default', ['concatScripts', 'createTemplateCache', 'copyAssets'], function () {
    dataProcessor.start();
    console.log("Gulping Done...");
});