import BaseGraphic from './base-graphic';

import { LAYERS } from './resources.js';

import { getTextureID } from '../core/utils';
import { getEdgesTextureID, newEdgeHits, getEdgeData, getTextureData } from '../entities/entity-common';

export default class EntityGraphic extends BaseGraphic {
  constructor(entity) {
    super();
    this.entity = entity;

    // sprite 
    const { data } = entity;
    this.updateTextures = false;
    this.layer = data.layer === 'floor' ? LAYERS['entityFloor'] :  LAYERS['entity'];
    this.textureMap = null;
    this.textureId = null;
    this.topTargetTextureId = null;
    this.texture = null;
    this.sprite = null;
    this.topSprite = null;

    this.updateTopSprite = this.updateTopSprite.bind(this);

    this.checkTextureData();
  }

  init() {

  }

  checkEdges(map, entities) {
    const edges = getEdgeData(this);
    if (!edges) return;
    
    const hits = newEdgeHits();
    // Replace when map sorts entities
    entities.forEach(entity => {
      if (entity === this) return;
      if (!entity.data) return;
      if (entity.data.id !== this.data.id) return;
      const deltaX = this.entity.x - entity.x;
      const deltaY = this.entity.y - entity.y;
      if (Math.abs(deltaX) > 1 || Math.abs(deltaY) > 1 )
        return;
      if (deltaX === -1 && deltaY === 0) hits.right = true;
      if (deltaX === 1 && deltaY === 0) hits.left = true;
    });
    const sheet = this.data.sprite.sheet;
    this.textureId = getTextureID(this.data.sprite.default, sheet);
    this.textureId = getEdgesTextureID(sheet, edges, hits) || this.textureId;
    
    if (this.sprite) {
      this.texture = this.textureMap.getTexture(this.textureId);
      this.sprite.setTexture(this.texture);
    }
  }

  checkTextureData() {
    const data = this.entity.data || {};
    const textureData = getTextureData(data);

    this.textureId = textureData.targetTextureId;
    this.textureMap = textureData.targetTextureMap;
    if (textureData.topTargetTextureId) {
      this.topTargetTextureId = textureData.topTargetTextureId;
    } else {
      this.topTargetTextureId = null;
    }
  }

  remove() {
    if (this.sprite)
      this.sprite.remove();
    if (this.topSprite) 
      this.topSprite.remove();
  }

  updateTopSprite(x, y) {
    if (this.topSprite) {
      this.topSprite.updatePosition(x, y+1);
    }
  }

  render() {
    if (!this.sprite || this.updateTextures) {
      if (!this.texture || this.updateTextures) {
        const { textureMap, textureId } = this;
        this.texture = textureMap.getTexture(textureId);
      }
      if (!this.sprite) {
        this.sprite = this.layer.createSprite(this.texture, this.entity.x, this.entity.y);
        this.entity.sprite = this.sprite;
      } else 
        this.sprite.setTexture(this.texture);
      
      if (this.topTargetTextureId) {
        const { textureMap, topTargetTextureId } = this;
        this.sprite.addOnPositionChange(this.updateTopSprite);
        if (this.topSprite) {
          this.topSprite.setTexture(textureMap.getTexture(topTargetTextureId));
        } else {
          this.topSprite = LAYERS['entityTops'].createSprite(
            textureMap.getTexture(topTargetTextureId), 
            this.entity.x, this.entity.y+1);
          this.entity.topSprite = this.topSprite;
        }
      } else {
        if (this.topSprite) {
          this.topSprite.remove();
          this.topSprite = null;
          this.entity.topSprite = this.topSprite;
        }
      }
      this.updateTextures = false;
    }
  }
}