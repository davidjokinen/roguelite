import { LAYERS, SHEETS } from '../graphics/resources.mjs';
import { ActionBlueprint } from './action-queue.mjs'

class ActionBlueprintClient extends ActionBlueprint {

  init() {
    const { x, y } = this.entity;
    const texture = SHEETS['colors'].getTexture(0); 
    this.sprite = LAYERS['overlay'].createSprite(texture, x, y);
  }

  remove() {
    this.sprite.remove();
  }
}

import ActionQueue from './action-queue.mjs'

export default class ActionQueueClient extends ActionQueue {
  constructor() {
    super();
    this.id = 'action-queue';

    this.workList = [];
  }

  init() {

  }

  remove() {

  }

  addWork(entity, action) {
    this.workList.push(new ActionBlueprintClient(entity, action));
  }

  getWork(entity) {
    return this.workList.shift();
  }

  update() {

  }

}