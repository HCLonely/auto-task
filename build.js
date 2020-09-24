const rollup = require('rollup')
const fs = require('fs-extra')
const path = require('path')
const { info, success } = require('./lib/log')
const { getBabelOutputPlugin } = require('@rollup/plugin-babel')
const json = require('@rollup/plugin-json')
const { doSomething } = require('./lib/doSomething')
const { uglify } = require('rollup-plugin-uglify')
const minCSS = require('./lib/minCss')

const version = fs.readJSONSync('package.json').version
const disableWebsites = ['takekey']

function loadWebsites () {
  const websiteDir = 'src/scripts/website/'
  info('Remove old file:', websiteDir + 'main.js')
  fs.removeSync(path.join(websiteDir, 'main.js'))
  info('Generate new file:', websiteDir + 'main.js')
  let template = fs.readFileSync(path.join(websiteDir, 'main.template'), 'utf-8')
  const websiteDirFiles = fs.readdirSync(websiteDir)
  const websites = []
  let importLine = ''
  for (const e of websiteDirFiles) {
    if (/\.js$/.test(e)) {
      const functionName = e.replace(/\.js$/, '')
      if (!disableWebsites.includes(functionName)) {
        websites.push(functionName)
        importLine += 'import { ' + functionName + ' } from \'./' + functionName + '\'\n'
      }
    }
  }
  template = template.replace('__IMPORT__', importLine).replace('__WEBSITE__', websites.join(', '))
  fs.writeFileSync(path.join(websiteDir, 'main.js'), template)
}
async function buildUserJs () {
  info('Empty directory: public')
  fs.emptyDirSync('./public')
  success('Empty directory: public')
  await loadWebsites()
  info('Package file to:', 'auto-task.user.js')
  const bundle = await rollup.rollup({
    input: 'src/scripts/main.js',
    plugins: [
      json({ namedExports: false })
    ]
  })

  await bundle.write({
    file: 'auto-task.user.js',
    format: 'cjs',
    plugins: [
      doSomething({
        addContainer: true
      }),
      getBabelOutputPlugin({
        presets: ['@babel/preset-env']
      }),
      doSomething({
        addHeader: true,
        replace: {
          __TEST__: '',
          __VERSION__: version,
          __FILENAME__: 'auto-task.user.js',
          __SITEURL__: 'auto-task.hclonely.com'
        }
      })
    ]
  })
  success('Write file to: auto-task.user.js')
  await generateHelper()
  await minCSS()
  success('Build user js completed!')
  info('Format file: auto-task.user.js')
}

async function buildPageJs (file) {
  const bundle = await rollup.rollup({
    input: 'src/page/js/' + file,
    plugins: [
      json({ namedExports: false })
    ]
  })
  await bundle.write({
    file: './public/js/' + file,
    format: 'cjs',
    plugins: [
      getBabelOutputPlugin({
        presets: ['@babel/preset-env']
      }),
      doSomething({
        addHeader: true,
        replace: {
          __FILENAME__: 'auto-task.user.js'
        }
      }),
      uglify()
    ]
  })
}

function generateHelper () {
  info('Generate file: auto-task-helper.user.js')
  const text = fs.readFileSync('./src/helper/auto-task-helper.user.js').toString().replace(/__VERSION__/g, version).replace(/__SITEURL__/g, 'auto-task.hclonely.com').replace(/__FILENAME__/g, 'auto-task-helper.user.js')
  fs.writeFileSync('./auto-task-helper.user.js', text)
  success('Write file to: auto-task-helper.user.js')
}
exports.buildUserJs = buildUserJs
exports.buildPageJs = buildPageJs
