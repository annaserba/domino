const {
  src,
  dest,
  watch
} = require('gulp');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const sass = require('gulp-sass');

function javascript() {
  return src('src/**/*.js')
    .pipe(babel())
    .pipe(dest('dist/'))
    .pipe(uglify())
    .pipe(rename({
      extname: '.min.js'
    }))
    .pipe(dest('./dist/'));
}

function css() {
  return src('src/**/*.scss')
    .pipe(sass())
    .pipe(dest('./dist/'))
}
exports.default = function () {
  css();
  javascript();
  watch('src/**/*.scss', css);
  watch('src/**/*.js', javascript);
  src([
      './node_modules/angular-material/angular-material.css',
    ])
    .pipe(dest('./dist/lib/css/'))
  return src([
      './node_modules/angular/angular.js',
      './node_modules/angular-animate/angular-animate.js',
      './node_modules/angular-aria/angular-aria.js',
      './node_modules/angular-messages/angular-messages.js',
      './node_modules/angular-material/angular-material.js',
      './node_modules/fabric/dist/fabric.js'
    ])
    .pipe(dest('./dist/lib/js/'));
}