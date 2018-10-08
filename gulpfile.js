var gulp = require('gulp');
var exec = require('child_process').exec;
var runElectron = require('gulp-run-electron');

gulp.task('ng', function() {
    console.log('building ng...');
    return exec('ng build --output-hashing=bundles', function(error, stdout, stderr) {
        if (error) {
            console.error(`exec error: ${error}`);
            return;
        }
        console.log(`stdout: ${stdout}`);
        console.log(`stderr: ${stderr}`);
    });
});
gulp.task('pre-electron', function() {
    var src = 'src/electron';
    return gulp.src([
            `${src}/main.js`,
            `${src}//package.json`,
            `${src}//renderer.js`
        ])
        .pipe(gulp.dest('dist'));
});
gulp.task('electron', function() {
    console.log('launching electron...');
    return gulp.src('dist')
        .pipe(runElectron([], {
            cwd: 'dist'
        }));
});

gulp.task('default', gulp.series(['ng', 'pre-electron', 'electron']));

gulp.watch('**/*.ts', gulp.series(['ng', 'pre-electron', runElectron.rerun]));
