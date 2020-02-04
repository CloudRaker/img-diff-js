const fs = require('fs');
const path = require('path');
const pixelmatch = require('pixelmatch');
const { PNG } = require('pngjs');
const mkdirp = require('mkdirp');
const { decode, registerDecoder } = require('./decoders');
const expand = require('./expand');


function compare(img1, img2, getDiffWriteStream, generateOnlyDiffFile, options) {
  const { dataList: [imgA, imgB], width, height } = expand(img1, img2);

  const diff = new PNG({ width, height });

  const pmOpt = Object.assign({
    threshold: 0.1,
    includeAA: false
  }, options || {});

  const count = pixelmatch(imgA, imgB, diff.data, width, height, pmOpt);
  const imagesAreSame = count === 0;
  const result = {
    width,
    height,
    imagesAreSame,
    diffCount: count,
  };

  if (!getDiffWriteStream) {
    return Promise.resolve(result);
  }

  if (imagesAreSame && generateOnlyDiffFile) {
    return Promise.resolve(result);
  }

  const out = getDiffWriteStream();
  diff.pack().pipe(out);

  return new Promise((resolve, reject) => {
    out
      .on('finish', () => resolve(result))
      .on('error', err => reject(err))
    ;
  });
}

function defaultDiffWriteStreamFor(opt) {
  const diffFilename = opt.diffFilename;
  if (diffFilename) {
    return () => {
      mkdirp.sync(path.dirname(diffFilename));
      return fs.createWriteStream(diffFilename);
    };
  }
}

/**
 * @param opt - {ImgDiffOptions}
 * @returns {Promise<ImgDiffResult>}
 */
async function imgDiff(opt) {
  const [imgA, imgB] = await Promise.all([
    decode({
      filename: opt.actualFilename,
      stream: opt.actualReadStream,
      buffer: opt.actualData,
      type: opt.actualType
    }),
    decode({
      filename: opt.expectedFilename,
      stream: opt.expectedReadStream,
      buffer: opt.expectedData,
      type: opt.expectedType
    }),
  ]);

  let getDiffWriteStream;
  if (opt.diffWriteStream) {
    getDiffWriteStream = () => opt.diffWriteStream;
  } else {
    getDiffWriteStream = defaultDiffWriteStreamFor(opt);
  }

  return compare(imgA, imgB, getDiffWriteStream, opt.generateOnlyDiffFile, opt.options);
}

module.exports = { imgDiff, registerDecoder };
