'use strict'
const node = process.execPath

function setupShortStack() {
  const path = require('path')
  const StackUtils = require('stack-utils')
  const sourceMapSupport = require('source-map-support')

  // This is still used within clean-yaml-object.js
  process.env.TAP_DEV_SHORTSTACK = '1';

  const tapDir = path.resolve(__dirname, '..', '..')
  const resc = str =>
    str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&')

  const skip = [
    /at internal\/.*\.js:\d+:\d+/m,
    new RegExp(resc(tapDir) + '\\b', 'i'),
    new RegExp('at ' + resc('Generator.next (<anonymous>)'), 'i'),
    new RegExp(resc(require.resolve('function-loop'))),
    new RegExp(resc(require.resolve('nyc').replace(/(node_modules[\/\\]nyc).*$/, '$1'))),
  ]

  let nodeInternals = []
  try {
    nodeInternals = StackUtils.nodeInternals()
  } catch (error) {
    // Do nothing.
  }

  sourceMapSupport.install({environment:'node', hookRequire: true})

  // Loading lib/tap.js here would interfere with some tests that set the environment
  require('../../lib/stack').instance = new StackUtils({
    internals: nodeInternals.concat(skip),
    wrapCallSite: sourceMapSupport.wrapCallSite
  })
}

if (module === require.main)
  require('../../lib/tap.js').pass('just the index')

setupShortStack()

module.exports = (...test) => {
  if (process.argv[2] === 'runtest') {
    // run the init function _before_ loading the root tap object
    if (test.length === 2) {
      test[0]()
      test[1](require('../../lib/tap.js'))
    } else
      test[0](require('../../lib/tap.js'))
  } else {
    const spawn = require('child_process').spawn
    const env = Object.keys(process.env).reduce((env, k) => {
      env[k] = env[k] || process.env[k]
      return env
    }, { TAP_BAIL: '0', TAP_BUFFER: '0' })
    const t = require('../../lib/tap.js')
    const cs = require('../clean-stacks.js')
    t.cleanSnapshot = str => cs(str).replace(/[^\n]*DEP0018[^\n]*\n/g, '')
    t.plan(3)
    const c = spawn(node, [process.argv[1], 'runtest'], { env: env })
    let out = ''
    c.stdout.on('data', c => out += c)
    let err = ''
    c.stderr.on('data', c => err += c)
    c.on('close', (code, signal) => {
      t.matchSnapshot({
        code: code,
        signal: signal
      }, 'exit status')
      t.matchSnapshot(out, 'stdout')
      t.matchSnapshot(err, 'stderr')
    })
  }
}
