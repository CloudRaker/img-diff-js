const fs = require('fs');
const PNG = require('pngjs').PNG;

async function decodePng(filename) {
  return decodePngStream(fs.createReadStream(filename));
}

async function decodePngStream(stream) {
  return new Promise((resolve, reject) => {
    try {
      const pngDecoder = new PNG()
        .on('parsed', () => resolve(pngDecoder))
        .on('error', err => reject(err));

      stream.pipe(pngDecoder);
    } catch (e) {
      reject(e);
    }
  });
}

async function decodePngBuffer(pngBuffer) {
  return new Promise((resolve, reject) => {
    try {
      const pngDecoder = new PNG()
        .on('parsed', () => resolve(pngDecoder))
        .on('error', err => reject(err));

      pngDecoder.end(pngBuffer);

    } catch (e) {
      reject(e);
    }
  });
}

module.exports = {
  decodeFile: decodePng,
  decodeStream: decodePngStream,
  decodeBuffer: decodePngBuffer
};
