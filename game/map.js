import { roguelikeSheetTextureMap, LAYERS } from './resources';
import { loopXbyX } from './utils';

const GRASS = 'GRASS';
const GRASS2 = 'GRASS2';
const DIRT = 'DIRT';
const WATER = 'WATER';

const TileTypeList = [
  GRASS,
  GRASS2,
  DIRT,
  WATER
]

const TileTypes = {
  ...TileTypeList,
}

const TileTypeMap = {
  GRASS: roguelikeSheetTextureMap.getTexture(5),
  GRASS2: roguelikeSheetTextureMap.getTexture(62),
  DIRT: roguelikeSheetTextureMap.getTexture(6),
  WATER: roguelikeSheetTextureMap.getTexture(0)
};

class Tile {
  constructor(type, x, y) {
    this.type = type;
    this.x = x;
    this.y = y;

    this._renderNeedsUpdate = true;
    this.sprite = null;
  }

  updateType(type) {
    if (this.type === type) return;
    if (this.sprite) {
      const newTexture = TileTypeMap[this.type];
      this.sprite.setTexture(newTexture);
    }
    this.type = type;
  }

  render() {
    if (!this.sprite) {
      this.sprite = LAYERS['tile'].createSprite(
        TileTypeMap[this.type], 
        this.x, this.y);
    }
  }
}

const SIZE = 100;

export default class Map {
  constructor() {
    this.tiles = [];

    this.init();
  }

  getTile(x, y) {
    let i = x*SIZE+y%SIZE;
    return this.tiles[i];
  }

  init() {
    for(let x=0;x<SIZE;x++) {
      for(let y=0;y<SIZE;y++) {
        let tileType = GRASS2;
        if (Math.random()<.4)
        tileType = GRASS;
        let i = x*SIZE+y%SIZE;
        this.tiles[i] = new Tile(tileType, x, y);
      }
    }
    loopXbyX(25,20,20,3, (x, y) => {
      const tile = this.getTile(x, y);
      if (!tile) return;
      tile.updateType(DIRT);
    });
    loopXbyX(10,10,8,20, (x, y) => {
      const tile = this.getTile(x, y);
      if (!tile) return;
      tile.updateType(WATER);
    });
  }

  update() {
    this.tiles.forEach(tile => {
      tile.updateType(TileTypeList[~~(Math.random()*3)]);
    });
  }

  render() {
    this.tiles.forEach(tile => tile.render());
  }
}