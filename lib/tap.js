'use strict'
const tap = require('libtap')
tap.stackUtils = require('./stack.js')
tap.mocha = require('./mocha.js')
tap.mochaGlobals = tap.mocha.global

module.exports = tap
