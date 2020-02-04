const fs = require('fs');
const jpeg = require('jpeg-js');
const { accumulateBuffer } = require('./streams');

async function decodeJpegBuffer(jpegBuf) {
  return jpeg.decode(jpegBuf, true);
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
