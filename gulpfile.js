var cg = require('code-gen-ts').CodeGen;
var exec = require('child_process').exec;
var fs = require('fs');
var gulp = require('gulp');
var runElectron = require('gulp-run-electron');

var corePath = './src/app/_core';
var coreIndex = `${corePath}/index.ts`;
var coreJson = `${corePath}/core.json`;
var coreTs = `${corePath}/core.ts`;

gulp.task('core', function(callback) {
    var json = JSON.parse(fs.readFileSync(coreJson));
    var z = cg(json).generate();
    fs.writeFile(coreTs, `${z.output}\r\n`, callback);
    fs.writeFile(coreIndex, 'export * from \'./core\';\r\n', callback);
});

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
        `${src}/package.json`,
        `${src}/renderer.js`
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

gulp.task('browser', function() {
    gulp.series(['core']);
});

gulp.task('default', function() {
    gulp.series(['core', 'ng', 'pre-electron', 'electron']);
    gulp.watch('**/*.ts', gulp.series(['ng', 'pre-electron', runElectron.rerun]));
});

gulp.watch(coreJson, gulp.series(['core']));
