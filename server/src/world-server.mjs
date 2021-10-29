// const { performance } = require('perf_hooks');
import { performance } from 'perf_hooks';

// const LoginQueue = require('./login-queue');
// const WorldManager = require('./world-manager');
import LoginQueue from './login-queue.mjs';
import WorldManager from './world-manager.mjs';

export class SocketWrapper {
  constructor(params) {
    this._socket = params.socket;
    
    this.onMessage = null;
    this._dead = false;
    this._SetupSocket();
  }

  get ID() {
    return this._socket.id;
  }

  get IsAlive() {
    return !this._dead;
  }

  _SetupSocket() {
    const socket = this._socket;

    socket.on('disconnect', () => {
      this.onDisconnect();
      this._dead = true;
    });

    socket.onAny((type, evt,) => {
      console.log('aa ', type, evt)
      try {
        if (!this.onMessage(type, evt)) {
          console.log(`Unknown command (${type} ${evt}), disconnected.`);
          this.disconnect();
        }
      } catch(err) {
        console.error(err);
        this.disconnect();
      }
    });
  }

  disconnect() {
    this._socket.disconnect(true);
  }

  send(msg, data) {
    this._socket.emit(msg, data);
  }

}

export class WorldServer {
  constructor(io) {
    this._loginQueue = new LoginQueue(
      (c, p) => { this.onLogin(c, p); }
    );
    this._worldManager = new WorldManager({
      parent: this
    });
    this._loginQueue.io = io;
    this._worldManager.io = io;
    this.setupIO(io);
  }

  setupIO(io) {
    io.on('connection', socket => {
      this._loginQueue.add(new SocketWrapper({socket: socket}));
    })
  }

  onLogin(client, params) {
    this._worldManager.add(client, params);
  }

  run() {
    const t1 = performance.now();
    this.loop(t1);
  }

  loop(t1) {
    setTimeout(() => {
      // console.log('test')
      const t2 = performance.now();
      const delta = (t2 - t1) * .001;
      this.update(delta);
      this.loop(t2);
    }, 15);
  }

  update(timeDelta) {
    // this._worldManager.update(timeDelta);
  }

}

// module.exports = {
//   SocketWrapper,
//   WorldServer,
// };
