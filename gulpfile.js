var gulp = require('gulp')
var pug = require('gulp-pug')
var stylus = require('gulp-stylus')

var path = {
    'pug_file': ['views/!(_)*.pug'],
    'stylus_file': ['views/!(_)*.styl']
}
var dest_path = './html/'

gulp.task('watch', function () {
    gulp.watch(path.pug_file, ['pug'])
    gulp.watch(path.stylus_file, ['stylus'])
})

gulp.task('pug', function () {
    return gulp.src(path.pug_file)
    .pipe(pug({
        pretty: true
    }))
    .pipe(gulp.dest(dest_path))
})

gulp.task('stylus', function () {
    return gulp.src(path.stylus_file)
    .pipe(stylus({
        compress: true
    }))
    .on('error', function (err) {
        console.error('Error', err.message)
    })
    .pipe(gulp.dest(dest_path))
})