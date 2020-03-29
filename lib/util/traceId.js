'use strict';


const BufferPack = require('bufferpack');
const _max_seq = 4294967295;  // ffffffff对应十进制


class TraceId {

  constructor(options) {
    this.seq = 0;

    if (options && options.generatorMethod && typeof options.generatorMethod === 'function') {
      this.generatorMethod = options.generatorMethod;
    } else {
      this.generatorMethod = this.defaultGeneratorMethod;
    }
  }

  generate() {
    const traceId = this.generatorMethod();

    return traceId;
  }

  defaultGeneratorMethod() {
    this.seq = this.seq % _max_seq + 1;

    this.countPrefix = Buffer.concat([
      BufferPack.pack('>L', [ this.seq ]),
    ], 4).toString('hex');
    const traceId = this.countPrefix + generateSimpleTraceId();
    return traceId;
  }
}


function generateSimpleTraceId() {
  const ALPHABET = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_-';
  const ID_LENGTH = 8;

  let traceId = '';
  for (let i = 0; i < ID_LENGTH; i++) {
    traceId += ALPHABET.charAt(Math.floor(Math.random() * ALPHABET.length));
  }
  return traceId;
}


module.exports = TraceId;
