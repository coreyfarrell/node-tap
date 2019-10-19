'use strict'
const tap = require('../')
const stack = require('../lib/stack.js')

// This construct ensures the stack traces are identical except for filtering
const [defaultLoadStack, minitapLoadStack] = [stack.StackUtils, tap.stackUtils].map(
  i => i.captureString().split('\n')
)

tap.test('stack-utils', async t => {
  const isInternal = f => (/internal\//.test(f))
  const notInternal = f => !isInternal(f)

  t.ok(defaultLoadStack.filter(isInternal).length > 1)
  t.ok(minitapLoadStack.filter(isInternal).length <= 1)
  t.same(
    defaultLoadStack.filter(notInternal),
    minitapLoadStack.filter(notInternal)
  )
})

tap.test('t.stackUtils', async t => {
  t.is(stack.instance, tap.stackUtils)

  const {instance} = stack
  tap.stackUtils = null
  t.is(stack.instance, null)
  t.is(stack.instance, tap.stackUtils)

  tap.stackUtils = instance
  t.is(stack.instance, tap.stackUtils)
  t.is(stack.instance, instance)
})
