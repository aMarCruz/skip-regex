/**
 * @exports skipRegex
 */
export default (function () {

  // Safe characters that may precede a regex (including `=>` and `**`)
  const beforeReChars = '[{(,;:?=|&!^~<>%*/'
  const beforeReSign = beforeReChars + '+-'

  // Keyword that can may precede a regex
  const beforeReWords = [
    'await',
    'case',
    'default',
    'do',
    'else',
    'extends',
    'in',
    'instanceof',
    'of',
    'prefix',
    'return',
    'typeof',
    'void',
    'yield',
  ]

  // Last chars of all the beforeReWords elements to speed up the process.
  const wordsEndChar = beforeReWords.reduce((s, w) => s + w.slice(-1), '')

  // Matches literal regex from the start of the buffer.
  // The buffer to search must not include line-endings.
  const R_JS_REGEX = /^\/(?=[^*/])[^[/\\]*(?:(?:\\.|\[(?:\\.|[^\]\\])*\])[^[\\/]*)*?\/[gimuys]*/

  // Valid characters for JavaScript variable names and literal numbers.
  const R_JS_VCHAR = /[$\w]/

  // Matches all up to the end of line.
  const R_LINE_ALL = /.*/g

  /**
   * Searches the position of the previous non-blank character inside `code`
   * starting at `pos - 1`.
   *
   * @param   {string} code - Buffer to search
   * @param   {number} pos  - Starting position
   * @returns {number} Position of the first non-blank character to the left.
   * @private
   */
  const _prev = function (code, pos) {
    while (--pos >= 0 && /\s/.test(code[pos])) {}
    return pos
  }

  /**
   * Checks if the character at the `start` position within `code` can be
   * a regular expression and returns the ending position of this regex, or
   * `start+1` if it not.
   *
   * NOTE: Ensure `start` points to a slash (this is not checked).
   *
   * @param {string} code Text buffer
   * @param {number} start Position of the a slash within `code`
   * @returns {number} Position of the chararacter following the regex.
   */
  return function skipRegex (code, start) {

    // `re.exec()` will extract from the slash to the end of the line
    const re = R_LINE_ALL
    let pos = re.lastIndex = start++
    let match = re.exec(code)

    // and this `match()` will match the possible regex.
    match = match && match[0].match(R_JS_REGEX)

    if (match) {
      // Stores the ending position of this prossible regex.
      const next = pos + match[0].length

      pos = _prev(code, pos)
      let c = code[pos]

      // start of buffer or safe prefix?
      if (pos < 0 || ~beforeReChars.indexOf(c)) {
        return next
      }

      // from here, `pos` is >= 0 and `c` is the non-blank character
      // preceding the slash.

      if (c === '.') {
        // can be `...` or something silly like 5./2
        if (code[pos - 1] === '.') {
          start = next
        }

      } else {

        if (c === '+' || c === '-') {
          // tricky case
          if (code[--pos] !== c ||            // if have a single operator or
             (pos = _prev(code, pos)) < 0) {  // ...have `++` and no previous token
            return next                       // ...this is a regex
          }

          // we have '++' and `pos` points to the preceding non-blank
          c = code[pos]
          if (~beforeReSign.indexOf(c)) {
            return next                       // ...this is a regex
          }
        }

        if (~wordsEndChar.indexOf(c)) {  // looks like a keyword?
          const end = pos + 1

          // get the complete (previous) keyword
          while (--pos >= 0 && R_JS_VCHAR.test(code[pos])) {}

          // it is in the allowed keywords list?
          if (~beforeReWords.indexOf(code.slice(pos + 1, end))) {
            start = next
          }
        }
      }
    }

    return start
  }

})()
