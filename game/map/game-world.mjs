import { createEventlistener } from "../core/utils.mjs";

import Entity from '../entities/entity.mjs';

let rootWorld = null;
export default class GameWorld {
  constructor(scene) {
    this.scene = scene;
    if (!rootWorld)
      rootWorld = this;
    this.mapFocus = {
      mapID: null,
      x: 0,
      y: 0,
    }
  
    this.onAddEntityEventListener = createEventlistener();
    this.onRemoveEntityEventListener = createEventlistener();
    this.onEntityMapMoveEventListener = createEventlistener();
    this.onAddMapEventListener = createEventlistener();
    this.onRemoveMapEventListener = createEventlistener();

    this.maps = [];
    this.mapsMap = {};

    this.entityMap = {};

    // Client
    this.mapRenderFocus = null;
  }

  static getRootWorld() {
    return rootWorld;
  }

  getEntityClass() {
    return Entity;
  }

  get Entity() {
    return this.getEntityClass();
  }

  entitySwitchMap(entity) {
    this.onEntityMapMoveEventListener.trigger(entity);
  }

  setMapFocus(mapID, x, y) {
    this.mapFocus.mapID = mapID.id ? mapID.id : mapID;
    this.mapFocus.x = x !== undefined ? x : 0;
    this.mapFocus.y = y !== undefined ? x : 0;
  }

  getMapFocus() {
    const mapID = this.mapFocus.mapID;
    if (mapID && mapID in this.mapsMap)
      return this.mapsMap[mapID];
    return null;
  }

  getMapFocusByClient(client) {
    if (client.entity) {
      return client.entity.map;
    } else {
      return this.getMapFocus();
    }
  }

  addSocket(socket) {
    // Client Side socket stuff
    this._addMap = this.addMap;
    this.addMap = (map) => {
      map.SERVER_UPDATE = true;
      return this._addMap(map);
    };
  }

  addMap(map) {
    map.world = this;
    map.scene = this.scene;
    this.mapsMap[map.id] = map;
    this.maps.push(map);
    this.onAddMapEventListener.trigger(map);
  }

  removeMap(map) {
    delete map.world;
    delete this.mapsMap[map.id];
    const index = this.maps.indexOf(map);
    if (index < -1) return;
    this.maps.splice(index, 1); 
    this.onRemoveMapEventListener.trigger(map);
  }

  export() {
    return {
      focus: this.mapFocus,
      maps: this.maps.forEach(map => map.export())
    }
  }

  import(data) {
    if (data.focus)
      this.setMapFocus(data.focus.map, data.focus.x, data.focus.y);
    if (data.maps) {
      for (let i=0; i<data.maps.length; i++) {
        const mapData = this.maps[i];
        const newMap = new Map(this);
        newMap.import(mapData);
        this.addMap(newMap);
      }
    }
  }

  exportMapFocus() {
    return {
      focus: this.mapFocus,
    };
  }

  replaceMapID(map, oldID, newID) {
    if (this.mapFocus.mapID === oldID)
      this.mapFocus.mapID = newID;
    delete this.mapsMap[oldID];
    this.mapsMap[newID] = map;
  }

  exportMapsByEntity(entity) {
    const mapID = entity.map.id;
    const x = entity.x;
    const y = entity.y;
    return {
      focus: {
        mapID: mapID,
        x: x !== undefined ? x : 0,
        y: y !== undefined ? y : 0,
      },
    };
  }

  importMapFocus(data) {
    if (data.focus)
      this.setMapFocus(data.focus.map, data.focus.x, data.focus.y);
  }

  exportMapByID(id) {
    const map = this.getMapByID(id);
    if (map) return map.export();
    return null;
  }

  getMapByID(id) {
    if (id in this.mapsMap) 
      return this.mapsMap[id];
    return null;
  }

  createEntity(data) {
    if (data.mapID) {
      const map = this.getMapByID(data.mapID);
      if (map) {
        const entity = map.createEntity(data);
        map.addEntity(entity);
        return entity;
      } else {
        console.log('ERROR')
      }
    }
    else console.log('ERROR2')
    return false;
  }

  addEntity(entity) {
    if (entity.world === this) return;
    // console.log('Create entity')
    this.entityMap[entity.id] = entity;
    entity.world = this;
    this.onAddEntityEventListener.trigger(entity);
  }

  removeEntity(entity, dontDelete) {
    if (typeof entity === 'string') {
      entity = this.getEntityByID(entity);
    }
    if (Number.isInteger(entity)) {
      entity = this.getEntityByID(entity);
    }
    
    if (entity) {
      delete this.entityMap[entity.id];
      const map = entity.map;
      if (map)
        map.removeEntity(entity, dontDelete);
      this.onRemoveEntityEventListener.trigger(entity);
    } else {
      let deleted = false;
      for(let i=0; i<this.maps.length; i++) {
        const map = this.maps[i];
        deleted = deleted || map.removeEntity(entity, dontDelete);
      }
      if (!deleted) {
        console.log('Entity couldnt be deleted')
      }
    }
  }

  getEntityByID(id) {
    if (id in this.entityMap) 
      return this.entityMap[id];
    return null;
  }

  forEachEntity(action) {
    for(let i=0; i<this.maps.length; i++) {
      const map = this.maps[i];
      for(let y=0; y<map.entities.length; y++) {
        const entity = map.entities[y];
        action(entity, map);
      }
    }
  }

  onAddEntity(evt) {
    this.onAddEntityEventListener.add(evt);
  }

  removeOnAddEntity(evt) {
    this.onAddEntityEventListener.remove(evt);
  }

  onEntityMapMove(evt) {
    this.onEntityMapMoveEventListener.add(evt);
  }

  removeOnEntityMapMove(evt) {
    this.onEntityMapMoveEventListener.remove(evt);
  }

  onRemoveEntity(evt) {
    this.onRemoveEntityEventListener.add(evt);
  }

  removeOnRemoveEntity(evt) {
    this.onRemoveEntityEventListener.remove(evt);
  }

  onAddMap(evt) {
    this.onAddMapEventListener.add(evt);
  }

  removeOnAddMap(evt) {
    this.onAddMapEventListener.remove(evt);
  }

  onRemoveMap(evt) {
    this.onRemoveMapEventListener.add(evt);
  }

  removeOnRemoveMap(evt) {
    this.onRemoveMapEventListener.remove(evt);
  }

  update() {
    for(let i=0; i<this.maps.length; i++) {
      const map = this.maps[i];
      map.update();
    }
  }

  moveEntity(data) {
    const entityID = data.id;
    const mapID = data.mapID;
    const entity = this.getEntityByID(entityID);
    console.log(this.mapFocus.mapID, data.mapID)
    console.log(entity)
    if (!entity && this.mapFocus.mapID === mapID) {
      console.log('CREATE')
      this.createEntity(data);
    } else if (entity && this.mapFocus.mapID !== mapID) {
      console.log('DELETE')
      entity.destroy();
      // this.removeEntity(entityID);
    }
      
    // 
  }

  render() {
    const map = this.getMapFocus();
    if (map) map.render();
  }

  setCurrentMap(data, askForMap) {
    if (data.mapFocus) {
      
    }
  }

  updateMaps() {

  }



}