import { getConfig } from '../tiles/get-tile';

import { LAYERS, SHEETS } from '../resources.js';

import { getTextureID } from '../utils';

export default class Tile {
  constructor(type, x, y) {
    this.type = type;
    this.x = x;
    this.y = y;
    this.data = null;
    
    this.textureMap = null;
    this.textureId = null;
    this.texture = null;
    this.sprite = null;

    this.updateType(type);
  }

  updateType(type) {
    // if (this.type === type) return;
    let data = getConfig(type);
    if (data) {
      this.data = data;
    } else {
      console.error('error')
    }

    let targetTextureMap = SHEETS['roguelikeChar'];
    let targetTextureId = 0;
    if (data.sprite) {
      if (data.sprite.sheet !== undefined && data.sprite.sheet in SHEETS)
        targetTextureMap = SHEETS[data.sprite.sheet];
      if (data.sprite.randomTiles) {
        const randomLength = data.sprite.randomTiles.length;
        const randomPick = data.sprite.randomTiles[~~(randomLength*Math.random())]
        const newTargetTextureId = getTextureID(randomPick, data.sprite.sheet)
        if (newTargetTextureId)
          targetTextureId = newTargetTextureId;
      } else {
        const newTargetTextureId = getTextureID(data.sprite.default, data.sprite.sheet)
        if (newTargetTextureId)
          targetTextureId = newTargetTextureId;
      }
    }
    this.textureMap = targetTextureMap;
    this.textureId = targetTextureId;
    if (this.sprite) {
      const newTexture = targetTextureMap.getTexture(targetTextureId);
      this.texture = newTexture;
      this.sprite.setTexture(newTexture);
    }
    this.type = type;
  }

  checkEdges(map) {
    if (!this.data) return;
    if (!this.data.sprite) return;
    if (!this.data.sprite.edges) return;
    const edges = this.data.sprite.edges;
    const { type, x, y } = this;
    const hits = {
      right: false,
      left: false,
      top: false,
      bottom: false,
      topleft: false,
      topright: false,
      bottomleft: false,
      bottomright: false,
      cornertopleft: false,
      cornertopright: false,
      cornerbottomleft: false,
      cornerbottomright: false,
    };
    let targetTile = map.getTile(x-1, y);
    if (targetTile.type === type) hits.left = true;
    targetTile = map.getTile(x+1, y);
    if (targetTile.type === type) hits.right = true;
    targetTile = map.getTile(x, y+1);
    if (targetTile.type === type) hits.top = true;
    targetTile = map.getTile(x, y-1);
    if (targetTile.type === type) hits.bottom = true;
    if (
      edges.cornertopleft ||
      edges.cornertopright ||
      edges.cornerbottomleft ||
      edges.cornerbottomright 
      ) {
      let targetTile = map.getTile(x-1, y+1);
      if (targetTile.type === type) hits.cornertopleft = true;
      targetTile = map.getTile(x+1, y+1);
      if (targetTile.type === type) hits.cornertopright = true;
      targetTile = map.getTile(x-1, y-1);
      if (targetTile.type === type) hits.cornerbottomleft = true;
      targetTile = map.getTile(x+1, y-1);
      if (targetTile.type === type) hits.cornerbottomright = true;
    }
    const sheet = this.data.sprite.sheet;
    let newTextureId = this.textureId;
    if (edges.right && !hits.right && hits.left) 
      newTextureId = getTextureID(edges.right, sheet);
    if (edges.left && hits.right && !hits.left) 
      newTextureId = getTextureID(edges.left, sheet);
    if (edges.top && hits.bottom && !hits.top) 
      newTextureId = getTextureID(edges.top, sheet);
    if (edges.bottom && hits.top && !hits.bottom) 
      newTextureId = getTextureID(edges.bottom, sheet);
    if (edges.topleft && !hits.top && hits.bottom && !hits.left && hits.right) 
      newTextureId = getTextureID(edges.topleft, sheet);
    if (edges.topright && !hits.top && hits.bottom && hits.left && !hits.right) 
      newTextureId = getTextureID(edges.topright, sheet);
    if (edges.bottomleft && hits.top && !hits.bottom && !hits.left && hits.right) 
      newTextureId = getTextureID(edges.bottomleft, sheet);
    if (edges.bottomright && hits.top && !hits.bottom && hits.left && !hits.right) 
      newTextureId = getTextureID(edges.bottomright, sheet);
    if (edges.cornerbottomright && hits.top && hits.left && !hits.cornertopleft) 
      newTextureId = getTextureID(edges.cornerbottomright, sheet);
    if (edges.cornertopleft && hits.bottom && hits.right && !hits.cornerbottomright) 
      newTextureId = getTextureID(edges.cornertopleft, sheet);
    if (edges.cornertopright && hits.bottom && hits.left && !hits.cornerbottomleft) 
      newTextureId = getTextureID(edges.cornertopright, sheet);
    if (edges.cornerbottomleft && hits.top && hits.right && !hits.cornertopright) 
      newTextureId = getTextureID(edges.cornerbottomleft, sheet);

    this.textureId = newTextureId;
  }

  render() {
    if (!this.sprite) {
      if (!this.texture) {
        const { textureMap, textureId } = this;
        this.texture = textureMap.getTexture(textureId);
      }
      this.sprite = LAYERS['tile'].createSprite(this.texture, this.x, this.y);
    }
  }
}