// const fs = require('fs');
// const http = require('http');
// const path = require('path');
// const socket_io = require('socket.io');

import { readFile } from 'fs';
import { createServer } from 'http';
import Module from 'module';
import { resolve, normalize, join } from 'path';
import * as socket_io from 'socket.io';

// console.log(Module._extensions)
// Module._extensions['.png'] = function(module, filename) {
//   module.exports = {};
// };

// const world_server = require('./src/world-server');
import * as world_server from './src/world-server.mjs';

const staticBasePath = process.env.STATIC || '../game/static';

function staticServe(req, res) {
  var resolvedBase = resolve(staticBasePath);
  var safeSuffix = normalize(req.url).replace(/^(\.\.[\/\\])+/, '');
  var fileLoc = join(resolvedBase, safeSuffix);
  // console.log(req.url)
  readFile(fileLoc, function(err, data) {
    if (err) {
        res.writeHead(404, 'Not Found');
        res.write('404: File Not Found!');
        return res.end();
    }
    
    res.statusCode = 200;

    res.write(data);
    return res.end();
  });
};

function Main() {
  const port = process.env.PORT || 3000;

  const server = createServer(staticServe);
  const io = new socket_io.Server(server, {
    cors: {
      origin: '*'
    }
  });

  server.listen(port, () => {
    console.log('listening on: *:', port);
  });

  const worldServer = new world_server.WorldServer(io);
  worldServer.run();
}

Main();