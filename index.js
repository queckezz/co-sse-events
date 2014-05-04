
/**
 * Module dependencies.
 */

var Queue = require('co-queue')
var assert = require('assert')
var slice = [].slice

/**
 * Event queue.
 */

var queue = new Queue;

/**
 * Wraps `e.emit` to emit sse events.
 *
 * @param {Emitter} e
 * @return {Function}
 * @api public
 */

module.exports = function (e) {
  var emit = e.emit

  e.emit = function (type) {
    var args = slice.call(arguments, 1)
    var out = ''

    // event with no arguments
    if (args.length == 0) {
      out += send('event', type)
    }

    // event with arguments
    args.forEach(function (arg, i) {
      if (typeof arg == 'object') arg = JSON.stringify(arg);

      out += send('event', type)
      out += send('data', arg)
    })

    // end
    out += '\n'

    // push to queue to maintain event order
    queue.push({
      type: type,
      out: out
    })
  }

  return function *() {
    return yield queue.next()
  }
}

/**
 * Format to an sse line.
 *
 * @param {String} type
 * @param {Array} args
 */

function send (type, args) {
  return type + ': ' + args + '\n'
}