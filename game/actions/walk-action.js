import { Action, PREFORM_ACTION_RESULT } from './base-action.mjs';

export default class WalkAction extends Action {
  constructor(moveToX, moveToY) {
    super();
    this.id = 'walk';
    this.actionName = {
      presentTense: 'walking',
      default: 'walk'
    };
    this.moveToX = moveToX;
    this.moveToY = moveToY;
    this.moving = false;
    this.movingStart = 0;
    this.lastX = 0;
    this.lastY = 0;
  }

  initMove(entity) {
    if (this.moveToY === undefined) {
      const tile = this.moveToX;
      this.moveToX = tile.x - entity.x;
      this.moveToY = tile.y - entity.y;
    }
    this.moving = true;
    this.movingStart = GameTime.now(); // Date.now();
    this.lastX = entity.x;
    this.lastY = entity.y;
    this.x = entity.x + this.moveToX;
    this.y = entity.y + this.moveToY;
    entity.x = this.x;
    entity.y = this.y;
    entity._onChangePosition();
  }

  perform(entity, map, entities) {
    if (!this.moving) {
      this.initMove(entity);
    } 
    const now = GameTime.now();
    if (now >= this.movingStart + entity.movingTime) {
      
      if (entity.sprite)
        entity.sprite.updatePosition(this.x, this.y);
      return PREFORM_ACTION_RESULT.FINISHED_SUCCESS;
    } else {
      const delta = (now - this.movingStart)/entity.movingTime;
      const iDelta = 1-delta;
      const moveX = this.x*delta + this.lastX*iDelta;
      const moveY = this.y*delta + this.lastY*iDelta;
      if (entity.sprite)
        entity.sprite.updatePosition(moveX, moveY);
    }
    return PREFORM_ACTION_RESULT.ACTIVE;
  }

}