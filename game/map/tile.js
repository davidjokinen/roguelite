import { getConfig } from '../tiles/get-tile';

import { LAYERS } from '../resources.js';

import { getEdgesTextureID, newEdgeHits, getEdgeData, getTextureData } from '../entity-common';

export default class Tile {
  constructor(type, x, y) {
    this.type = type;
    this.x = x;
    this.y = y;
    this.data = null;

    this.entities = [];

    this.walkable = true;
    
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

    this.walkable = data.walkable;

    const textureData = getTextureData(data);

    this.textureMap = textureData.targetTextureMap;
    this.textureId = textureData.targetTextureId;
    if (this.sprite) {
      const newTexture = targetTextureMap.getTexture(targetTextureId);
      this.texture = newTexture;
      this.sprite.setTexture(newTexture);
    }
    this.type = type;
  }

  checkEdges(map) {
    const edges = getEdgeData(this);
    if (!edges) return;
    const { type, x, y } = this;
    const hits = newEdgeHits();
    
    let targetTile = map.getTile(x-1, y);
    if (targetTile && targetTile.type === type) hits.left = true;
    targetTile = map.getTile(x+1, y);
    if (targetTile && targetTile.type === type) hits.right = true;
    targetTile = map.getTile(x, y+1);
    if (targetTile && targetTile.type === type) hits.top = true;
    targetTile = map.getTile(x, y-1);
    if (targetTile && targetTile.type === type) hits.bottom = true;
    if (
      edges.cornertopleft ||
      edges.cornertopright ||
      edges.cornerbottomleft ||
      edges.cornerbottomright 
      ) {
      let targetTile = map.getTile(x-1, y+1);
      if (targetTile && targetTile.type === type) hits.cornertopleft = true;
      targetTile = map.getTile(x+1, y+1);
      if (targetTile && targetTile.type === type) hits.cornertopright = true;
      targetTile = map.getTile(x-1, y-1);
      if (targetTile && targetTile.type === type) hits.cornerbottomleft = true;
      targetTile = map.getTile(x+1, y-1);
      if (targetTile && targetTile.type === type) hits.cornerbottomright = true;
    }
    
    const sheet = this.data.sprite.sheet;
    this.textureId = getEdgesTextureID(sheet, edges, hits) || this.textureId;
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

  remove() {
    this.sprite.remove();
  }
}