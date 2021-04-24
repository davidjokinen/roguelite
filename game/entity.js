import { createStats } from './stats';
import { createBag } from './bag';

import getScript from './entities/get-script';
import { getConfig } from './entities/get-config';

import { LAYERS, SHEETS } from './resources.js';

import { getTextureID } from './utils';


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

    this.walkable = data.walkable || false;
    this.movingTime = 100;
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
    let targetTextureMap = SHEETS['roguelikeChar'];
    let targetTextureId = 324;
    let topTargetTextureId = null;
    if (data.sprite) {
      if (data.sprite.sheet !== undefined && data.sprite.sheet in SHEETS)
        targetTextureMap = SHEETS[data.sprite.sheet];
      const newTargetTextureId = getTextureID(data.sprite.default, data.sprite.sheet)
      if (newTargetTextureId)
        targetTextureId = newTargetTextureId;
      if (data.sprite.top) {
        topTargetTextureId = getTextureID(data.sprite.top, data.sprite.sheet)
      }
    }
    this.topSprite = null; 
    this.sprite = LAYERS['entity'].createSprite(
      targetTextureMap.getTexture(targetTextureId), 
      this.x, this.y);

    if (topTargetTextureId) {
      this.topSprite = LAYERS['entityTops'].createSprite(
        targetTextureMap.getTexture(topTargetTextureId), 
        this.x, this.y+1);
    }
  }

  update(map, entities) {
    if (this.script) {
      this.script.update(this, map, entities)
    }
    // Moving animation
    if (this.moving) {
      const now = Date.now();
      if (now >= this.movingStart + this.movingTime) {
        this.sprite.updatePosition(this.x, this.y);
        this.moving = false;
      } else {
        const delta = (now - this.movingStart)/this.movingTime;
        const iDelta = 1-delta;
        this.moveX = this.x*delta + this.lastX*iDelta;
        this.moveY = this.y*delta + this.lastY*iDelta;
        this.sprite.updatePosition(this.moveX, this.moveY);
      }
    }
  }

  checkEdges(map, entities) {
    // one day https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Optional_chaining
    if (!this.data) return;
    if (!this.data.sprite) return;
    if (!this.data.sprite.edges) return;
    const edges = this.data.sprite.edges;
    const hits = {
      right: false,
      left: false,
    };
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
    let newTextureId = getTextureID(this.data.sprite.default, sheet);
    if (edges.right && !hits.right && hits.left) 
      newTextureId = getTextureID(edges.right, sheet);
    if (edges.left && hits.right && !hits.left) 
      newTextureId = getTextureID(edges.left, sheet);
    const newTexture = SHEETS[sheet].getTexture(newTextureId);
    this.sprite.setTexture(newTexture);
  }

  render() {
    
  }

  move(x, y) {
    this.moving = true;
    this.movingStart = Date.now();
    this.lastX = this.x;
    this.lastY = this.y;
    this.x += x;
    this.y += y;
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
}