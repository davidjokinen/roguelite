import Map from  './map.mjs';
import Tile from  './tile.mjs';
import { LAYERS } from '../graphics/resources.mjs';

import { getEdgesTextureID, newEdgeHits, getEdgeData, getTextureData } from '../entities/entity-common.mjs';

export class ClientMap extends Map {

  newTile() {
    return new ClientTile(...arguments);
  }
}

export class ClientTile extends Tile {

  updateType(type) {
    const data = super.updateType(type);

    const textureData = getTextureData(data);

    this.textureMap = textureData.targetTextureMap;
    this.textureId = textureData.targetTextureId;
    if (this.sprite) {
      const newTexture = this.textureMap.getTexture(this.textureId);
      this.texture = newTexture;
      this.sprite.setTexture(newTexture);
    }
  }

  checkEdges(map) {
    const edges = getEdgeData(this);
    if (!edges) return;
    const { type, x, y } = this;
    const hits = newEdgeHits();
    const textureData = getTextureData(this.data);
    const defaultTextureId = textureData.targetTextureId;
    
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
    this.textureId = getEdgesTextureID(sheet, edges, hits) || defaultTextureId;
    
    if (this.sprite) {
      const newTexture = this.textureMap.getTexture(this.textureId);
      this.texture = newTexture;
      this.sprite.setTexture(newTexture);
    }
  }

  render() {
   
    if (!this.sprite) {
      // const { LAYERS } = require('../graphics/resources.mjs');
      // 
      if (!this.texture) {
        const { textureMap, textureId } = this;
        this.texture = textureMap.getTexture(textureId);
      }
      this.sprite = LAYERS['tile'].createSprite(this.texture, this.x, this.y);
    }
  }

  remove() {
    if (this.sprite) {
      this.sprite.remove();
      this.sprite = null;
    }
  }
}