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
var csso = require('gulp-csso');
var rename = require("gulp-rename");
var imagemin = require('gulp-imagemin');
var del = require("del");

gulp.task("css", function () {
  return gulp.src("source/sass/style.scss")
    .pipe(plumber())
    .pipe(sass())
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(gulp.dest("build/css"))
    .pipe(csso())
    .pipe(rename("style.min.css"))
    .pipe(gulp.dest("build/css"))
    .pipe(server.stream());
});

gulp.task("server", function () {
  server.init({
    server: "build/",
    notify: false,
    open: true,
    cors: true,
    ui: false
  });

  gulp.watch("source/sass/**/*.{scss,sass}", gulp.series("css"));
  gulp.watch("source/*.html").on("change", server.reload);
});

gulp.task("images", function () {
  return gulp.src("source/img/*.{png,jpg}")
    .pipe(imagemin([
      imagemin.optipng({optimizationLevel: 3}),
      imagemin.jpegtran({progressive: true})
    ]))
    .pipe(gulp.dest("source/img/"))
});

gulp.task("svg", function () {
  return gulp.src("source/img/*.svg")
    .pipe(imagemin([
      imagemin.svgo()
    ]))
    .pipe(gulp.dest("build/img/"))
});

gulp.task("svg-sprite", function () {
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

gulp.task("webp", () =>
    gulp.src("source/img/*.{png,jpg}")
        .pipe(webp({quality: 90}))
        .pipe(gulp.dest("source/img/"))
);

gulp.task("clean", function() {
  return del("build")
})

gulp.task("copy", function() {
  return gulp.src([
      "source/fonts/*.{woff,woff2}",
      "source/img/**",
      "source/js/**",
      "source/*.html"
    ], {
      base: "source"
    })
    .pipe(gulp.dest("build"));
});

gulp.task("build", gulp.series(
  "clean",
  "copy",
  "css",
  "svg"
));

gulp.task("start", gulp.series("build", "server"));
