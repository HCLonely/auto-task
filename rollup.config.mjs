import * as fs from 'fs';
import typescript from '@rollup/plugin-typescript';
import progress from 'rollup-plugin-progress';
import sizes from 'rollup-plugin-sizes';
import { visualizer } from "rollup-plugin-visualizer";
import scss from 'rollup-plugin-scss';
import postcss from 'postcss';
import autoprefixer from 'autoprefixer';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import terser from '@rollup/plugin-terser';
import { getBabelOutputPlugin } from '@rollup/plugin-babel';
import svg from 'rollup-plugin-svg-import';

const VERSION = JSON.parse(fs.readFileSync('package.json')).version;
const NAME = 'auto-task';

export default {
  input: 'src/index.ts',
  output: [
    {
      file: 'dist/auto-task.user.js',
      format: 'iife',
      globals: {
        sweetalert2: 'Swal',
        'js-cookie': 'Cookies',
        'browser-tool': 'browser',
        keyboardjs: 'keyboardJS',
        dayjs: 'dayjs',
        'node-inspect-extracted': 'util'
      },
      plugins: [
        terser({
          sourceMap: false,
          compress: false,
          mangle: false,
          output: {
            beautify: true,
            indent_level: 2,
            braces: true,
            quote_style: 1,
            preamble: fs.readFileSync('./src/scripts/header.js').toString()
              .replace(/__VERSION__/g, VERSION)
              .replace(/__NAME__/g, NAME)
              .replace(/__UPDATE_URL__/g, `https://github.com/HCLonely/auto-task-v4/raw/main/dist/${NAME}.user.js`)
              .replace(/__CHECK_DEPENDENCIES__/g, fs.readFileSync('./src/scripts/checkDependence.js').toString())
              .replace(/__ALL_URL__/g, `https://github.com/HCLonely/auto-task-v4/raw/main/dist/${NAME}.all.user.js`)
          },
        })
      ]
    },
    {
      file: 'dist/auto-task.compatibility.user.js',
      format: 'iife',
      globals: {
        sweetalert2: 'Swal',
        'js-cookie': 'Cookies',
        'browser-tool': 'browser',
        keyboardjs: 'keyboardJS',
        dayjs: 'dayjs',
        'node-inspect-extracted': 'util'
      },
      plugins: [
        getBabelOutputPlugin({
          presets: [
            '@babel/preset-env'
          ],
          allowAllFormats: true
        }),
        terser({
          sourceMap: false,
          compress: false,
          mangle: false,
          output: {
            beautify: true,
            indent_level: 2,
            braces: true,
            quote_style: 1,
            preamble: fs.readFileSync('./src/scripts/header.js').toString()
              .replace(/__VERSION__/g, VERSION)
              .replace(/__NAME__/g, `${NAME}.compatibility`)
              .replace(/__UPDATE_URL__/g, `https://github.com/HCLonely/auto-task-v4/raw/main/dist/${NAME}.compatibility.user.js`)
              .replace(/__CHECK_DEPENDENCIES__/g, fs.readFileSync('./src/scripts/checkDependence.js').toString())
              .replace(/__ALL_URL__/g, `https://github.com/HCLonely/auto-task-v4/raw/main/dist/${NAME}.compatibility.all.user.js`)
          },
        })
      ]
    },
    {
      file: 'dist/auto-task.min.user.js',
      format: 'iife',
      globals: {
        sweetalert2: 'Swal',
        'js-cookie': 'Cookies',
        'browser-tool': 'browser',
        keyboardjs: 'keyboardJS',
        dayjs: 'dayjs',
        'node-inspect-extracted': 'util'
      },
      plugins: [
        getBabelOutputPlugin({
          presets: [
            '@babel/preset-env'
          ],
          allowAllFormats: true
        }),
        terser({
          sourceMap: false,
          compress: true,
          mangle: {
            toplevel: true
          },
          output: {
            beautify: false,
            indent_level: 2,
            braces: true,
            quote_style: 1,
            preamble: fs.readFileSync('./src/scripts/header.js').toString()
              .replace(/__VERSION__/g, VERSION)
              .replace(/__NAME__/g, `${NAME}.min`)
              .replace(/__UPDATE_URL__/g, `https://github.com/HCLonely/auto-task-v4/raw/main/dist/${NAME}.min.user.js`)
              .replace(/__CHECK_DEPENDENCIES__/g, fs.readFileSync('./src/scripts/checkDependence.js').toString())
              .replace(/__ALL_URL__/g, `https://github.com/HCLonely/auto-task-v4/raw/main/dist/${NAME}.min.all.user.js`)
          },
        })
      ]
    }
  ],
  plugins: [
    progress(),
    sizes({
      details: true,
    }),
    visualizer({
      gzipSize: true,
      filename: 'doc/docs/.vuepress/public/report.html'
    }),
    nodeResolve(),
    typescript(),
    scss({
      output: false,
      processor: () => postcss([autoprefixer()]),
      outputStyle: 'compressed',
    }),
    svg({
      stringify: true
    })
  ],
  external: ['sweetalert2', 'js-cookie', 'keyboardjs', 'dayjs', 'node-inspect-extracted', 'browser-tool']
};
