const test = require('ava');
const path = require('path');

const { decodeFile: decodeJpeg } = require('../lib/decode-jpeg');

test('decode jpeg file', async t => {
  const file = path.resolve(__dirname, 'images/actual.jpg');
  const jpeg = await decodeJpeg(file);
  t.is(typeof jpeg.width, 'number');
  t.is(typeof jpeg.height, 'number');
  t.is(jpeg.data.length, jpeg.width * jpeg.height * 4);
});
