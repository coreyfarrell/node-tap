'use strict'
const tap = require('../')
const stackUtils = require('../lib/stack.js')
const mocha = require('../lib/mocha.js')

tap.test('check exports', async t => {
  t.type(tap, 'object')
  t.is(tap.stackUtils, stackUtils)
  t.is(tap.mocha, mocha)
  t.is(tap.mochaGlobals, mocha.global)
})
