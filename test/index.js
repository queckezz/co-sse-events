
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
        event.msg.should.containEql('event: ')
        event.msg.should.containEql('data: ')

        if ('foo' == event.type) done()
      }
    })()

    emitter.emit('foo', 1, 2)
  })

  it('should work with no arguments', function (done) {
    co(function *(){
      var event
      while (event = yield sse(emitter)) {
        event.msg.should.containEql('event: ')
        event.msg.should.not.containEql('data: ')

        if ('end' == event.type) done();
      }
    })()

    emitter.emit('end')
  })

})