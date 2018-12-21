'use strict'

// Test the minified UMD build.
const skipRegex = './index.min.js'

module.exports = function (config) {
  config.set({

    basePath: '..',

    frameworks: ['mocha'],

    files: [
      { pattern: skipRegex, included: true, served: true, watched: false },
      'test/run.js',
    ],

    //client: {
    //  mocha: {
    //    timeout: 999999,
    //  },
    //},

    reporters: ['progress'],

    browsers: ['Firefox', 'Chrome'], //ChromeHeadless

    port: 9876,
    colors: true,
    autoWatch: true,
    singleRun: true,
    browserDisconnectTimeout: 2000,
    browserNoActivityTimeout: 3000,
  })
}
