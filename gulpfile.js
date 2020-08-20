const fs = require('fs-extra')

const gulp = require('gulp')
const htmlmin = require('gulp-htmlmin')
const htmlclean = require('gulp-htmlclean')
const imagemin = require('gulp-imagemin')

const { info } = require('./lib/log')
const { buildUserJsDev, budilPageJsDev } = require('./build.dev')
const { buildUserJs, budilPageJs } = require('./build')

/* Development */
gulp.task('generate-userjs-dev', async function () {
  await buildUserJsDev()
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
  const files = ['main.js']
  for (const e of files) {
    await budilPageJsDev(e)
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
gulp.task('development', gulp.series(gulp.parallel('generate-userjs-dev', 'generate-html-dev', 'minify-images-dev', 'generate-js-dev', 'generate-other-file-dev')))

/* Production */
gulp.task('generate-userjs', async function () {
  await buildUserJs()
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
    await budilPageJs(e)
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

gulp.task('production', gulp.series(gulp.parallel('generate-userjs', 'generate-html', 'minify-images', 'generate-js', 'generate-other-file')))
