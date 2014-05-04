
'use strict'

/**
 * Module dependencies.
 */

let arr = require('array-iterator')
let Queue = require('co-queue')
let assert = require('assert')
let slice = [].slice

/**
 * Event queue.
 */

let queue = new Queue;

/**
 * Wraps `e.emit` to emit sse events.
 *
 * @param {Emitter} e
 * @return {Function}
 * @api public
 */

module.exports = function (e) {
  let emit = e.emit

  e.emit = function (type) {
    let args = slice.call(arguments, 1)
    let out = ''

    // event with no arguments
    if (args.length == 0) {
      out += send('event', type)
    }

    // event with arguments
    for (let arg of arr(args)) {
      if (typeof arg == 'object') arg = JSON.stringify(arg);
      out += send('event', type)
      out += send('data', arg)
    }

    // end of a data set
    out += '\n'

    // push event into `queue` to maintain event order
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