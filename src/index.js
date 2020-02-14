// @flow

const dgram = require('dgram');
const { Readable } = require('stream');

/**
 * Listen to a UDP port and send data to a readable stream.
 * @param {number} port Port to be passed to [socket.bind](https://nodejs.org/api/dgram.html#dgram_socket_bind_port_address_callback)
 * @param {string} address Address to be passed to [socket.bind](https://nodejs.org/api/dgram.html#dgram_socket_bind_port_address_callback)
 * @param {Object} options Socket options [dgram.createSocket](https://nodejs.org/api/dgram.html#dgram_dgram_createsocket_options_callback)
 * @return Readable<Buffer | string>
 */
module.exports = (port: number, address:string, options: Object = {}) => {
  const socket = dgram.createSocket(options);
  const stream = new Readable({ read: () => {} });
  socket.on('message', (data:Buffer) => {
    stream.push(data);
  });
  socket.on('error', (error:Error) => {
    stream.destroy(error);
  });
  stream.once('close', () => {
    socket.close();
  });
  try {
    socket.bind(port, address);
  } catch (error) {
    stream.destroy(error);
  }
  return stream;
};
