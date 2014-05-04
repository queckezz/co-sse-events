
# co-sse-events

A sse stream based on events. Wrap an `emitter` with this module to emit sse events.

## Installation

```bash
$ npm install co-sse-events
```

## Example

Returns events in sequence based on the [sse spec](http://www.w3.org/TR/2009/WD-eventsource-20091029/)
```js
var emitter = new Emitter;

var e;
while (e = yield sse(emitter)) {
  console.log(e.out)
  /* ->
   *   event: test
   *   data: { some: prop }
   *
   * ->
   *   event: test
   *   data: 'prop'
   */
}

emitter
  .emit('test', { some: prop })
  .emit('test', 'prop')
```