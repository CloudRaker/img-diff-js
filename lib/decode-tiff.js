const fs = require('fs');
const { decode } = require('decode-tiff');
const { accumulateBuffer } = require('./streams');

async function decodeTiff(filename) {
  return decodeTiffStream(fs.createReadStream(filename));
}

async function decodeTiffStream(tiffReadStream) {
  return decodeTiffBuffer(await accumulateBuffer(tiffReadStream));
}

async function decodeTiffBuffer(tiffBuffer) {
  return decode(tiffBuffer);
}

module.exports = {
  decodeFile: decodeTiff,
  decodeStream: decodeTiffStream,
  decodeBuffer: decodeTiffBuffer
};
