/* eslint no-console:0 */

const skipRegex = require('../')
const assert = require('assert')

const cases = [
  ['/./g', 0, 4],
  ['"" + /\\//', 5, 9],
  ['/[/\\]]/', 0, 7],
  ['/[/\\]]\\/[[/]/', 0, 13],
  ['foo(5 /x/.1)', 6, 7],
  ['<a>{ typeof /5/ }</a>', 12, 15],
  ['<a>{ 5*5 /i.x }</a>', 9, 10],
  ['<a>{ 5*5 /i.x/1 }</a>', 9, 10],
  ['{ 5+/./.lastIndex }', 4, 7],
  ['<div>{ (2+3)/2 }</div>', 12, 13],
  ['return /a/', 7, 10],
  ['return bar /a/g', 11, 12],
  ['return bar + /a/g', 13, 17],
  ['return ++/a/.lastIndex', 9, 12],
  ['5 - ++/a/.lastIndex', 6, 9],
]

for (let i = 0; i < cases.length; i++) {
  const test = cases[i]
  if (i >= cases.length - 1) debugger
  const result = skipRegex(test[0], test[1])

  assert(result === test[2],
    'expected ' + result + ' to be ' + test[2] + ' testing `' + test[0] + '`')
}

console.log('Done.')
