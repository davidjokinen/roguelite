import { LAYERS, SHEETS } from '../graphics/resources.mjs';
import BaseService from './base-service';

class ActionBlueprint {
  constructor(entity, action) {
    this.entity = entity;
    this.action = action;

    this.sprite = null;
    this.init();
  }

  init() {
    const { x, y } = this.entity;
    const texture = SHEETS['colors'].getTexture(0); 
    this.sprite = LAYERS['overlay'].createSprite(texture, x, y);
  }

  remove() {
    this.sprite.remove();
  }
}

export default class ActionQueue extends BaseService {
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
    this.workList.push(new ActionBlueprint(entity, action));
  }

  getWork(entity) {
    return this.workList.shift();
  }

  update() {

  }

}