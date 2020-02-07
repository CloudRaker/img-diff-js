async function accumulateBuffer(readStream) {
  const chunks = [];
  let outputLength = 0;

  for await (const chunk of readStream) {
    outputLength += chunk.length;
    chunks.push(chunk);
  }

  return Buffer.concat(chunks, outputLength);
}

module.exports = {
  accumulateBuffer
};
