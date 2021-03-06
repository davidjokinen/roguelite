import { getConfig } from '../tiles/get-tile.js';
// const { getConfig } = require('../tiles/get-tile.js');

// import { LAYERS } from '../graphics/resources.mjs';
// const { LAYERS } = require('../graphics/resources.mjs');


// const { getEdgesTextureID, newEdgeHits, getEdgeData, getTextureData } = require('../entities/entity-common');

export default class Tile {
  constructor(type, x, y) {
    this.type = type;
    this.x = x;
    this.y = y;
    this.id = `${x}_${y}`
    this.data = null;

    this._handlers = {};
    this.entities = [];

    this.walkable = true;

    this._RegisterHandler('tile.onEnter', (m) => this._onTileEnter(m));
    
    this.textureMap = null;
    this.textureId = null;
    this.texture = null;
    this.sprite = null;

    this.updateType(type);
  }

  _RegisterHandler(n, h) {
    if (!(n in this._handlers)) {
      this._handlers[n] = [];
    }
    this._handlers[n].push(h);
  }

  _onTileEnter(m) {
    for (let i=0;i<this.entities.length;i++) {
      this.entities[i].broadcast(m);
    }
  }

  broadcast(msg) {
    if (!(msg.topic in this._handlers)) {
      return;
    }

    for (let curHandler of this._handlers[msg.topic]) {
      curHandler(msg);
    }
  }

  updateType(type) {
    let data = getConfig(type);
    if (data) {
      this.data = data;
    } else {
      console.error('error')
      return;
    }

    this.walkable = data.walkable;
    this.type = type;
    return data;
  }

  checkEdges(map) {

  }

  findEntities(search) {
    // Example search: 
    // * {action: 'chop'}
    search = search || {};
    return this.entities.filter(entity => {
      let keepEntity = true;
      if (search.action) {
        if (!entity.data.actions || !(search.action in entity.data.actions))
          keepEntity = false;
      }
      return keepEntity;
    });
  }

  checkEntities(search) {
    return this.findEntities(search).length > 0;
  }

  isWalkable(self) {
    if (this.type === 'water') return false;
    for (let i=0;i<this.entities.length;i++) {
      const entity = this.entities[i];
      if (entity === self) continue;
      if (!entity.walkable)
        return false;
    }
    return true;
  }

  render() {

  }

  remove() {

  }

  export() {
    return {
      type: this.type,
      x: this.x,
      y: this.y,
    }
  }

  import(data) {
    
  }
}
