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

// Grab the files from /updated_files so we can fast-forward steps
gulp.task('server-files', function() {
    return gulp.src(['updated_files/*.js', 'updated_files/*.json'])
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
gulp.task('default', ['bootstrap','jquery','element-resize', 'smoothie', 'random-color']);
// Lightspeed Task
gulp.task('lightspeed', ['server-files', 'view-files', 'js-files']);