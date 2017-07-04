import buble from 'rollup-plugin-buble'

const banner = [
  '/**',
  ' * skipRegex',
  ' * @version ' + require('./package.json').version,
  ' * @author aMarCruz',
  ' * @license MIT',
  ' */'
].join('\n')

export default {
  entry: 'src/skip-regex.js',
  plugins: [buble()],
  banner: banner,
  targets: [
    { format: 'cjs', dest: 'dist/skip-regex.js' },
    { format: 'es', dest: 'dist/skip-regex.esm.js' }
  ]
}
