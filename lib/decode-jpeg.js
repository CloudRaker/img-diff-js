const fs = require('fs');
const { accumulateBuffer } = require('./streams');
const jpegTurbo = require('@cwasm/jpeg-turbo');

async function decodeJpegBuffer(jpegBuf) {
  return jpegTurbo.decode(jpegBuf);
}

async function decodeJpegStream(jpegReadStream) {
  const jpegBuffer = await accumulateBuffer(jpegReadStream);
  return decodeJpegBuffer(jpegBuffer);
}

async function decodeJpegFile(filename) {
  return decodeJpegStream(fs.createReadStream(filename));
}

module.exports = {
  decodeFile: decodeJpegFile,
  decodeStream: decodeJpegStream,
  decodeBuffer: decodeJpegBuffer
};
