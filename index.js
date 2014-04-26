
/**
 * Module dependencies.
 */

var assert = require('assert');
var slice = [].slice;

/**
 * Wrap emitter and return sse events.
 *
 * @param {Emitter} e
 * @return {Function}
 * @api public
 */

module.exports = function (e, retry) {
  return function (done) {
    var emit = e.emit

    e.emit = function (type) {
      var args = slice.call(arguments, 1)
      var msg = ''

      // event with no args
      if (args.length == 0) {
        msg += send('event', type)
      }

      // event with data
      args.forEach(function (arg, i) {
        if (typeof arg == 'object') arg = JSON.stringify(arg);

        msg += send('event', type)
        msg += send('data', arg)
      })

      msg += end()

      done(null, {
        type: type,
        msg: msg
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