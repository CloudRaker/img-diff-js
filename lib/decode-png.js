const fs = require('fs');
const PNG = require('pngjs').PNG;

async function decodePng(filename) {
  return decodePngStream(fs.createReadStream(filename));
}

function decodePngStream(stream) {
  return new Promise((resolve, reject) => {
    try {
      stream.pipe(new PNG)
            .on('parsed', function () {
              resolve(this);
            })
            .on('error', function (err) {
              reject(err);
            });
    } catch (e) {
      reject(e);
    }
  });
}

module.exports = {
  decodeFile: decodePng,
  decodeStream: decodePngStream
};
