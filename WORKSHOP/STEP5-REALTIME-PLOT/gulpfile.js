var gulp = require('gulp');

// Grab js files from bower_components and add them to public/vendor
gulp.task('bootstrap', function() {
    return gulp.src('bower_components/bootstrap/dist/js/bootstrap.min.js')
      .pipe(gulp.dest('public/vendor/bootstrap'));
});
gulp.task('jquery', function() {
    return gulp.src('bower_components/jquery/dist/*.min.*')
      .pipe(gulp.dest('public/vendor/jquery'));
});
gulp.task('element-resize', function() {
    return gulp.src('bower_components/javascript-detect-element-resize/detect-element-resize.js')
      .pipe(gulp.dest('public/vendor/javascript-detect-element-resize'));
});
gulp.task('smoothie', function() {
    return gulp.src('bower_components/smoothie/smoothie.js')
      .pipe(gulp.dest('public/vendor/smoothie'));
});
gulp.task('random-color', function() {
    return gulp.src('bower_components/randomcolor/randomColor.js')
      .pipe(gulp.dest('public/vendor/random-color'));
});

// Default Task
gulp.task('default', ['bootstrap','jquery','element-resize', 'smoothie', 'random-color']);