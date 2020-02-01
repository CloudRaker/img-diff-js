const fs = require('fs');
const { decode } = require('decode-tiff');
const { accumulateBuffer } = require('./streams');

async function decodeTiff(filename) {
  return decodeTiffStream(fs.createReadStream(filename));
}

async function decodeTiffStream(tiffReadStream) {
  const tiffData = await accumulateBuffer(tiffReadStream);
  return decode(tiffData);
}

module.exports = {
  decodeFile: decodeTiff,
  decodeStream: decodeTiffStream
};
