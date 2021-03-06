# UDP to Readable Stream

[![CircleCI](https://circleci.com/gh/bunchtogether/udp-to-readable-stream.svg?style=svg)](https://circleci.com/gh/bunchtogether/udp-to-readable-stream) [![npm version](https://badge.fury.io/js/udp-to-readable-stream.svg)](http://badge.fury.io/js/udp-to-readable-stream)

Read data from a UDP socket into a readable stream. No dependencies.

If you encounter an issue, fork the repository, [write tests demonstrating](https://github.com/bunchtogether/udp-to-readable-stream/tree/master/tests) the issue, and create a [pull request](https://github.com/bunchtogether/udp-to-readable-stream).

```js
const udpToReadableStream = require('udp-to-readable-stream');
const crypto = require('crypto');

const chunks = [
  crypto.randomBytes(Math.round(Math.random() * 256)),
  crypto.randomBytes(Math.round(Math.random() * 256)),
  crypto.randomBytes(Math.round(Math.random() * 256)),
  crypto.randomBytes(Math.round(Math.random() * 256)),
];

const port = Math.round(10000 + 10000 * Math.random());
const socket = dgram.createSocket({ type: 'udp4', reuseAddr: true });
const stream = udpToReadableStream(port, '127.0.0.1', { type: 'udp4', reuseAddr: true });

stream.on('data', (chunk) => {
  console.log(`Chunk with length ${chunk.length}`);
});

stream.on('error', (error) => {
  console.error(error);
});

stream.on('close', () => {
  console.log("Close");
});

for (const chunk of chunks) {
  socket.send(chunk, 0, chunk.length, port, '127.0.0.1');
}

stream.destroy(); // Destroying the stream closes the socket
socket.close();
```

## Install

`yarn add udp-to-readable-stream`

## API

<!-- Generated by documentation.js. Update this documentation by updating the source code. -->

#### Table of Contents

-   [index](#index)
    -   [Parameters](#parameters)

### index

Listen to a UDP port and send data to a readable stream.

#### Parameters

-   `port` **[number](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number)** Port to be passed to [socket.bind](https://nodejs.org/api/dgram.html#dgram_socket_bind_port_address_callback)
-   `address` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** Address to be passed to [socket.bind](https://nodejs.org/api/dgram.html#dgram_socket_bind_port_address_callback)
-   `options` **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** Socket options [dgram.createSocket](https://nodejs.org/api/dgram.html#dgram_dgram_createsocket_options_callback) (optional, default `{}`)

Returns **any** Readable&lt;Buffer | string>
