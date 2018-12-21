import buble from 'rollup-plugin-buble'
import cleanup from 'rollup-plugin-cleanup'

const pkg = require('./package.json')
const banner = `/**
 * skip-regex v${pkg.version}
 * @author aMarCruz
 * @license MIT
 */
/*eslint-disable*/`

export default {
  input: pkg.source,
  plugins: [
    buble({
      target: { ie: 9 },
    }),
    cleanup({
      comments: ['some', 'eslint'],
    }),
  ],
  output: [
    {
      banner,
      file: pkg.main,
      format: 'cjs',
    },
    {
      banner,
      file: pkg.module,
      format: 'es',
    },
  ]
}
