function accumulateBuffer(readStream) {
  return new Promise(
    (resolve, reject) => {
      const chunks = [];
      let size = 0;

      readStream.on('error', (err) => reject(err));
      readStream.on('data', chunk => {
        size += chunk.length;
        chunks.push(chunk);
      });
      readStream.on('end', () => resolve(Buffer.concat(chunks, size)));
    }
  );
}

module.exports = {
  accumulateBuffer
};
