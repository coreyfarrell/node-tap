#!/usr/bin/env node

const foregroundChild = require('foreground-child')

async function runTests() {
  const glob = require('glob')
  const os = require('os')
  const t = require('.')
  const coverageMap = require('./coverage-map')

  t.jobs = os.cpus().length

  glob.sync('test/**/*.js').forEach(file => {
    t.spawn(
      process.execPath,
      [file],
      {
        env: {
          ...process.env,
          NYC_CONFIG_OVERRIDE: JSON.stringify({
            include: coverageMap(file) || ''
          })
        }
      },
      file
    )
  })
}

// minitap does not integrate with nyc so does not include coverage-map
// support.  The wrapped process is used because the global nyc configuration
// needs to include lib/** for the sake of `all: true`, but we don't want use
// of minitap from this file to contribute coverage.
if (process.argv[2] === 'wrapped') {
  runTests()
} else {
  process.env.NYC_CONFIG_OVERRIDE = JSON.stringify({include: ''})
  foregroundChild(process.execPath, [__filename, 'wrapped'])
}
