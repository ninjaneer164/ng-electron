var gulp = require('gulp');
var exec = require('child_process').exec;
var runElectron = require('gulp-run-electron');

gulp.task('ng', function () {
    console.log('building ng...');
    return exec('ng build', function (error, stdout, stderr) {
        if (error) {
            console.error(`exec error: ${error}`);
            return;
        }
        console.log(`stdout: ${stdout}`);
        console.log(`stderr: ${stderr}`);
    });
});
gulp.task('electron', function () {
    console.log('launching electron...');
    gulp.src('dist')
        .pipe(runElectron([], { cwd: 'dist' }));
});

gulp.task('default', gulp.series(['ng', 'electron']));

gulp.watch('**/*.ts', gulp.series(['ng', runElectron.rerun]));
