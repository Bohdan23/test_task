'use strict';
 
var gulp = require('gulp');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var cssnano = require('gulp-cssnano');
var uglify = require('gulp-uglify');
var imagemin = require('gulp-imagemin');
var pngquant = require('imagemin-pngquant');
var del = require('del');
var watch = require('gulp-watch');

var path = {
    web: { 
        js: 'web/js/',
        css: 'web/css/',
        img: 'web/images/',
        fonts: 'web/fonts/',
        libsjs: 'web/js/vendor/',
        libscss: 'web/css/vendor/'
    },
    src: { 
        js: 'src/js/**/*.js',
        sass: 'src/sass/**/*.scss',
        img: 'src/images/**/*.*', 
        fonts: 'src/fonts/**/*.*'
    }
};

gulp.task('style:build', function(){
  return gulp.src(path.src.sass)
    .pipe(sass())
    .pipe(autoprefixer())
    .pipe(cssnano())
    .pipe(gulp.dest(path.web.css))
});

gulp.task('js:build', function(){
  return gulp.src(path.src.js)
    .pipe(uglify())
    .pipe(gulp.dest(path.web.js))
});

gulp.task('image:build', function () {
    return gulp.src(path.src.img) 
        .pipe(imagemin({ 
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()],
            interlaced: true
        }))
        .pipe(gulp.dest(path.web.img))
});

gulp.task('fonts:build', function () {
    return gulp.src(path.src.fonts) 
        .pipe(gulp.dest(path.web.fonts))
});

gulp.task('libsjs:build', function () {
    return gulp.src([
        'node_modules/jquery/dist/cdn/jquery-2.1.1.min.js',
        'node_modules/bootstrap/dist/js/bootstrap.min.js'
        ])
        .pipe(gulp.dest(path.web.libsjs))
});

gulp.task('libscss:build', function () {
    return gulp.src([
        'node_modules/bootstrap/dist/css/bootstrap.min.css'
        ])
        .pipe(gulp.dest(path.web.libscss))
});

gulp.task('libssass:build', function () {
    return gulp.src([
        'node_modules/css-reset-and-normalize-sass/scss/imports/_reset.scss'
        ])
        .pipe(gulp.dest('src/sass/helpers/'))
});

gulp.task('libs:build', gulp.series([
     'libsjs:build',
     'libscss:build'
]));

gulp.task('watch', function () {
    gulp.watch(path.src.sass, gulp.series(['style:build']));
    gulp.watch(path.src.js, gulp.series(['js:build']));
    gulp.watch(path.src.img, gulp.series(['image:build']));
    gulp.watch(path.src.fonts, gulp.series(['fonts:build']));
});

gulp.task('clean', function () {
  return del([ 'web/*' ]);
});

gulp.task('proj:build', gulp.series([
    'libssass:build',
    'clean',
    'style:build',
    'js:build',
    'libs:build', 
    'fonts:build',
    'image:build' 
]));

gulp.task('default', gulp.series(['proj:build', 'watch']));