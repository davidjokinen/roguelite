import Chunk from './chunk.js';

import { loopXbyX } from '../core/utils';

const CHUNK_SIZE = 3;
const SIZE = 50;

let mapFocus = null;

export default class Map {
  constructor(generator, pathFindingComponent) {
    this.generator = generator;
    this.pathFindingComponent = pathFindingComponent;
    this.chunks = {};

    this.entities = [];
    this.tickEntities = [];

    this.setFocus();
    this.init();
  }

  static getFocus() {
    return mapFocus;
  }

  setFocus() {
    mapFocus = this;
  }

  addEntity(entity) {
    this.entities.push(entity);
    if (entity.script) {
      this.tickEntities.push(entity);
    }
  }

  getTile(x, y) {
    const chunkX = ~~(x/SIZE);
    const chunkY = ~~(y/SIZE);   
    let i = `${chunkX}_${chunkY}`;
    if (!(this.chunks[i])) return null;
    return this.chunks[i].getTile(x,y);
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
    const listLength = this.entities.length;
    // TODO: can be moved into chunks 
    for(let i=0; i<listLength; i++) {
      if (this.entities[i].renderUpdate)
        this.entities[i].render();
    }
    const chunks = Object.values(this.chunks);
    const length = chunks.length;
    // TODO: Check if we need to render 
    for (let i=0; i<length; i++) {
      chunks[i].render();
    }
  }

  remove() {
    this.entities.forEach(entity => entity.remove());
    Object.values(this.chunks).forEach(chunk => chunk.remove());
  }
}