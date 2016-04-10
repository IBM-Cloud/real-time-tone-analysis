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

// Default Task
gulp.task('default', ['bootstrap','jquery']);