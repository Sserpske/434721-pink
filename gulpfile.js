"use strict";

var gulp = require("gulp");
var sass = require("gulp-sass");
var plumber = require("gulp-plumber");
var postcss = require("gulp-postcss");
var autoprefixer = require("autoprefixer");
var server = require("browser-sync").create();
var svgSprite = require('gulp-svg-sprite');
var svgmin = require('gulp-svgmin');
var cheerio = require('gulp-cheerio');
var replace = require('gulp-replace');
var webp = require('gulp-webp');

gulp.task("css", function () {
  return gulp.src("source/sass/style.scss")
    .pipe(plumber())
    .pipe(sass())
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(gulp.dest("source/css"))
    .pipe(server.stream());
});

gulp.task("server", function () {
  server.init({
    server: "source/",
    notify: false,
    open: true,
    cors: true,
    ui: false
  });

  gulp.watch("source/sass/**/*.{scss,sass}", gulp.series("css"));
  gulp.watch("source/*.html").on("change", server.reload);
});

gulp.task("start", gulp.series("css", "server"));


gulp.task('svg-sprite', function () {
  return gulp.src('source/img/svg-sprite/*.svg')
  // minify svg
    .pipe(svgmin({
      js2svg: {
        pretty: true
      }
    }))

    // build svg sprite
    .pipe(svgSprite({
      mode: {
        symbol: {
          sprite: "source/img/sprite.svg",
          render: {
            scss: {
              dest:'source/sass/sprite1.scss',
              template: "source/sass/template.scss"
            }
          }
        }
      }
    }))
    .pipe(gulp.dest('source/img'));
});

gulp.task('webp', () =>
    gulp.src("source/img/*.{png,jpg}")
        .pipe(webp({quality: 80}))
        .pipe(gulp.dest('source/img/test'))
);
