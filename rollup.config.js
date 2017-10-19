import buble from 'rollup-plugin-buble'

const banner = [
  '/**',
  ' * skipRegex v' + require('./package.json').version,
  ' * @author aMarCruz',
  ' * @license MIT',
  ' */'
].join('\n')

export default {
  input: 'src/skip-regex.js',
  plugins: [buble()],
  banner,
  output: [
    { format: 'cjs', file: 'dist/skip-regex.js' },
    { format: 'es', file: 'dist/skip-regex.esm.js' }
  ]
}
