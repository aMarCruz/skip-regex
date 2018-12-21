const buble = require('rollup-plugin-buble')
const uglify = require('rollup-plugin-uglify').uglify
const pkg = require('./package.json')

export default {
  input: pkg.source,
  plugins: [
    buble({
      target: { ie: 9 },
    }),
    uglify(),
  ],
  output: {
    file: pkg.browser,
    format: 'umd',
    name: 'skipRegex',
  },
}
