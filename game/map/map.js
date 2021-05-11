import Chunk from './chunk.js';

import { loopXbyX } from '../utils';

const CHUNK_SIZE = 3;
const SIZE = 50;

export default class Map {
  constructor() {
    this.chunks = [];

    this.init();
  }

  getTile(x, y) {
    const chunkX = x/SIZE;
    const chunkY = y/SIZE;
    let i = chunkX*CHUNK_SIZE+chunkY%CHUNK_SIZE;
    return this.chunks[i].getTile(x,y);
  }

  init() {
    for(let x=0;x<CHUNK_SIZE;x++) {
      for(let y=0;y<CHUNK_SIZE;y++) {
        let i = x*CHUNK_SIZE+y%CHUNK_SIZE;
        this.chunks[i] = new Chunk(this, x, y);
      }
    }
    // loopXbyX(25,20,20,3, (x, y) => {
    //   const tile = this.getTile(x, y);
    //   if (!tile) return;
    //   tile.updateType('dirt');
    // });
    // loopXbyX(10,10,8,20, (x, y) => {
    //   const tile = this.getTile(x, y);
    //   if (!tile) return;
    //   tile.updateType('water');
    // });
    // loopXbyX(11,25,8,10, (x, y) => {
    //   const tile = this.getTile(x, y);
    //   if (!tile) return;
    //   tile.updateType('water');
    // });

    // loopXbyX(4, 5,8,10, (x, y) => {
    //   const tile = this.getTile(x, y);
    //   if (!tile) return;
    //   tile.updateType('water');
    // });

    // this.tiles.forEach(tile => {
    //   tile.checkEdges(this);
    // })
  }

  update() {

  }

  render() {
    this.chunks.forEach(chunk => chunk.render());
  }
}