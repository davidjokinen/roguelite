import Chunk from './chunk.mjs';
import Tile from  './tile.mjs';

// import { loopXbyX, getRandomInt } from '../core/utils.mjs';
import ENTITIES_COMMANDS from '../../game/net/common/entities.js';
import Entity from '../entities/entity.mjs';

const CHUNK_SIZE = 3;
const SIZE = 50;

let mapFocus = null;


export class EntityManager {
  constructor(list) {
    this.list = list;
  }

  broadcast(event, data) {

  }

  add(e) {
    this.list.push(e);
    this.broadcast(ENTITIES_COMMANDS.ENTITIES_ADD, e);
  }

  remove(e) {
    const index = this.list.indexOf(event);
		if (index < -1) return;
		this.list.splice(index, 1); 
    this.broadcast(ENTITIES_COMMANDS.ENTITIES_REMOVE, e);
  }

  export() {
    console.log('export')
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

export default class Map {
  constructor(scene, generator, pathFindingComponent) {
    this.scene = scene;
    this.generator = generator;
    this.pathFindingComponent = pathFindingComponent;
    this.chunks = {};

    this._onAddEntity = [];
    this._onRemoveEntity = [];

    this.entities = [];
    this.entityManager = new EntityManager(this.entities);
    this.tickEntities = [];
    this.renderEntities = [];

    this._tileClass = Tile;

    this.setFocus();
    this.init();
  }

  newTile() {
    return new Tile(...arguments);
  }

  static getFocus() {
    return mapFocus;
  }

  setFocus() {
    mapFocus = this;
  }

  getEntityByID(id) {
    for(let i=0;i<this.entities.length;i++) {
      if (this.entities[i].id === id) {
        return this.entities[i];
      }
    }
    return null;
  }

  addEntity(entity) {
    entity.map = this;
    this.entityManager.add(entity);
    entity.needsRender = () => {
      this.renderEntities.push(entity);
    };
    this.renderEntities.push(entity);
    if (entity.script) {
      this.tickEntities.push(entity);
    }
    this._onAddEntity.forEach(evt => evt(entity));
    return entity;
  }

  removeEntity(entity) {
    if (Number.isInteger(entity)) {
      entity = this.getEntityByID(entity);
    }
    if (!entity)
      return;
    let index = this.entities.indexOf(entity);
    if (index > -1) {
      this.entities.splice(index, 1);
    }
    index = this.tickEntities.indexOf(entity);
    if (index > -1) {
      this.tickEntities.splice(index, 1);
    }
    this._onRemoveEntity.forEach(evt => evt(entity));
    entity.remove();
  }

  getTile(x, y) {
    const chunkX = ~~(x/SIZE);
    const chunkY = ~~(y/SIZE);   
    let i = `${chunkX}_${chunkY}`;
    if (!(this.chunks[i])) return null;
    return this.chunks[i].getTile(x,y);
  }

  findRandomCloseEmptyTile(findX, findY) {
    const isTileGood = (checkTile) => {
      // replace condition later
      return checkTile && checkTile.type !== 'water' && checkTile.entities.length === 0;
    }
    const list = this.getNeighbors(findX, findY).filter(isTileGood);
    if (list.length === 0) return null;
    const randomInt = ~~(list.length*Math.random());
    return list[randomInt];
  }

  findEmptyTile(findX, findY) {
    let searchSize = 0;
    let tile = null;
    const isTileGood = (checkTile) => {
      // replace condition later
      return checkTile && checkTile.type !== 'water' && checkTile.entities.length === 0;
    }

    while (searchSize < 20) {
      let curX = findX - searchSize;
      let curY = findY - searchSize;
      if (searchSize === 0) {
        tile = this.getTile(curX, curY);
        if (isTileGood(tile)) return tile;
      }
      
      const size = searchSize*2;
      for(let i=0;i<size;i++) {
        curX += 1;
        tile = this.getTile(curX, curY);
        if (isTileGood(tile)) return tile;
      }
      for(let i=0;i<size;i++) {
        curY += 1;
        tile = this.getTile(curX, curY);
        if (isTileGood(tile)) return tile;
      }
      for(let i=0;i<size;i++) {
        curX -= 1;
        tile = this.getTile(curX, curY);
        if (isTileGood(tile)) return tile;
      }
      for(let i=0;i<size;i++) {
        curY -= 1;
        tile = this.getTile(curX, curY);
        if (isTileGood(tile)) return tile;
      }

      searchSize++;
    }
    return tile;
  }

  init() {
    if (this.generator) this.generator.init(this);
    for(let x=0;x<CHUNK_SIZE;x++) {
      for(let y=0;y<CHUNK_SIZE;y++) {
        let i = `${x}_${y}`;
        this.chunks[i] = new Chunk(this, x, y);
        if (this.generator) {
          this.generator.chunkPost(x, y, SIZE);
        }
      }
    }
    this.refreshEdges();
  }

  refreshEdges() {
    Object.values(this.chunks).forEach(chunks => {
      chunks.checkEdges();
    })
  }

  getNeighbors(x,y) {
    return [
      this.getTile(x-1, y-1),
      this.getTile(x-1, y),
      this.getTile(x-1, y+1),
      this.getTile(x, y+1),
      this.getTile(x+1, y+1),
      this.getTile(x+1, y),
      this.getTile(x+1, y-1),
      this.getTile(x, y-1),
    ].filter(tile => tile);
  }

  findPath(startX, startY, endX, endY) {
    const startTile = this.getTile(startX, startY);
    const endTile = this.getTile(endX, endY);
    return this.pathFindingComponent.findPath(this, startTile, endTile);
  }

  update() {
    const length = this.tickEntities.length;
    // console.log(length)
    for (let i=0; i<length; i++) {
      this.tickEntities[i].update(this, this.entities);
    }
  }

  render() {
    const listLength =  this.renderEntities.length;
    // TODO: can be moved into chunks 
    for(let i=0; i<listLength; i++) {
      this.renderEntities[i].render();
    }
    if (this.renderEntities.length > 1)
      this.renderEntities = [];
    const chunks = Object.values(this.chunks);
    const length = chunks.length;
    // TODO: Check if we need to render 
    for (let i=0; i<length; i++) {
      chunks[i].render();
    }
  }

  removeEntities() {
    this.entities.forEach(entity => entity.remove());
    this.entities = [];
    this.entityManager.list = this.entities;
    this.tickEntities = [];
  }

  remove() {
    console.log('MAP CLEAR')
    this.removeEntities();
    Object.values(this.chunks).forEach(chunk => chunk.remove());
    this.chunks = {};
  }

  export() {
    const out = {};
    out.chunks = [];
    Object.values(this.chunks).forEach(chunk => {
      out.chunks.push(chunk.export())
    })
    return out;
  }

  exportEntities() {
    return this.entityManager.export();
  }

  import(data) {
    // return;
    Object.values(this.chunks).forEach(chunk => chunk.remove());
    this.chunks = {};
    const newChunkData = data.chunks;
    
    newChunkData.forEach(chunk => {
      let i = `${chunk.x}_${chunk.y}`;
      console.log(i)
      this.chunks[i] = new Chunk(this, chunk.x, chunk.y);
      this.chunks[i].import(chunk);
    });
    this.refreshEdges();
  }

  updateTile(data) {
    if (!data.x || !data.y)
      return;
    const tile = this.getTile(data.x, data.y);
    if (!tile) {
      console.log('Bad update tile data ', data)
      return;
    }
    const { type } = data;
    if (tile.data.id === type)
      return;
    tile.updateType(type);
    if (type === 'water')
      tile.entities.forEach(entity => entity.remove());
    tile.checkEdges(this);
    this.getNeighbors(tile.x, tile.y).forEach(tile2 => {
      tile2.checkEdges(this)
    });
  }

  getEntityClass() {
    return Entity;
  }

  createEntity(data) {
    const _Entity = this.getEntityClass();
    const { type } = data;
    const tile = this.getTile(data.x, data.y);
    if (tile.data.id === 'water')
      return;
    tile.entities.forEach(entity => entity.remove());
    const newEntity = new _Entity(type, data.x, data.y);
    if (data.id)
      newEntity.id = data.id;
    this.addEntity(newEntity);
    tile.entities.map(e => e.checkEdges(this));
    this.getNeighbors(tile.x, tile.y).forEach(tile2 => {
      tile2.entities.map(e => e.checkEdges(this));
    });
    return newEntity;
  }

  onAddEntity(event) {
    this._onAddEntity.push(event);
  }

  onRemoveEntity(event) {
    this._onRemoveEntity.push(event);
  }

  addSocket(socket) {
    this._addEntity = this.addEntity;
    this.addEntity = (entity) => {
      entity.SERVER_UPDATE = true;
      return this._addEntity(entity);
    };

    this._removeEntity = this.removeEntity;
    this.removeEntity = (entity) => {
      return this._removeEntity(entity);
    };
  }
}
