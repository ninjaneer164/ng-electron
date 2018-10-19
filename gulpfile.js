const gulp = require('gulp');
const { series, watch } = require('gulp');
const cg = require('code-gen-ts').CodeGen;
const fs = require('fs');
const runElectron = require('gulp-run-electron');

const src = 'src';
const dst = 'dist';

const corePath = `${src}/app/_core`;
const coreIndex = `${corePath}/index.ts`;
const coreJson = `${corePath}/core.json`;
const coreTs = `${corePath}/core.ts`;

function core(cb) {
    const json = JSON.parse(fs.readFileSync(coreJson));
    const z = cg(json).generate();
    fs.writeFile(coreTs, `${z.output}\r\n`, cb);
    fs.writeFile(coreIndex, 'export * from \'./core\';\r\n', cb);
}

function _electron(cb) {
    gulp
        .src([
            `${src}/electron/main.js`,
            `${src}/electron/package.json`,
            `${src}/electron/renderer.js`
        ])
        .pipe(gulp.dest(dst));
    cb();
}

function __electron(cb) {
    gulp
        .src(dst)
        .pipe(runElectron([], {
            cwd: dst
        }));
    cb();
}

function _watch(cb) {
    watch(`${dst}/*`, function(cb_) {
        try {
            runElectron.rerun();
        } catch (e) { }
        cb_();
    });
    cb();
}

exports.build_prod = _electron;
exports.core = core;

exports.default = series(core, _electron, __electron, _watch);
