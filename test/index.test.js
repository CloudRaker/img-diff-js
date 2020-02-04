const fs = require('fs');
const path = require('path');
const test = require('ava');
const rimraf = require('rimraf');
const { imgDiff } = require('../');

test('compare with 2 png files', async t => {
  const diffFilename = path.resolve(__dirname, 'images/diff_generated.png');
  rimraf.sync(diffFilename);
  await imgDiff({
    actualFilename: path.resolve(__dirname, 'images/actual.png'),
    expectedFilename: path.resolve(__dirname, 'images/expected.png'),
  });
  t.throws(() => fs.statSync(path.resolve(__dirname, 'images/diff_generated.png')));
  const { imagesAreSame } = await imgDiff({
    diffFilename,
    actualFilename: path.resolve(__dirname, 'images/actual.png'),
    expectedFilename: path.resolve(__dirname, 'images/expected.png'),
  });
  t.is(imagesAreSame, false);
  t.truthy(fs.statSync(path.resolve(__dirname, 'images/diff_generated.png')));
});

test('compare with 2 same files', async t => {
  const { imagesAreSame } = await imgDiff({
    actualFilename: path.resolve(__dirname, 'images/expected.png'),
    expectedFilename: path.resolve(__dirname, 'images/expected.png'),
  });
  t.is(imagesAreSame, true);
});

test('compare with 2 files whose dimension are different', async t => {
  const diffFilename = path.resolve(__dirname, 'images/diff_generated.wide.png');
  rimraf.sync(diffFilename);
  const { width, height } = await imgDiff({
    diffFilename,
    actualFilename: path.resolve(__dirname, 'images/actual_wide.png'),
    expectedFilename: path.resolve(__dirname, 'images/expected.png'),
  });
  t.truthy(fs.statSync(path.resolve(__dirname, 'images/diff_generated.wide.png')));
});

test('compare with 2 jpeg files', async t => {
  const diffFilename = path.resolve(__dirname, 'images/diff_generated.jpg.png');
  rimraf.sync(diffFilename);
  const { width, height } = await imgDiff({
    diffFilename,
    actualFilename: path.resolve(__dirname, 'images/actual.jpg'),
    expectedFilename: path.resolve(__dirname, 'images/expected.jpg'),
  });
  t.truthy(fs.statSync(path.resolve(__dirname, 'images/diff_generated.jpg.png')));
});

test('compare jpeg with explicit read stream', async t => {
  const { imagesAreSame } = await imgDiff({
    actualReadStream: fs.createReadStream(path.resolve(__dirname, 'images/expected.jpg')),
    actualType: 'jpg',
    expectedReadStream: fs.createReadStream(path.resolve(__dirname, 'images/expected.jpg')),
    expectedType: 'jpeg'
  });
  t.is(imagesAreSame, true);
});

test('compare png with explicit read stream', async t => {
  const { imagesAreSame } = await imgDiff({
    actualReadStream: fs.createReadStream(path.resolve(__dirname, 'images/expected.png')),
    actualType: 'png',
    expectedReadStream: fs.createReadStream(path.resolve(__dirname, 'images/expected.png')),
    expectedType: 'png'
  });
  t.is(imagesAreSame, true);
});

test('compare png+jpg with explicit read stream', async t => {
  const { imagesAreSame } = await imgDiff({
    actualReadStream: fs.createReadStream(path.resolve(__dirname, 'images/expected.png')),
    actualType: 'png',
    expectedReadStream: fs.createReadStream(path.resolve(__dirname, 'images/expected.jpg')),
    expectedType: 'jpeg'
  });
  t.is(imagesAreSame, true);
});


test('compare jpeg with explicit buffer', async t => {
  const { imagesAreSame } = await imgDiff({
    actualData: fs.readFileSync(path.resolve(__dirname, 'images/expected.jpg')),
    actualType: 'jpg',
    expectedData: fs.readFileSync(path.resolve(__dirname, 'images/expected.jpg')),
    expectedType: 'jpeg'
  });
  t.is(imagesAreSame, true);
});

test('compare png with explicit buffer', async t => {
  const { imagesAreSame } = await imgDiff({
    actualData: fs.readFileSync(path.resolve(__dirname, 'images/expected.png')),
    actualType: 'png',
    expectedData: fs.readFileSync(path.resolve(__dirname, 'images/expected.png')),
    expectedType: 'png'
  });
  t.is(imagesAreSame, true);
});

test('compare png+jpg with explicit buffer', async t => {
  const { imagesAreSame } = await imgDiff({
    actualData: fs.readFileSync(path.resolve(__dirname, 'images/expected.png')),
    actualType: 'png',
    expectedData: fs.readFileSync(path.resolve(__dirname, 'images/expected.jpg')),
    expectedType: 'jpeg'
  });
  t.is(imagesAreSame, true);
});
