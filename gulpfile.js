const fs = require('fs-extra')

const gulp = require('gulp')
const htmlmin = require('gulp-htmlmin')
const htmlclean = require('gulp-htmlclean')
const imagemin = require('gulp-imagemin')

const { info } = require('./lib/log')
const { buildUserJsDev, buildPageJsDev, buildI18nJsDev } = require('./build.dev')
const { buildUserJs, buildPageJs, buildI18nJs } = require('./build')

function packRequireJs () {
  const cookie = fs.readFileSync('src/requirejs/js.cookie.min.js')
  const jquery = fs.readFileSync('src/requirejs/jquery.min.js')
  const effect = fs.readFileSync('src/requirejs/effect.min.js')
  const popper = fs.readFileSync('src/requirejs/popper.min.js')
  const bootstrap = fs.readFileSync('src/requirejs/bootstrap.min.js')
  const runtime = fs.readFileSync('src/requirejs/runtime.min.js')
  const sweetalert2 = fs.readFileSync('src/requirejs/sweetalert2@9.min.js')
  const polyfill = fs.readFileSync('src/requirejs/polyfill.min.js')
  const overhang = fs.readFileSync('src/requirejs/overhang.min.js')
  const sha1 = fs.readFileSync('src/requirejs/sha1.min.js')
  const i18n = fs.readFileSync('src/requirejs/i18n.min.js')
  const all = [cookie, jquery, effect, popper, bootstrap, runtime, sweetalert2, polyfill, overhang, sha1, i18n].join('\n')
  fs.writeFileSync('require/require.min.js', all)
}
/* Development */
gulp.task('generate-userjs-dev', async function () {
  await buildUserJsDev()
})

gulp.task('generate-requirejs-dev', async function () {
  await buildI18nJsDev()
  await packRequireJs()
})

gulp.task('generate-html-dev', function () {
  info('Generate html files')
  return gulp.src(['./src/page/*.html', '!./src/page/announcement.html'])
    .pipe(htmlclean())
    .pipe(htmlmin({
      removeComments: true,
      collapseWhitespace: true,
      collapseInlineTagWhitespace: true,
      collapseBooleanAttributes: false,
      removeEmptyAttributes: false,
      removeScriptTypeAttributes: true,
      removeStyleLinkTypeAttributes: true,
      minifyJS: true,
      minifyCSS: true,
      minifyURLs: true
    }))
    .pipe(gulp.dest('./docs'))
})

gulp.task('generate-js-dev', async function () {
  info('Generate js files for webpage')
  const files = ['main.js', 'delayNotice.js']
  for (const e of files) {
    await buildPageJsDev(e)
  }
})

gulp.task('minify-images-dev', async () => {
  info('Minify image files')
  gulp.src('./src/page/img/*.*')
    .pipe(imagemin({
      optimizationLevel: 5,
      progressive: true,
      interlaced: false,
      multipass: false
    }))
    .pipe(gulp.dest('./docs/img'))
})
gulp.task('generate-other-file-dev', async () => {
  info('Generate file: version.json')
  const version = fs.readJSONSync('package.json').version
  fs.writeJsonSync('./docs/version.json', { version: version })
  info('Generate file: CNAME')
  await fs.writeFileSync('./docs/CNAME', 'auto-task-test.hclonely.com')
})
gulp.task('development', gulp.series(gulp.parallel('generate-userjs-dev', 'generate-requirejs-dev', 'generate-html-dev', 'minify-images-dev', 'generate-js-dev', 'generate-other-file-dev')))

/* Production */
gulp.task('generate-userjs', async function () {
  await buildUserJs()
})

gulp.task('generate-requirejs', async function () {
  await buildI18nJs()
  await packRequireJs()
})

gulp.task('generate-html', function () {
  info('Generate html files')
  return gulp.src(['./src/page/*.html', '!./src/page/announcement.html'])
    .pipe(htmlclean())
    .pipe(htmlmin({
      removeComments: true,
      collapseWhitespace: true,
      collapseInlineTagWhitespace: true,
      collapseBooleanAttributes: false,
      removeEmptyAttributes: false,
      removeScriptTypeAttributes: true,
      removeStyleLinkTypeAttributes: true,
      minifyJS: true,
      minifyCSS: true,
      minifyURLs: true
    }))
    .pipe(gulp.dest('./public'))
})

gulp.task('generate-js', async function () {
  info('Generate js files for webpage')
  const files = ['main.js']
  for (const e of files) {
    await buildPageJs(e)
  }
})

gulp.task('minify-images', async () => {
  info('Minify image files')
  gulp.src('./src/page/img/*.*')
    .pipe(imagemin({
      optimizationLevel: 5,
      progressive: true,
      interlaced: false,
      multipass: false
    }))
    .pipe(gulp.dest('./public/img'))
})
gulp.task('generate-other-file', async () => {
  info('Generate file: version.json')
  const version = fs.readJSONSync('package.json').version
  fs.writeJsonSync('./public/version.json', { version: version })
})

gulp.task('production', gulp.series(gulp.parallel('generate-userjs', 'generate-requirejs', 'generate-html', 'minify-images', 'generate-js', 'generate-other-file')))
