
var Emitter = require('events')
var assert = require('assert')
var sse = require('../')
var co = require('co')

describe('emitter-sse', function () {
  var emitter = new Emitter

  it('should work with arguments', function (done) {

    co(function *(){
      var event;
      while (event = yield sse(emitter)) {
        event.out.should.containEql('event: ')
        event.out.should.containEql('data: ')

        if ('foo' == event.type) done()
      }
    })()

    emitter.emit('foo', 1, 2)
  })

  it('should work with no arguments', function (done) {
    co(function *(){
      var event
      while (event = yield sse(emitter)) {
        event.out.should.containEql('event: ')
        event.out.should.not.containEql('data: ')

        if ('end' == event.type) done();
      }
    })()

    emitter.emit('end')
  })

})