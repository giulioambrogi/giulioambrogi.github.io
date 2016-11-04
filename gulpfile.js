'use strict';

var fs                 = require("fs"),
    gulp               = require('gulp'),
    rename             = require("gulp-rename"),
    browserify         = require("browserify"),
    source             = require('vinyl-source-stream'),
    sass               = require('gulp-sass'),
    prefix             = require('gulp-autoprefixer'),
    buffer             = require('vinyl-buffer'),
    minifyCSS          = require('gulp-cssnano'),
    size               = require('gulp-filesize'),
    uglify             = require('gulp-uglify'),
    gutil              = require('gulp-util'),
    svgstore           = require('gulp-svgstore'),
    svgmin             = require('gulp-svgmin'),
    del                = require('del'),
    mkdirp             = require('mkdirp'),
    runSequence        = require('run-sequence'),
    path               = require('path'),
    cheerio            = require('gulp-cheerio'),
    $                  = require('jquery'),
    inject             = require('gulp-inject'),
    webserver = require('gulp-webserver'),
    handlebars = require('gulp-compile-handlebars'),
    htmlmin = require('gulp-htmlmin'),
    sources            = {
      scripts: {
        path: './public/assets/src/javascripts',
        entries: './public/assets/src/javascripts/application.js',
        dist_path: './public/assets/dist/javascripts'
      },
      css: {
        src_path: './public/assets/src/scss/**/*.scss',
        dist_path: './public/assets/dist/css'
      },
      asset_path: './public/assets/dist/**'
    };

var onerror = function(err) {
  if (err) gutil.log(gutil.colors.magenta('!! Error'), ':', gutil.colors.cyan(err.plugin), '-', gutil.colors.red(err.message));
    console.log(err)
};

gulp.task('scripts', function() {
  return browserify({
    entries: [sources.scripts.entries],
    paths: sources.scripts.path
  })
    .bundle()
    .pipe(source('application.min.js'))
    .pipe(buffer())
    .pipe(uglify())
    .pipe(gulp.dest(sources.scripts.dist_path));
});

gulp.task('minify-html', function() {
  return gulp.src('./index.html')
    .pipe(htmlmin({collapseWhitespace: true, removeComments: true}))
    .pipe(gulp.dest('./'));
});


gulp.task('scripts-dev', function() {
  var b = browserify({
    entries: [sources.scripts.entries],
    paths: ['./node_modules', sources.scripts.path],
    debug: true,
    cache: {},
    packageCache: {},
    fullPaths: true
  });

  return b.bundle()
    .pipe(source('application.js'))
    .pipe(gulp.dest(sources.scripts.dist_path));
});

gulp.task('styles', function() {
  gulp.src([sources.css.src_path])
    .pipe(sass())
    .on('error', onerror)
    .pipe(prefix("last 3 version", "> 1%", "ie 9"))
    .pipe(minifyCSS())
    .pipe(gulp.dest(sources.css.dist_path))
    .pipe(size());
});

gulp.task('webserver', function() {
  gulp.src('./')
    .pipe(webserver({
      fallback: 'index.html'
    }));
});


gulp.task('hbs', function () {
    var templateData = require('./public/assets/src/data/global.json'),

    options = {
        ignorePartials: true,
        partials : {
        },
        batch : ['./public/assets/src/views/partials'],
        helpers : {
            capitals : function(str){
                return str.toUpperCase();
            }
        }
    }

    return gulp.src('./public/assets/src/views/index.hbs')
        .pipe(handlebars(templateData, options))
        .pipe(rename('index.html'))
        .pipe(gulp.dest('./'));
});

gulp.task('watch', function() {
  gulp.watch('./public/assets/src/javascripts/**/*', ['scripts-dev']);
  gulp.watch('./public/assets/src/scss/**/*.scss', ['styles']);
  gulp.watch('./public/assets/src/views/**/*.hbs', ['hbs']);
});

gulp.task('default', ['webserver', 'watch']);


