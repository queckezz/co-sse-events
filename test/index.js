
var Emitter = require('events')
var sse = require('../')
var co = require('co')

describe('emitter-sse', function () {
  var emitter = new Emitter()

  it('should work with arguments', function *() {
    setTimeout(function () {
      emitter.emit('foo', 1, 2)
    })

    var event = yield sse(emitter)
    event.type.should.containEql('foo')
    event.out.should.containEql('event: ')
    event.out.should.containEql('data: ')
  })

  it('should work with no arguments', function *() {
    setTimeout(function () {
      emitter.emit('end')
    })

    var event = yield sse(emitter)
    event.out.should.containEql('event: ')
  })

  it('should work with multiple emits', function *() {
    var event
    var n = 0

    setTimeout(function () {
      emitter.emit('event')
      emitter.emit('event')
    })

    while (event = yield sse(emitter)) {
      event.type.should.be.eql('event')
      if (++n == 2) return;
    }
  })

  it('should have two newlines between each data set', function *() {
    var event
    var n = 0

    setTimeout(function () {
      emitter.emit('some', 'data')
      emitter.emit('more', 'stuff')
    })

    while (event = yield sse(emitter)) {
      event.out.should.containEql('\n\n')
      if (++n == 2) return;
    }
  })
})