require('dotenv').config();
const vuePlugin = require('esbuild-vue');
const postCssPlugin = require('esbuild-style-plugin');
const esbuild = require('esbuild');

const shouldBuild =
  typeof process.argv[2] !== 'undefined' && process.argv[2] === 'build';

let buildConfig = {
  logLevel: 'error',
  entryPoints: ['src/main.js'],
  bundle: true,
  minify: true,
  outfile: 'public/app.js',
  plugins: [
    vuePlugin(),
    postCssPlugin({
      postcss: {
        plugins: [require('tailwindcss'), require('autoprefixer')],
      },
    }),
  ],
  define: {
    'process.env.NODE_ENV': JSON.stringify(
      shouldBuild ? 'production' : 'development'
    ),
    env: JSON.stringify({
      INFURA_ID: process.env.INFURA_ID,
      CURIO_ADDR: process.env.CURIO_ADDR,
    }),
  },
};

if (shouldBuild) esbuild.build(buildConfig);
else esbuild.serve({ servedir: 'public', port: 8000 }, buildConfig);
