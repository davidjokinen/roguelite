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

  import(entity, data) {
    if (Math.abs(data.startX - entity.x) > 1)
      entity.x = data.startX;
    if (Math.abs(data.startY - entity.y) > 1)
      entity.y = data.startY;
    this.moveToX = (data.startX - entity.x) + data.endX;
    this.moveToY = (data.startY - entity.y) + data.endY;
    // entity._onChangePosition();
    entity.broadcast({
      topic: 'update.position',
      skipTileTrigger: false,
      mapChanged: false,
    });
    if (entity.sprite)
      entity.sprite.updatePosition(entity.x, entity.y);
  }

  export(entity) {
    let moveToX = this.moveToX;
    let moveToY = this.moveToY;
    // TODO: I hate this
    if (this.moveToY === undefined) {
      const tile = this.moveToX;
      moveToX = tile.x - entity.x;
      moveToY = tile.y - entity.y;
     
    }
    return {
      id: entity.id,
      mapID: entity.map.id,
      type: this.id,
      startX: entity.x,
      startY: entity.y,
      endX: moveToX,
      endY: moveToY,
    }
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
    // entity._onChangePosition();
    entity.broadcast({
      topic: 'update.position',
      skipTileTrigger: false,
      mapChanged: false,
    });
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