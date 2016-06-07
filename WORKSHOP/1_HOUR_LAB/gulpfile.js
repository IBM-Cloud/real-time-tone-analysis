var gulp = require('gulp');

// Grab js files from /bower_components and add them to public/vendor
gulp.task('bootstrap', function() {
    return gulp.src('bower_components/bootstrap/dist/js/bootstrap.min.js')
      .pipe(gulp.dest('public/vendor/bootstrap'));
});
gulp.task('jquery', function() {
    return gulp.src('bower_components/jquery/dist/*.min.*')
      .pipe(gulp.dest('public/vendor/jquery'));
});

// Grab the files from /updated_files so we can fast-forward steps
gulp.task('server-files', function() {
    return gulp.src(['updated_files/*.js', 'updated_files/(?!package).json'])
      .pipe(gulp.dest('./'));
});

gulp.task('view-files', function() {
    return gulp.src('updated_files/public/*.html')
      .pipe(gulp.dest('./public'));
});

gulp.task('js-files', function() {
    return gulp.src('updated_files/public/js/*.js')
      .pipe(gulp.dest('./public/js'));
});

// Default Task
gulp.task('default', ['bootstrap','jquery']);

// Lightspeed Task
gulp.task('lightspeed', ['server-files', 'view-files', 'js-files']);