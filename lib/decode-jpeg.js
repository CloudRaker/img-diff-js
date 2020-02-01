const fs = require('fs');
const jpeg = require('jpeg-js');
const { accumulateBuffer } = require('./streams');

async function decodeJpeg(filename) {
  return decodeJpegStream(fs.createReadStream(filename));
}

async function decodeJpegStream(jpegReadStream) {
  const jpegData = await accumulateBuffer(jpegReadStream);
  return jpeg.decode(jpegData, true);
}

module.exports = {
  decodeFile: decodeJpeg,
  decodeStream: decodeJpegStream
};
