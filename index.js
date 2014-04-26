
/**
 * Module dependencies.
 */

var assert = require('assert')
var slice = [].slice

/**
 * Wrap emitter and return sse events.
 *
 * @param {Emitter} e
 * @return {Function}
 * @api public
 */

module.exports = function (e) {
  return function (done) {
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

      out += end()

      done(null, {
        type: type,
        out: out
      })
    }
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

/**
 * End sse line.
 */

function end () {
  return '\n'
}