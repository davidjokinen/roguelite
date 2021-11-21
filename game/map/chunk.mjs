import Tile from './tile.mjs';
// const Tile = require('./tile.js');


const SIZE = 50;

export default class Chunk {
  constructor(map, x, y) {
    this.x = x;
    this.y = y;
    this.map = map;
    this.grid = [];

    this.generate();
  }

  newTile() {
    return this.map.newTile(...arguments);
  }

  generate() {
    this.grid = new Array(SIZE*SIZE);
    for (let x=0;x<SIZE*SIZE;x++) {
      const posx = ~~(x%SIZE+this.x*SIZE);
      const posy = ~~(~~(x/SIZE)+this.y*SIZE);
      let type = (this.x+this.y)%2 === 0 ? 'grass' : 'dirt';
      if (this.map.generator) {
        const newType = this.map.generator.tileInit(posx, posy);
        if (newType) type = newType;
      }
      this.grid[x] = this.newTile(type, posx, posy);
    }
    
  }

  checkEdges() {
    this.grid.forEach(tile => {
      tile.checkEdges(this.map);
    });
  }

  getTile(posX, posY) {
    const x = posX - this.x*SIZE;
    const y = posY - this.y*SIZE;
    if (x < 0 || y < 0) return null;
    if (x >= SIZE || y >= SIZE) return null;
    const i = x+(y*SIZE);
    return this.grid[i];
  }

  render() {
    const length = this.grid.length;
    for (let i=0; i<length; i++) {
      this.grid[i].render();
    }
  }

  remove() {
    this.grid.forEach(tile => {
      tile.remove();
    });
  }

  export() {
    const output = {};
    output.x = this.x;
    output.y = this.y;
    output.grid = this.grid.map(tile => tile.export());
    return output;
  }

  import(data) {
    this.grid.forEach(tile => {
      tile.remove();
    });
    this.grid = [];
    data.grid.forEach((tile, i) => {
      const posx = ~~(i%SIZE+this.x*SIZE);
      const posy = ~~(~~(i/SIZE)+this.y*SIZE);
      // console.log(tile.type, posx, posy)
      this.grid[i] = this.newTile(tile.type, posx, posy);
    });
  }
}

// module.exports = Chunk;