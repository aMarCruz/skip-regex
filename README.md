# skipRegex

[![npm Version][npm-badge]][npm-url]
[![License][license-badge]][license-url]
[![Build Status][travis-badge]][travis-url]
[![Coverage][codecov-badge]][codecov-url]
[![Minified Size][size-badge]][size-url]

Micro parser for detection of literal regexes.

- Fast detenction with high accuracy.
- Minimum size.
- Compatible with NodeJS, bundlers, IE9+, and modern Browsers.
- TypeScript definition.
- Zero dependencies.

## Install

```bash
npm install skip-regex --save
# or
yarn add skip-regex
```

or load the minified UMD build in your browser:

```html
<script src="https://unpkg.com/skip-regex/index.min.js"></script>
```

Three formats transpiled to ES5:

- CommonJS for node.js and browserify-like bundlers.
- ESM for bundlers like [Rollup](https://github.com/rollup/rollup).
- UMD for AMD, CommonJS, and browsers through the global `skipRegex` function.

## Syntax

```ts
skipRegex(source: string, start: number) => number
```

The `start` position _must_ point to a slash inside `source`.

From there, `skipRegex` will find with 99% accuracy the end of a regular expression in the given string.

The returned value is the position of the character following the regex, or `start+1` if a regex was not found.

## Example

This is a silly example, but it will give an idea.

For a complete example see [js-cleanup](https://github.com/aMarCruz/js-cleanup), an utility to clean comments safely in JS-like sources, which uses skip-regex to skip regular expressions.

```js
import skipRegex from 'skip-regex'

const source = ' /.*/ '
const start  = source.indexOf('/')

if (~start) {
  const end = skipRegex(source, start)

  if (end > start + 1) {      // detected as regex?
    const regex = source.slice(start, end)
    console.log(`Found regex ${regex} at position ${start}!`)

  } else if (source[end] === '*' || source[end] === '/') {
    console.log('The slash starts a JS comment.')

  } else {
    console.log('The slash is a division sign.')
  }
}
```

For Rollup, you can use [rollup-plugin-node-resolve](https://github.com/rollup/rollup-plugin-node-resolve) to resolve 'skip-regex' as an ES6 module.

For TypeScript, enable `esModuleInterop` in your tsconfig.json _or_ use the `"import=require"` syntax:

```ts
import skipRegex = require('skip-regex')

//...
```

## Support my Work

I'm a full-stack developer with more than 20 year of experience and I try to share most of my work for free and help others, but this takes a significant amount of time and effort so, if you like my work, please consider...

<!-- markdownlint-disable MD033 -->
[<img src="https://amarcruz.github.io/images/kofi_blue.png" height="36" title="Support Me on Ko-fi" />][kofi-url]
<!-- markdownlint-enable MD033 -->

Of course, feedback, PRs, and stars are also welcome 🙃

Thanks for your support!

## Licence

The [MIT license](LICENSE) (MIT)

&copy; 2018 Alberto Martínez

[npm-badge]:      https://badgen.net/npm/v/skip-regex
[npm-url]:        https://www.npmjs.com/package/skip-regex
[license-badge]:  https://badgen.net/npm/license/skip-regex
[license-url]:    https://github.com/aMarCruz/skip-regex/blob/master/LICENSE
[travis-badge]:   https://travis-ci.org/aMarCruz/skip-regex.svg?branch=master
[travis-url]:     https://travis-ci.org/aMarCruz/skip-regex
[codecov-badge]:  https://codecov.io/gh/aMarCruz/skip-regex/branch/master/graph/badge.svg
[codecov-url]:    https://codecov.io/gh/aMarCruz/skip-regex
[size-badge]:     https://badgen.net/bundlephobia/min/skip-regex
[size-url]:       https://bundlephobia.com/result?p=skip-regex
[kofi-url]:       https://ko-fi.com/C0C7LF7I
