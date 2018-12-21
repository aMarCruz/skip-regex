/* eslint-disable no-console, no-loop-func */
/* global skipRegex */

describe('skipRegex', function () {
  /**
   * @type {Array.<[string, number, number]>}
   */
  var cases = [
    ['/s/', 0, 3],
    ['/./g', 0, 4],
    [' / / ', 1, 4],
    ['\n/ /', 1, 4],
    ['/ /', 0, 3],
    ['/\n/', 0, 1],
    ['/s/gmuyi', 0, 8],
    ['"" + /\\//', 5, 9],
    ['/[/\\]]/', 0, 7],
    ['/[/\\]]\\/[[/]/', 0, 13],
    ['/\\/**/.source', 0, 6],
    ['/[/**]/.source', 0, 7],
    ['/[//]/.source', 0, 6],
    ['/**//.///', 0, 1],
    ['/**//.///', 4, 7],
    ['/**//.///', 7, 8],
    ['/**///', 3, 4],
    ['/\\x00/', 0, 6],
    ['/\\u000d/', 0, 8],
    ['/\t/', 0, 3],             // NOTE unescaped tab
    ['/\x00\x01\x7F/', 0, 5],   // NOTE unescaped chars
    ['//s/', 0, 1],
    ['a//\n', 1, 2],
    ['5+/**//s/.test(x)', 6, 9],
    ['5+// \n/s/.test(x)', 6, 9],
    ['5*/5/.test(s)', 2, 5],
    ['5+/5/.test(s)', 2, 5],
    ['s--+/5/.test(s)', 4, 7],
    ['s++-/5/.test(s)', 4, 7],
    ['s+--/5/.source.length', 4, 7],      // invalid JS
    ['s-++/5/.source.length', 4, 7],      // invalid JS
    ['s+++/5/.source.length', 4, 7],
    ['++/5/m.test(s)', 2, 6],
    ['--/5/m.test(s)', 2, 6],
    ['+/5/m.test(s)', 1, 5],
    ['-/5/m.test(s)', 1, 5],
    ['a+ \n /5/m.test(s)', 5, 9],
    ['a- \n /5/m.test(s)', 5, 9],
    ['a+-\n /5/m.test(s)', 5, 9],
    ['a-+\n /5/m.test(s)', 5, 9],
    ['a+=\n /5/m.test(s)', 5, 9],
    ['a-=\n /5/m.test(s)', 5, 9],
    ['a/=\n /5/m.test(s)', 5, 9],
    ['a*=\n /5/m.test(s)', 5, 9],
    ['2**\n /5/g.test(s)', 5, 9],
    ['a**/a/.test(s)\n', 3, 6],
    ['2 ** /a/.test(s)', 5, 8],
    ['a=()=>/a/', 6, 9],
    ['RegExp(/(a)[/]/.source)', 7, 15],
    ['re=/\n5/', 3, 4],
    ['re=/\\nr/', 3, 8],
    ['o={r:/\\nr/}', 5, 10],
    ['a=[1, /r/, 2]', 6, 9],
    ['a=s.search(/"/)', 11, 14],
    ['a=!/5/.test(s)', 3, 6],
    ['a=2^ /5/.test(s)', 5, 8],
    ['a=2% /5/.test(s)|0', 5, 8],
    ['a=~~/5/.test(s)', 4, 7],
    ['a=1 & /5/.test(s)', 6, 9],
    ['a=1 | /5/.test(s)', 6, 9],
    ['a=s&& /5/.test(s)', 6, 9],
    ['a=s|| /5/.test(s)', 6, 9],
    ['a=1, /5/.test(s)', 5, 8],
    ['a=1,\n/5/.test(s)', 5, 8],
    ['a=n++\n/\\d/.exec(a)', 6, 7],       // must fail with ASI
    ['a=n++;\n/\\d/.exec(a)', 7, 11],     // it works
    ['a=n + 1  \n/./.exec(a)', 10, 11],   // again, must fail with ASI
    ['a=n + 1; \n/./.exec(a)', 10, 13],   // works
    ['foo(.../s/.exec(s))', 7, 10],
    ['foo(5. /5/)', 7, 8],
    ['foo(5 /x/.1)', 6, 7],
    ['foo(5/x/i)', 5, 6],
    ['foo(x/x/g)', 5, 6],
    ['foo(0./x/g)', 6, 7],
    ['foo({}/x/g)', 6, 7],
    ['foo((x)/x/g)', 7, 8],
    ['foo([x]/x/g)', 7, 8],
    ['foo(x-/x/g)', 6, 10],
    ['foo(x+/x/g)', 6, 10],
    ['foo(--/x/g)', 6, 10],
    ['foo(++/x/g)', 6, 10],
    ['<a>{ typeof /5/ }</a>', 12, 15],
    ['<a>{ typeOf /5/ }</a>', 12, 13],    // must fail
    ['<a>{ 5*5 /i.x }</a>', 9, 10],
    ['<a>{ 5*5 /x/i }</a>', 9, 10],
    ['<a>{ />/ }</a>', 5, 8],
    ['<a>{a </>/.source.length}</a>', 7, 10],
    ['<a>{1< />0/.source.length}</a>', 7, 11],
    ['<a>{9<</</.source.length}</a>', 7, 10],
    ['<div>{ (2+3)/a/1 }</div>', 12, 13],
    ['{ 5+/./.lastIndex }', 4, 7],
    ['return /a/\n', 7, 10],
    ['return (/a/)', 8, 11],
    ['return bar /a/g', 11, 12],
    ['return bar + /a/g', 13, 17],
    ['return ++/a/.test(s)', 9, 12],
    ['a?/r?/:/:/', 2, 6],
    ['a?/r?/:/:/', 7, 10],
    ['z=await /a/i.test(z)', 8, 12],
    ['\ncase /r/:\n', 6, 9],
    ['\nexport default /./', 16, 19],
    ['\ndefault:/./', 9, 12],
    ['do\n /r/.exec(s)\nwhile(1)', 4, 7],
    ['else /a/.test(a)\na', 5, 8],
    ['class X extends /s/.constructor {}', 16, 19],
    ['for(r in /a/.source){}', 9, 12],
    ['r instanceof /r/.contructor', 13, 16],
    ['a=void /r/', 7, 10],
    ['yield /./\n', 6, 9],
    // with wrong params
    [0, 0, 1],
    [null, 0, 1],
    [false, 0, 1],
    ['', 0, 1],
    ['', 1, 2],
    ['/', 0, 1],
    [' /s/', 0, 1],
    ['/s/', 1, 2],
    ['/ /s/', 1, 2],
    ['/ /s/', 3, 4],
    ['/s/g', -1, 3],   // NOTE: exec with indexes <0 will match shifting the result
    ['/end', 0, 1]
  ]

  function testIt (test) {
    var str = test[0] + ''
    var pos = test[1]
    var end = test[2]

    var msg = end - pos > 1 ? 'success' : 'fail'
    msg += ' at pos ' + pos + ' of: ' +
      str.replace(/\n/g, '\\n').replace(/\t/g, '\\t')

    it('must ' + msg, function () {
      // eslint-disable-next-line no-debugger
      if (str === '/s/g') { debugger }

      var result = skipRegex(str, pos)

      if (result !== end) {
        msg = 'expected ' + result + ' to be ' + end + ' testing `' + str + '`'
        throw new Error(msg)
      }
    })
  }

  // Loop all the test
  for (var i = 0; i < cases.length; i++) {
    testIt(cases[i])
  }

})
