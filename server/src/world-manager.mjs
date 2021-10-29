// const WorldClient = require('./world-client') 
import WorldClient from './world-client.mjs'; 


class NetworkFeature {
  constructor(params) {
    this.params = params;
  }

  init(manager) {

  }

  remove(manager) {

  }

  clientAdd(manager, client) {

  }

  clientRemove(manager, client) {
    
  }
}

// const CVAR_COMMANDS = require('../../game/net/common/cvar');
import CVAR_COMMANDS from '../../game/net/common/cvar.js';

class CVarsNetworkManager extends NetworkFeature {
  init(manager) {
    manager.cvars = {};
    manager.setCvar = (key, value) => {
      const update = {};
      update[key] = value;
      manager.cvars = {...manager.cvars, ...update};
      manager.broadcast(CVAR_COMMANDS.CVAR_UPDATE, update);
    }
    manager.addOnMessage(CVAR_COMMANDS.CVAR_SYNC, (client, _) => {
      client.send(CVAR_COMMANDS.CVAR_SYNC, manager.cvars);
    });
  }

  remove(manager) {
    delete manager.cvars;
    delete manager.setCvar;
    manager.removeOnMessage(CVAR_COMMANDS.CVAR_SYNC);
  }
}

// const PLAYERS_COMMANDS = require('../../game/net/common/players');
import PLAYERS_COMMANDS from '../../game/net/common/players.js';

class PlayersNetworkManager extends NetworkFeature {
  init(manager) {
    manager.players = [];
    manager.addOnMessage(PLAYERS_COMMANDS.PLAYERS_LIST, (client, _) => {
      client.send(PLAYERS_COMMANDS.PLAYERS_LIST, manager.players);
    });
  }

  remove(manager) {
    delete manager.players;
    manager.removeOnMessage(PLAYERS_COMMANDS.PLAYERS_LIST);
  }

  clientAdd(manager, client) {
    const newPlayer = {id: client.ID, name: client.params.accountName};
    manager.players.push(newPlayer);
    manager.broadcast(PLAYERS_COMMANDS.PLAYERS_ADD, newPlayer);
  }

  clientRemove(manager, client) {
    manager.players = manager.players.filter(test => test.id !== client.ID);
    manager.broadcast(PLAYERS_COMMANDS.PLAYERS_REMOVE, client.ID);
  }
}

// const MAP_COMMANDS = require('../../game/net/common/map');
import MAP_COMMANDS from '../../game/net/common/map.js';
// const Map = require('../../game/map/map');

class MapNetworkManager extends NetworkFeature {
  init(manager) {
    const map = this.params.map;
    if (!map) {
      console.error('Map not loaded');
      return;
    } 
    
    manager.addOnMessage(MAP_COMMANDS.MAP_LIST, (client, _) => {
      client.send(MAP_COMMANDS.MAP_LIST, map.export());
    });
  }
}


// const ENTITIES_COMMANDS = require('../../game/net/common/entities');
import ENTITIES_COMMANDS from '../../game/net/common/entities.js';
// const Map = require('../../game/map/map');
import Map from '../../game/map/map.mjs';
import BaseGenerator from '../../game/map/generators/base-generator.mjs';

class EntityManager {
  constructor(list) {
    this.list = list;
  }

  broadcast(event, data) {

  }

  add(e) {
    this.list.push(e);
    this.broadcast(ENTITIES_COMMANDS.ENTITIES_ADD, e.export());
  }

  remove(e) {
    const index = this.list.indexOf(event);
		if (index < -1) return;
		this.list.splice(index, 1); 
    this.broadcast(ENTITIES_COMMANDS.ENTITIES_REMOVE, e.export());
  }

  export() {
    const data = {
      list: this.list.map(e => e.export())
    };
    return data;
  }

  import(data) {
    this.list.forEach(e => {
      e.remove();
    });
    // data.list.map(e => )

  }
}

class EntitiesNetworkManager extends NetworkFeature {
  
  init(manager) {
    const list = this.params.list;
    if (!list) {
      console.error('Entity list not loaded');
      return;
    } 

    const entityManager = new EntityManager(list);
    manager.addEntity = entityManager.add.bind(entityManager);
    manager.removeEntity = entityManager.remove.bind(entityManager);
    
    manager.addOnMessage(ENTITIES_COMMANDS.ENTITIES_SYNC, (client, _) => {
      client.send(ENTITIES_COMMANDS.ENTITIES_SYNC, entityManager.export());
    });
  }
}

export default class WorldManger {
  constructor() {
    this.clients = [];

    this.eventTriggerMap = {};
    this.features = [];

    this.map = null;
    this.entities = [];

    this.add = this.add.bind(this);
    this.remove = this.remove.bind(this);
    this.init();
  }

  broadcast(evt, data) {
    const length = this.clients.length;
    for(let i=0; i<length; i++) {
      this.clients[i].send(evt, data);
    }
  }

  addOnMessage(event, callback) {
    this.eventTriggerMap[event] = callback;
  }

  removeOnMessage(event) {
    delete this.eventTriggerMap[event];
  }

  addFeature(feature) {
    this.features.push(feature);
    feature.init(this);
  }

  init() {
    this.map = new Map(this, new BaseGenerator());
    this.list = [];

    this.addFeature(new CVarsNetworkManager());
    this.addFeature(new PlayersNetworkManager());
    this.addFeature(new MapNetworkManager({ map: this.map }));
    this.addFeature(new EntitiesNetworkManager({ list: this.list }));

    this.setCvar('title', 'Multiplayer Game Test');
  }

  add(client, params) {
    const _client = new WorldClient(this, client, params, () => {
      this.remove(client);
    });
    this.clients.push(_client);
    this.features.forEach(feature => {
      feature.clientAdd(this, _client);
    });
    _client.send('login.complete');
  }

  remove(client) {
    const _client = client;
    this.clients = this.clients.filter(test => client.ID !== test.ID);
    this.features.forEach(feature => {
      feature.clientRemove(this, _client);
    });
  }

  update() {

  }
}

// module.exports = WorldManger;