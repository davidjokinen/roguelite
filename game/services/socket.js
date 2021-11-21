import BaseService from './base-service.mjs';

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

    socket.addOnMessage(MAP_COMMANDS.MAP_UPDATE, (command, data) => {
      socket.map.updateTile(data);
    });
  }
}

import ENTITIES_COMMANDS from '../net/common/entities.js';
import EntityClient from '../entities/entity-client';
import WalkAction from '../actions/walk-action.mjs';

class EntitiesNetworkManager extends NetworkFeature {
  init(socket) {
    const { map } = socket;
    socket.addOnMessage(ENTITIES_COMMANDS.ENTITIES_SYNC, (command, data) => {
      console.log('ENTITIES_SYNC ', data)
      // socket.map.import(data);
      console.log(socket.map.entities.length)
      socket.map.removeEntities();
      const length = data.list.length;
      for(let i=0; i<length; i++) {
        const entity = data.list[i];
        if (entity.type !== undefined && entity.x !== undefined && entity.y !== undefined)
          socket.map.createEntity(entity);
        //socket.map.addEntity(new EntityClient(entity.type, entity.x, entity.y));
      }
      console.log(socket.map.entities.length)
    });

    socket.addOnMessage(ENTITIES_COMMANDS.ENTITIES_ADD, (command, data) => {
      console.log('add', data)
      map.createEntity(data);
    });

    socket.addOnMessage(ENTITIES_COMMANDS.ENTITIES_REMOVE, (command, data) => {
      console.log('remove', data)
      map.removeEntity(data);
    });

    socket.addOnMessage(ENTITIES_COMMANDS.ENTITY_ACTION_UPDATE, (command, data) => {
      const entity = map.getEntityByID(data.id);
      if (entity) {
        if (data.type === 'walk') {
          const newAction = new WalkAction();
          newAction.import(entity, data);
          entity.addSocketAction(newAction);
        }
         
      }
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
  }

  connect() {
    const type = SOCKET_TYPE;
    const host = SOCKET_HOST;
    const port = SOCKET_PORT;
    this._socket = io(`${type}://${host}:${port}`, {
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
      if (this._onDisconnect)
        this._onDisconnect();
    });

    this._socket.onAny((e, d) => {
      if (e in this.eventMap)
        this.eventMap[e](e,d);
      else
        console.log(e, d);
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
    this.addFeature(new EntitiesNetworkManager());

    this.eventMap['login.complete'] = () => {
      console.log('update login.complete')
      this.send(CVAR_COMMANDS.CVAR_SYNC);
      this.send(PLAYERS_COMMANDS.PLAYERS_LIST);
      this.send(MAP_COMMANDS.MAP_LIST);
      this.send(ENTITIES_COMMANDS.ENTITIES_SYNC);
      if (this._onLogin)
        this._onLogin();
    }
  }
  
  onLogin(action) {
    this._onLogin = action;
  }

  onDisconnect(action) {
    this._onDisconnect = action;
  }

  remove() {
    console.log('Disconnected from server')
    this._socket.disconnect();
  }

  send(key, data) {
    // TODO 
    this._socket.emit(key, data);
    
  }

  update() {
    
  }

}