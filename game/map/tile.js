import { getConfig } from '../tiles/get-tile';

import { LAYERS } from '../graphics/resources.js';

import { getEdgesTextureID, newEdgeHits, getEdgeData, getTextureData } from '../entities/entity-common';

export default class Tile {
  constructor(type, x, y) {
    this.type = type;
    this.x = x;
    this.y = y;
    this.id = `${x}_${y}`
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
      return;
    }

    this.walkable = data.walkable;

    const textureData = getTextureData(data);

    this.textureMap = textureData.targetTextureMap;
    this.textureId = textureData.targetTextureId;
    if (this.sprite) {
      const newTexture = this.textureMap.getTexture(this.textureId);
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

  findEntities(search) {
    // Example search: 
    // * {action: 'chop'}
    search = search || {};
    return this.entities.filter(entity => {
      let keepEntity = true;
      if (search.action) {
        if (!entity.data.actions || !(search.action in entity.data.actions))
          keepEntity = false;
      }
      return keepEntity;
    });
  }

  checkEntities(search) {
    return this.findEntities(search).length > 0;
  }

  isWalkable(self) {
    if (this.type === 'water') return false;
    for (let i=0;i<this.entities.length;i++) {
      const entity = this.entities[i];
      if (entity === self) continue;
      if (!entity.walkable)
        return false;
    }
    return true;
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