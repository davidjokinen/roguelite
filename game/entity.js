import { createStats } from './stats';
import { createBag } from './bag';

import getScript from './entities/get-script';
import { getConfig } from './entities/get-config';

import { LAYERS } from './resources.js';

import { getTextureID } from './utils';
import { getEdgesTextureID, newEdgeHits, getEdgeData, getTextureData } from './entity-common';

import Map from './map/map';

export default class Entity {
  constructor(data, x, y) {
    this.data = null;
    if (!y) {
      y = x;
      x = data;
      data = {};
    } else {
      if (typeof data === 'string') {
        data = getConfig(data);
      }
      this.data = data;
    }
    // id

    // pos 
    this.x = x;
    this.y = y;
    this._curTile = null;

    this.walkable = data.walkable || false;
    this.movingTime = 100
    // cur image/animation
    // status

    this.stats = createStats(data.stats);
    this.bag = createBag(data.bag);

    // script?
    this.script = null;
    if (data.script) {
      if (data.script.main) {
        const scriptClass = getScript(data.script.main);
        this.script = new scriptClass();
        this.script.start(this);
      }
    }

    // sprite 
    this.layer = data.layer === 'floor' ? LAYERS['entityFloor'] :  LAYERS['entity'];
    this.textureMap = null;
    this.textureId = null;
    this.topTargetTextureId = null;
    this.texture = null;
    this.sprite = null;
    this.topSprite = null;

    this.checkTextureData();
    
    this._onChangePosition();
  }

  checkTextureData() {
    const data = this.data || {};
    const textureData = getTextureData(data);

    this.textureId = textureData.targetTextureId;
    this.textureMap = textureData.targetTextureMap;
    if (textureData.topTargetTextureId) {
      this.topTargetTextureId = textureData.topTargetTextureId;
    }
  }

  _onChangePosition() {
    const map = Map.getFocus();
    if (!map) return;
    const tile = map.getTile(~~this.x, ~~this.y);
    if (!tile) return;
    if (this._curTile) {
      this._curTile.entities.splice(this._curTile.entities.indexOf(this), 1);
    }
    this._curTile = tile;
    tile.entities.push(this);
  }

  update(map, entities) {
    if (this.script) {
      this.script.update(this, map, entities)
    }
    // Moving animation
    if (this.moving) {
      const now = Date.now();
      if (now >= this.movingStart + this.movingTime) {
        if (this.sprite)
          this.sprite.updatePosition(this.x, this.y);
        this.moving = false;
      } else {
        const delta = (now - this.movingStart)/this.movingTime;
        const iDelta = 1-delta;
        this.moveX = this.x*delta + this.lastX*iDelta;
        this.moveY = this.y*delta + this.lastY*iDelta;
        if (this.sprite)
          this.sprite.updatePosition(this.moveX, this.moveY);
      }
    }
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
      const deltaX = this.x - entity.x;
      const deltaY = this.y - entity.y;
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

  render() {
    if (!this.sprite) {
      if (!this.texture) {
        const { textureMap, textureId } = this;
        this.texture = textureMap.getTexture(textureId);
      }
      this.sprite = this.layer.createSprite(this.texture, this.x, this.y);
      if (this.topTargetTextureId) {
        const { textureMap, topTargetTextureId } = this;
        this.topSprite = LAYERS['entityTops'].createSprite(
          textureMap.getTexture(topTargetTextureId), 
          this.x, this.y+1);
      }
    }
  }

  move(x, y) {
    this.moving = true;
    this.movingStart = Date.now();
    this.lastX = this.x;
    this.lastY = this.y;
    this.x += x;
    this.y += y;
    this._onChangePosition();
  }

  attack(target) {
    if (!target.stats) return;
    // const attack = this.stats.getAttack();
    const rawAttack = this.stats.attack;
    const defense = target.stats.defense;
    const attack = rawAttack - defense;
    target.stats.health -= attack;
  }

  useItem(item) {

  }

  remove() {
    this.sprite.remove();
    if (this.topSprite) 
      this.topSprite.remove();
    this._remove = true;
  }
}