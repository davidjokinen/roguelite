import WorldClient from './world-client.mjs'; 
import { v4 as uuidv4 } from 'uuid';

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

import CHAT_COMMANDS from '../../game/net/common/chat.js';

class ChatNetworkManager extends NetworkFeature {
  init(manager) {
    manager.chatRooms = {
      global: [],
    };
    manager.addOnMessage(CHAT_COMMANDS.CHAT_MESSAGE, (client, event, data) => {
      // TODO: check message
      manager.broadcast(CHAT_COMMANDS.CHAT_MESSAGE, {
        id: uuidv4(),
        user: client.ID,
        message: data
      });
    });

    manager.sendMessage = (message) => {
      manager.broadcast(CHAT_COMMANDS.CHAT_MESSAGE, {
        id: uuidv4(),
        server: true,
        message: message
      });
    };
  }

  remove(manager) {
    delete manager.chatRooms;
    manager.removeOnMessage(CHAT_COMMANDS.CHAT_MESSAGE);
  }
}

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

import WORLD_COMMANDS from '../../game/net/common/world.js';

class WorldNetworkManager extends NetworkFeature {
  init(manager) {
    const world = this.params.world;
    if (!world) {
      console.error('World not loaded');
      return;
    }
    
    manager.addOnMessage(WORLD_COMMANDS.WORLD_PING, (client, _) => {
      const map = world.getMapFocusByClient(client);
      client.send(WORLD_COMMANDS.WORLD_PING, map.exportAll());
      // client.send(ENTITIES_COMMANDS.ENTITIES_SYNC, map.exportEntities());
    });

    manager.addOnMessage(WORLD_COMMANDS.WORLD_UPDATE, (client, _) => {
      // Event for client
    });

  }
}

import MAP_COMMANDS from '../../game/net/common/map.js';

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

    manager.addOnMessage(MAP_COMMANDS.MAP_UPDATE, (client, event, data) => {
      const mapUpdate = {
        target: data.target,
        type: data.type,
        x: data.x,
        y: data.y,
      };
      // TODO: validate data isnt null;
      map.updateTile(mapUpdate);
      manager.broadcast(MAP_COMMANDS.MAP_UPDATE, mapUpdate);
    });
  }
}


import ENTITIES_COMMANDS from '../../game/net/common/entities.js';
import Map from '../../game/map/map.mjs';
// import { EntityManager } from '../../game/map/map.mjs';
import BaseGenerator from '../../game/map/generators/base-generator.mjs';

class EntitiesNetworkManager extends NetworkFeature {
  
  init(manager) {
    const world = this.params.world;
    if (!world) {
      console.error('World not loaded');
      return;
    }

    const onEntityUpdate = (entity, action) => {
      if (action.id === 'walk') {
        const output = action.export(entity);
        manager.broadcast(ENTITIES_COMMANDS.ENTITY_ACTION_UPDATE, output);
      }
    }

    world.maps.forEach(map => {
      for (let i=0; i<map.entities.length; i++) {
        const entity = map.entities[i];
        if (entity.isUpdateEntity) {
          entity.onActionUpdate((action) => {
            onEntityUpdate(entity, action);
          });
        }
      }
    });

    world.onAddMap(map => {

    });

    world.onRemoveMap(map => {

    });

    manager.addOnMessage(ENTITIES_COMMANDS.ENTITIES_SYNC, (client, _) => {
      let map = null;
      if (client.entity) {
        map = client.entity.map;
      } else {
        map = world.getMapFocus();
      }
      if (map) {
        client.send(ENTITIES_COMMANDS.ENTITIES_SYNC, map.exportEntities());
      }
    });

    manager.addOnMessage(ENTITIES_COMMANDS.ENTITIES_ADD, (client, event, data) => {
      const newEntity = {
        target: data.target,
        id: data.id,
        mapID: data.mapID,
        type: data.type,
        x: data.x,
        y: data.y,
      };
      world.createEntity(newEntity);
    });

    manager.addOnMessage(ENTITIES_COMMANDS.ENTITIES_REMOVE, (client, event, data) => {
      const removeEntityID = data;
      world.removeEntity(removeEntityID);
      // map.removeEntity(removeEntityID);
    });

    world.onAddEntity(entity => {
      // console.log('Add Entity')
      manager.broadcast(ENTITIES_COMMANDS.ENTITIES_ADD, entity.export());
      if (entity.isUpdateEntity) {
        entity.onActionUpdate((action) => {
          onEntityUpdate(entity, action);
        });
      }
    });

    world.onRemoveEntity(entity => {
      // console.log('Remove Entity ', !!entity, entity.id)
      if (!entity.id) {
        console.log(entity)
        throw new Error('test')
      }
      const removeEntityID = entity.id;
      manager.broadcast(ENTITIES_COMMANDS.ENTITIES_REMOVE, removeEntityID);
    });

    world.onEntityMapMove(entity => {
      manager.broadcast(ENTITIES_COMMANDS.ENTITIES_MOVE_MAP, entity.export());
    });
  }
}

