import Tile from './tile.js';

const SIZE = 50;

export default class Chunk {
  constructor(map, x, y) {
    this.x = x;
    this.y = y;
    this.map = map;
    this.grid = [];

    this.generate();
  }

  generate() {
    this.grid = new Array(SIZE*SIZE);
    for (let x=0;x<SIZE*SIZE;x++) {
      const posx = ~~(x%SIZE+this.x*SIZE);
      const posy = ~~(~~(x/SIZE)+this.y*SIZE);
      const type = (this.x+this.y)%2 === 0 ? 'grass' : 'dirt';
      if (this.map.generator) {
        const newType = this.map.generator.tileInit(posx, posy);
        if (newType) type = newType;
      }
      this.grid[x] = new Tile(type, posx, posy);
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
    this.grid.forEach(tile => {
      tile.render();
    });
  }

  remove() {
    this.grid.forEach(tile => {
      tile.remove();
    });
  }
}
