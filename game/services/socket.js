import BaseService from './base-service';

class NetworkFeature {
  init(socket) {

  }

  remove(socket) {

  }
}

import CVAR_COMMANDS from '../net/common/cvar';

class CVars extends NetworkFeature {
  init(socket) {
    socket.cvars = {};
    socket.addOnMessage(CVAR_COMMANDS.CVAR_SYNC, (command, cvars) => {
      socket.cvars = {...cvars};
      console.log('socket.cvars ',socket.cvars)
    });
    socket.addOnMessage(CVAR_COMMANDS.CVAR_UPDATE, (command, update) => {
      socket.cvars = {...cvars, ...update};
    });
    // socket.send(CVAR_COMMANDS.CVAR_SYNC);
  }

  remove(socket) {
    delete socket.cvars;
    socket.removeOnMessage(CVAR_COMMANDS.CVAR_SYNC);
    socket.removeOnMessage(CVAR_COMMANDS.CVAR_UPDATE);
  }
}

import PLAYERS_COMMANDS from '../net/common/players';

class Players extends NetworkFeature {
  init(socket) {
    socket.players = [];
    socket.addOnMessage(PLAYERS_COMMANDS.PLAYERS_LIST, (command, list) => {
      console.log('socket.players ', list)
      socket.players = [...list];
    });
    socket.addOnMessage(PLAYERS_COMMANDS.PLAYERS_ADD, (command, add) => {
      socket.players.push(add);
      console.log('Addplayers ', socket.players)
    });
    socket.addOnMessage(PLAYERS_COMMANDS.PLAYERS_REMOVE, (command, id) => {
      socket.players = socket.players.filter(player => player.id !== id);
      console.log('Removeplayers ', socket.players);
    });
  }

  remove(socket) {
    delete socket.players;
    socket.removeOnMessage(PLAYERS_COMMANDS.PLAYERS_LIST);
    socket.removeOnMessage(PLAYERS_COMMANDS.PLAYERS_ADD);
    socket.removeOnMessage(PLAYERS_COMMANDS.PLAYERS_REMOVE);
  }
}

import MAP_COMMANDS from '../net/common/map';

class MapNetworkManager extends NetworkFeature {
  init(socket) {
    socket.addOnMessage(MAP_COMMANDS.MAP_LIST, (command, data) => {
      console.log('MAP_LIST ', data)
      socket.map.import(data);
    });
  }
}

export default class Socket extends BaseService {
  constructor(socket) {
    super();
    this.id = 'socket';
    this._socket = socket;

    this.features = [];
    this.eventMap = {};
    // Todo replace
    window.send = this.send.bind(this);
  }

  connect() {
    this._socket = io('ws://coolmacbookpro.local:3000', {
      reconnection: false,
      transports: ['websocket'],
    });

    this._socket.on('connect', () => {
      console.log('Connected: ', this._socket.id);
      const randomName = `test${Math.random()}`;
      this._socket.emit('login.commit', randomName);
    });

    this._socket.on('disconnect', () => {
      console.log('Disconnected')
    });

    this._socket.onAny((e, d) => {
      if (e in this.eventMap)
        this.eventMap[e](e,d)
      else
        console.log(e, d)
    })
  }

  addOnMessage(key, callback) {
    this.eventMap[key] = callback;
  }

  removeOnMessage(key) {
    delete this.eventMap[key];
  }

  addFeature(feature) {
    this.features.push(feature);
    feature.init(this);
  }

  removeFeature(feature) {
    alert('TODO');
  }

  init() {
    this.connect();
    this.addFeature(new CVars());
    this.addFeature(new Players());
    this.addFeature(new MapNetworkManager());

    this.eventMap['login.complete'] = () => {
      console.log('update login.complete')
      this.send(CVAR_COMMANDS.CVAR_SYNC);
      this.send(PLAYERS_COMMANDS.PLAYERS_LIST);
      this.send(MAP_COMMANDS.MAP_LIST);
    }
  }

  remove() {

  }

  send(key, data) {
    // TODO 
    this._socket.emit(key, data);
    
  }

  update() {
    
  }

}