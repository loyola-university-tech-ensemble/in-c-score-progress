'use strict';

const NUM_PHRASES = 53;

module.exports = (renderer) => { 

  const dgram = require('dgram');
  const server = dgram.createSocket('udp4');

  var playerMatrix = (() => {
    let matrix = [ ];
    for(let i=0; i < NUM_PHRASES; ++i) {
      matrix[i] = [];
    }
    return matrix;
  })();

  const arraySort = (a,b) => { return a - b; }

  const updateMatrix = (matrix,data) => {
    const cidExists = matrix.reduce((a,b) => {
      let index = Math.max(a.index, b.indexOf(data.cid));
      return { 
        "phrase": (index==-1) ? a.phrase+1 : a.phrase,
        "index": index
      }; 
    }, {"phrase": 0, "index": -1});

    if(cidExists.index == -1) {
      matrix[data.phrase].push(data.cid);
      matrix[data.phrase].sort(arraySort);
    } else {
      matrix[cidExists.phrase].splice(cidExists.index, 1);
      matrix[cidExists.phrase].sort(arraySort);
      matrix[data.phrase].push(data.cid);
      matrix[data.phrase].sort(arraySort);
    }
    
  }

  const processMaxListPacket = (buffer) => {
    let data = buffer.slice(12);
    let cid = data.readInt32BE();
    let phrase = data.readInt32BE(4);
    return { 'cid': cid, 'phrase': phrase-1 };
  }

  server.on('error', (err) => {
    console.log(`server error:\n${err.stack}`);
    server.close();
  });

  server.on('message', (msg, rinfo) => {
    let data = processMaxListPacket(msg);
    console.log(`server got: [${data.cid} ${data.phrase}] from ${rinfo.address}:${rinfo.port}`);
    
    updateMatrix(playerMatrix, data);
    renderer.update(playerMatrix);
  });

  server.on('listening', () => {
    let address = server.address();
    console.log(`server listening on: ${address.address}:${address.port}`);
    renderer.start();
  });

  server.bind(41234); // server listening 0.0.0.0:41234
  
}
