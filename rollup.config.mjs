import * as fs from 'fs';
import path from 'node:path';
import typescript from '@rollup/plugin-typescript';
import progress from 'rollup-plugin-progress';
import sizes from 'rollup-plugin-sizes';
import { visualizer } from "rollup-plugin-visualizer";
import scss from 'rollup-plugin-scss';
import * as sass from 'sass';
import postcss from 'postcss';
import autoprefixer from 'autoprefixer';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import terser from '@rollup/plugin-terser';
import { getBabelOutputPlugin } from '@rollup/plugin-babel';
import svg from 'rollup-plugin-svg-import';

const VERSION = JSON.parse(fs.readFileSync('package.json')).version;
const NAME = 'auto-task';

const moduleGlobals = new Map(Object.entries({
  social: 'social',
  'social/results': 'social',
  'social/adapter': 'social',
  steam: 'steam',
  'steam/steamWeb': 'steamWeb',
  'steam/steamASF': 'steamASF',
  vk: 'vk',
  twitch: 'twitch',
  twitter: 'twitter',
  reddit: 'reddit',
  youtube: 'youtube'
}).map(([entry, namespace]) => [path.resolve('modules', entry), `AutoTaskModules.${namespace}`]));

const externalGlobals = {
  sweetalert2: 'Swal',
  'js-cookie': 'Cookies',
  'browser-tool': 'browser',
  keyboardjs: 'keyboardJS',
  dayjs: 'dayjs',
  'node-inspect-extracted': 'util'
};
const globals = id => moduleGlobals.get(id) || externalGlobals[id];
const interop = id => moduleGlobals.has(id) ? 'esModule' : 'default';

const modulesBuild = {
  input: 'modules/browser.ts',
  output: {
    file: 'dist/auto-task.modules.js',
    format: 'iife',
    name: 'AutoTaskModules',
    plugins: [
      getBabelOutputPlugin({ presets: ['@babel/preset-env'], allowAllFormats: true }),
      terser({ format: { comments: false } })
    ]
  },
  plugins: [nodeResolve(), typescript()]
};

const userscriptBuild = {
  input: 'src/index.ts',
  output: [
    {
      file: 'dist/auto-task.user.js',
      format: 'iife',
      globals,
      interop,
      plugins: [
        // Generate one report; concurrent outputs must not write the same file.
        visualizer({
          gzipSize: true,
          filename: 'doc/docs/.vuepress/public/report.html'
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
              .replace(/__NAME__/g, NAME)
              .replace(/__UPDATE_URL__/g, `https://github.com/HCLonely/auto-task/raw/main/dist/${NAME}.user.js`)
              .replace(/__CHECK_DEPENDENCIES__/g, fs.readFileSync('./src/scripts/checkDependence.js').toString())
              .replace(/__ALL_URL__/g, `https://github.com/HCLonely/auto-task/raw/main/dist/${NAME}.all.user.js`)
          },
        })
      ]
    },
    {
      file: 'dist/auto-task.compatibility.user.js',
      format: 'iife',
      globals,
      interop,
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
              .replace(/__UPDATE_URL__/g, `https://github.com/HCLonely/auto-task/raw/main/dist/${NAME}.compatibility.user.js`)
              .replace(/__CHECK_DEPENDENCIES__/g, fs.readFileSync('./src/scripts/checkDependence.js').toString())
              .replace(/__ALL_URL__/g, `https://github.com/HCLonely/auto-task/raw/main/dist/${NAME}.compatibility.all.user.js`)
          },
        })
      ]
    },
    {
      file: 'dist/auto-task.min.user.js',
      format: 'iife',
      globals,
      interop,
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
              .replace(/__UPDATE_URL__/g, `https://github.com/HCLonely/auto-task/raw/main/dist/${NAME}.min.user.js`)
              .replace(/__CHECK_DEPENDENCIES__/g, fs.readFileSync('./src/scripts/checkDependence.js').toString())
              .replace(/__ALL_URL__/g, `https://github.com/HCLonely/auto-task/raw/main/dist/${NAME}.min.all.user.js`)
          },
        })
      ]
    }
  ],
  plugins: [
    {
      name: 'userscript-modules',
      resolveId(source, importer) {
        if (!importer || !source.startsWith('.')) return null;
        const id = path.resolve(path.dirname(importer), source);
        return moduleGlobals.has(id) ? { id, external: true } : null;
      }
    },
    progress(),
    sizes({
      details: true,
    }),
    nodeResolve(),
    typescript(),
    scss({
      output: false,
      sass,
      processor: async (css) => {
        const result = await postcss([autoprefixer()]).process(css, { from: undefined });
        return result.css.replace(/^\uFEFF/, '');
      },
      outputStyle: 'compressed',
      failOnError: true,
    }),
    svg({
      stringify: true
    })
  ],
  external: ['sweetalert2', 'js-cookie', 'keyboardjs', 'dayjs', 'node-inspect-extracted', 'browser-tool']
};

export default [modulesBuild, userscriptBuild];
