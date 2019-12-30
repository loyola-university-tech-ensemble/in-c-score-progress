const dgram = require('dgram');

const NUM_PHRASES = 53;

module.exports = (renderer) => {
  const server = dgram.createSocket('udp4');

  const playerMatrix = (() => {
    const matrix = [];
    for (let i = 0; i < NUM_PHRASES; i += 1) {
      matrix[i] = [];
    }
    return matrix;
  })();

  const arraySort = (a, b) => a - b;

  const updateMatrix = (matrix, playerData) => {
    const cidExists = matrix.reduce((a, b) => {
      const index = Math.max(a.index, b.indexOf(playerData.cid));
      return {
        phrase: (index === -1) ? a.phrase + 1 : a.phrase,
        index,
      };
    }, { phrase: 0, index: -1 });

    if (cidExists.index === -1) {
      matrix[playerData.phrase].push(playerData.cid);
      matrix[playerData.phrase].sort(arraySort);
    } else {
      matrix[cidExists.phrase].splice(cidExists.index, 1);
      matrix[cidExists.phrase].sort(arraySort);
      matrix[playerData.phrase].push(playerData.cid);
      matrix[playerData.phrase].sort(arraySort);
    }
  };

  const processMaxListPacket = (buffer) => {
    const data = buffer.slice(12);
    const cid = data.readInt32BE(0);
    const phrase = data.readInt32BE(4);
    return { cid, phrase: phrase - 1 };
  };

  server.on('error', (err) => {
    console.error(`server error:\n${err.message}`);
    console.error(err.stack);
    server.close();
  });

  server.on('message', (msg, rinfo) => {
    const data = processMaxListPacket(msg);
    console.debug(`server got: [${data.cid} ${data.phrase}] from ${rinfo.address}:${rinfo.port}`);

    updateMatrix(playerMatrix, data);
    renderer.update(playerMatrix, data.cid);
  });

  server.on('listening', () => {
    const address = server.address();
    console.log(`server listening on: ${address.address}:${address.port}`);
    renderer.start();
  });

  server.bind(41234);
};
