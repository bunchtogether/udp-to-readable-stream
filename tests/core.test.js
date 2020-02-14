// @flow

const udpToReadableStream = require('../src');
const crypto = require('crypto');
const expect = require('expect');
const dgram = require('dgram');

describe('UDP to Readable Stream', () => {
  test('Converts an async iterable to a readable stream', async () => {
    const chunks = [
      crypto.randomBytes(Math.round(Math.random() * 256)),
      crypto.randomBytes(Math.round(Math.random() * 256)),
      crypto.randomBytes(Math.round(Math.random() * 256)),
      crypto.randomBytes(Math.round(Math.random() * 256)),
    ];
    const port = Math.round(10000 + 10000 * Math.random());
    const socket = dgram.createSocket({ type: 'udp4', reuseAddr: true });
    const stream = udpToReadableStream(port, '127.0.0.1', { type: 'udp4', reuseAddr: true });
    let j = 0;
    const dataPromise = new Promise((resolve, reject) => {
      const handleData = (chunk) => {
        expect(Buffer.compare(chunk, chunks[j])).toEqual(0);
        j += 1;
        if (j >= chunks.length) {
          stream.removeListener('data', handleData);
          stream.removeListener('error', handleError);
          resolve();
        }
      };
      const handleError = (error) => {
        stream.removeListener('data', handleData);
        stream.removeListener('error', handleError);
        reject(error);
      };
      stream.on('data', handleData);
      stream.on('error', handleError);
    });
    const closePromise = new Promise((resolve, reject) => {
      const handleClose = () => {
        stream.removeListener('close', handleClose);
        stream.removeListener('error', handleError);
        resolve();
      };
      const handleError = (error) => {
        stream.removeListener('close', handleClose);
        stream.removeListener('error', handleError);
        reject(error);
      };
      stream.on('close', handleClose);
      stream.on('error', handleError);
    });
    for (const chunk of chunks) {
      await new Promise((resolve) => setTimeout(resolve, 100));
      socket.send(chunk, 0, chunk.length, port, '127.0.0.1');
    }
    await dataPromise;
    stream.destroy();
    await closePromise;
    socket.close();
  });
  test('Emits errors from the stream', async () => {
    const port = Math.round(10000 + 10000 * Math.random());
    const stream = udpToReadableStream(port, '300.300.300.300', { type: 'udp4', reuseAddr: true });
    const errorPromise = new Promise((resolve) => {
      const handleError = (error) => {
        expect(error.code).toEqual('ENOTFOUND');
        stream.removeListener('error', handleError);
        resolve();
      };
      stream.on('error', handleError);
    });
    const closePromise = new Promise((resolve) => {
      const handleClose = () => {
        stream.removeListener('close', handleClose);
        resolve();
      };
      stream.on('close', handleClose);
    });
    await errorPromise;
    await closePromise;
  });
});

