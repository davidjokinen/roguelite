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
    const isTileGood = (tile) => {
      // replace condition later
      return tile.type !== 'water' && tile.entities.length === 0;
    }

    while (searchSize < 10) {
      let curX = findX - searchSize;
      let curY = findY - searchSize;
      tile = this.getTile(curX, curY);
      if (isTileGood(tile)) return tile;
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
      for(let i=0;i<size-1;i++) {
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

  update() {

  }

  render() {
    Object.values(this.chunks).forEach(chunk => chunk.render());
  }
}