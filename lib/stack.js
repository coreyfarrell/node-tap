'use strict'
const StackUtils = require('stack-utils')

let nodeInternals = []
try {
  nodeInternals = StackUtils.nodeInternals()
} catch (error) {
  // Do nothing.
}

module.exports = {
  StackUtils,
  instance: new StackUtils({
    internals: nodeInternals
  })
}
