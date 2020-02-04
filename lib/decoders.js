const path = require('path');
const decodePng = require('./decode-png');
const decodeJpeg = require('./decode-jpeg');

const extensionDecoderMap = {};

const ensureLeadingDot = s => s.startsWith('.') ? s : `.${ s }`;

const getDecoder = extension => extensionDecoderMap[ensureLeadingDot(extension)];

const registerDecoder = (extensions, decoder) => extensions.forEach(
  extension => extensionDecoderMap[ensureLeadingDot(extension)] = decoder
);

registerDecoder(['png'], decodePng);
registerDecoder(['jpg', 'jpeg'], decodeJpeg);

function decode({
                  filename,
                  stream,
                  buffer,
                  type
                }) {

  const ext = filename ? path.extname(filename) : type;
  const decoder = getDecoder(ext);

  if (!ext || !decoder) {
    const exts = Object.keys(extensionDecoderMap).join(', ');
    throw new Error(`Invalid type '${ ext }'. File type should be one of: ${ exts }`);
  }

  if (filename) {
    return decoder.decodeFile(filename);
  } else if (stream) {
    return decoder.decodeStream(stream);
  } else if (buffer) {
    return decoder.decodeBuffer(buffer);
  } else {
    throw new Error('Missing data to decode');
  }
}


module.exports = {
  getDecoder,
  registerDecoder,
  decode
};
