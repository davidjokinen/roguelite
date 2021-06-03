import Chunk from './chunk.js';

import { loopXbyX } from '../utils';

const CHUNK_SIZE = 3;
const SIZE = 50;

let mapFocus = null;

export default class Map {
  constructor(generator) {
    this.generator = generator;
    this.chunks = {};

    this.setFocus();
    this.init();
  }

  static getFocus() {
    return mapFocus;
  }

  setFocus() {
    mapFocus = this;
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
    const searchList = [startTile];
    const cameFromMap = {};

    const tileCost = (tile) => {
      const difX = Math.abs(tile.x-endTile.x);
      const difY = Math.abs(tile.y-endTile.y);
      return ~~(Math.sqrt(difX*difX + difY*difY)*10);
    }

    const reconstructPath = (current) => {
      const path = [current];
      while(cameFromMap[current.id] && current !== startTile) {
        path.push(cameFromMap[current.id]);
        current = cameFromMap[current.id];
      }
      return path.reverse();
    }

    // G - walking cost from start (total)
    // H - Cost to move
    // F - G + H

    const gScore = {};
    gScore[startTile.id] = 0;
    const fScore = {};
    fScore[startTile.id] = tileCost(startTile);

    while (searchList.length > 0) {
      const searchTile = searchList[0];
      searchList.splice(0, 1); 
      if (searchTile === endTile) {
        return reconstructPath(searchTile);
      }

      this.getNeighbors(searchTile.x, searchTile.y).forEach(neighborTile => {
        // console.log(neighborTile, gScore[neighborTile.id], gScore)
        // TODO replace
        if (neighborTile.type === 'water') return;
        if (neighborTile.entities.length > 0) return;

        if (cameFromMap[neighborTile.id] !== undefined) return;
        let newG = gScore[searchTile.id] + 8;
        cameFromMap[neighborTile.id] = searchTile;
        gScore[neighborTile.id] = newG;
        fScore[neighborTile.id] = tileCost(neighborTile);
        searchList.push(neighborTile);
      });
      
      searchList.sort((t1, t2) => fScore[t1.id] - fScore[t2.id]);
      // console.log(searchList)
    }
    return null;
  }

  update() {

  }

  render() {
    Object.values(this.chunks).forEach(chunk => chunk.render());
  }

  remove() {
    Object.values(this.chunks).forEach(chunk => chunk.remove());
  }
}