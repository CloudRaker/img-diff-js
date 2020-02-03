const fs = require('fs');
const path = require('path');
const pixelmatch = require('pixelmatch');
const { PNG } = require('pngjs');
const mkdirp = require('mkdirp');
const decodePng = require('./decode-png');
const decodeJpeg = require('./decode-jpeg');
const expand = require('./expand');

const extensionDecoderMap = {};

const ensureLeadingDot = s => s.startsWith('.') ? s : `.${ s }`;

function registerDecoder(extensions, decoder) {
  extensions.forEach(extension => {
    extensionDecoderMap[ensureLeadingDot(extension)] = decoder;
  });
}

function decode(filename, stream, type) {
  const ext = filename ? path.extname(filename) : type;

  const decoder = extensionDecoderMap[ensureLeadingDot(ext)];

  if (!ext || !decoder) {
    const exts = Object.keys(extensionDecoderMap).join(', ');
    throw new Error('File name should be end with ' + exts);
  }

  if (filename) {
    return decoder.decodeFile(filename);
  } else {
    return decoder.decodeStream(stream);
  }
}

registerDecoder(['png'], decodePng);
registerDecoder(['jpg', 'jpeg'], decodeJpeg);

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
 * @param opt {ImgDiffOptions}
 * @returns {Promise<ImgDiffResult>}
 */
async function imgDiff(opt) {
  const [imgA, imgB] = await Promise.all([
    decode(opt.actualFilename, opt.actualReadStream, opt.actualType),
    decode(opt.expectedFilename, opt.expectedReadStream, opt.expectedType),
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
