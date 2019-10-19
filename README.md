# minitap

A <abbr title="Test Anything Protocol">TAP</abbr> test framework for
Node.js.

## `minitap` vs `tap`

`tap` extends this module and provides many other nice features.  Generally
you should be using `require('tap')` instead of `require('minitap')`.  In some
edge cases it can be appropriate to use `minitap` directly.

* Install size is important - `minitap` has significantly less dependencies.
* Your tests are suspectable to transformations or other environmental changes.
  `tap` does things that are useful by default, if this causes problems for your
  code you may wish to go lower level.

## Environmental changes still in place

* signal-exit is run
* async-domain-hook is run
* process.stdout.emit is monkey-patched to swallow EPIPE errors
* process.reallyExit and process.exit are monkey-patched
* Handlers are added to process `beforeexit` and `exit` events

These all have an effect on the environment and may be undesirable in some edge cases.
Should any/all of these be opt-out or even opt-in?  The goal is to be able to create
functional tests using `require('minitap')`.

## Further thoughts

* What export scheme is desirable for ESM format?  Directly supporting the current
  API will be difficult due to the large number of synonyms.
