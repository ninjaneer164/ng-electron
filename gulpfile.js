const gulp = require('gulp');
const { series, watch } = require('gulp');
const cg = require('code-gen-ts').CodeGen;
const fs = require('fs');
const runElectron = require('gulp-run-electron');

const corePath = './src/app/_core';
const coreIndex = `${corePath}/index.ts`;
const coreJson = `${corePath}/core.json`;
const coreTs = `${corePath}/core.ts`;

const dist = './dist';

function core(cb) {
    const json = JSON.parse(fs.readFileSync(coreJson));
    const z = cg(json).generate();
    fs.writeFile(coreTs, `${z.output}\r\n`, cb);
    fs.writeFile(coreIndex, 'export * from \'./core\';\r\n', cb);
}

function _electron(cb) {
    const src = 'src/electron';
    gulp.src([
        `${src}/main.js`,
        `${src}/package.json`,
        `${src}/renderer.js`
    ])
        .pipe(gulp.dest('dist'));
    cb();
}

function __electron(cb) {
    gulp.src('dist')
        .pipe(runElectron([], {
            cwd: 'dist'
        }));
    cb();
}

function _watch(cb) {
    watch(`${dist}/*`, function(cb_) {
        try {
            runElectron.rerun();
        } catch (e) { }
        cb_();
    });
    cb();
}

exports.default = series(core, series(_electron, __electron, _watch));
exports.build_prod = _electron;