import GameTime from '../../game/services/game-time.mjs';
import ActionQueue from '../../game/services/action-queue.mjs';
import PathFinding from '../../game/services/path-finding.mjs';
import DefaultScene from '../../game/scenes/default-scene.mjs';
import PLAYER_COMMANDS from '../../game/net/common/player.js';

import WalkAction from '../../game/actions/walk-action.mjs';
import CaveGenerator from '../../game/map/generators/cave-generator.mjs';
import GameWorld from '../../game/map/game-world.mjs';

export default class WorldManger extends DefaultScene  {
  constructor() {
    super();
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
      const client = this.clients[i];
      if (client)
        client.send(evt, data);
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
    const gameTime = new GameTime();
    const pathFinding = new PathFinding();
    const actionQueue = new ActionQueue();

    this.world = new GameWorld();
    this.world.scene = this;

    this.map = new Map(this.world, new BaseGenerator(), pathFinding);
    this.caveTest = new Map(this.world, new CaveGenerator(), pathFinding);
    this.titleTest = new Map(this.world, null, pathFinding);

    this.world.addMap(this.map);
    this.world.addMap(this.caveTest);
    this.world.addMap(this.titleTest);
    
    this.world.setMapFocus(this.caveTest, 0, 0);

    const Entity = this.world.getEntityClass();

    this.addComponent(pathFinding);
    this.addComponent(gameTime);
    this.addComponent(actionQueue);

    this.addFeature(new CVarsNetworkManager());
    this.addFeature(new ChatNetworkManager());
    this.addFeature(new PlayersNetworkManager());
    this.addFeature(new WorldNetworkManager({ world: this.world }));
    // this.addFeature(new MapNetworkManager({ map: this.map }));
    this.addFeature(new EntitiesNetworkManager({ world: this.world }));
    
    this.addOnMessage(PLAYER_COMMANDS.PLAYER_SPAWN, (client, event, data) => {
      if (!client.entity) {
        client.onMapChange = () => {
          const map = this.world.getMapFocusByClient(client);
          // console.log('map ',!!client.entity.world)
          client.send(WORLD_COMMANDS.WORLD_UPDATE, map.exportAll());
          client.send(PLAYER_COMMANDS.PLAYER_SPAWN, { id: client.entity.id });
        }
        client.entity = this.map.addEntity(new Entity('socket-player', 37, 37));
        client.entity.addOnMapChange(client.onMapChange);
        const map = this.world.getMapFocusByClient(client);
        client.send(WORLD_COMMANDS.WORLD_UPDATE, map.exportAll());
        client.send(PLAYER_COMMANDS.PLAYER_SPAWN, { id: client.entity.id });
      }
    });

    this.addOnMessage(PLAYER_COMMANDS.PLAYER_MOVE, (client, event, data) => {
      const entity = client.entity;
      if (!entity) return;

      entity.MOVE_UP = data.MOVE_UP;
      entity.MOVE_DOWN = data.MOVE_DOWN;
      entity.MOVE_LEFT = data.MOVE_LEFT;
      entity.MOVE_RIGHT = data.MOVE_RIGHT;
    });

    this.map.addEntity(new Entity('cave-enter', 40, 40, {
      teleport: {
        map: this.caveTest,
        x: 40,
        y: 35,
      }
    }));

    this.caveTest.addEntity(new Entity('cave-enter', 40, 35, {
      teleport: {
        map: this.map,
        x: 40,
        y: 40,
      }
    }));

    this.map.addEntity(new Entity('cave-enter', 35, 35, {
      teleport: {
        map: this.map,
        x: 35,
        y: 40,
      }
    }));

    this.map.addEntity(new Entity('cave-enter', 35, 40, {
      teleport: {
        map: this.map,
        x: 35,
        y: 35,
      }
    }));

    this.setCvar('title', 'Multiplayer Game Test');
  }

  add(client, params) {
    const _client = new WorldClient(this, client, params, () => {
      this.remove(_client);
    });
    console.log('Player Connected:',_client.ID)
    if (this.sendMessage) 
      this.sendMessage(`Player Connected: ${_client.ID}`);
    this.clients.push(_client);
    this.features.forEach(feature => {
      feature.clientAdd(this, _client);
    });
    _client.send('login.complete');
  }

  remove(client) {
    const _client = client;
    console.log('Player Disconnected:',_client.ID)
    if (this.sendMessage) 
      this.sendMessage(`Player Disconnected: ${_client.ID}`);
    if (client.entity) {
      client.entity.removeOnMapChange(client.onMapChange);
      client.entity.destroy();
      client.entity = null;
    }
    this.clients = this.clients.filter(test => client.ID !== test.ID);
    this.features.forEach(feature => {
      feature.clientRemove(this, _client);
    });
  }

  update() {
    super.update();
    this.world.update();
    for (let i=0;i<this.clients.length;i++) {
      this.clients[i].update();
    }
  }
}
