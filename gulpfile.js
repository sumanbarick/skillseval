var gulp  = require('gulp'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    javascriptObfuscator = require('gulp-javascript-obfuscator'),
    templateCache = require('gulp-angular-templatecache');

//Now requiring custom modules
var dataProcessor = require('./tools/node-tools/data-processor/process');


 
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

gulp.task('createTemplateCache', function () {
  return gulp.src(['www/**/*.html'])
    .pipe(templateCache({
        "module": "skillseval"
    }))
    .pipe(gulp.dest('www/dist/js/'));
});


// create a default task and just log a message
gulp.task('default', ['concatScripts', 'createTemplateCache'], function () {
    dataProcessor.start();
    console.log("Gulping Done...");
});