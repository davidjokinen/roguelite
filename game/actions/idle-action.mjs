import { Action, PREFORM_ACTION_RESULT } from './base-action.mjs';
import { getRandomInt } from '../core/utils.mjs';
import GoToAction from './goto-action.mjs';

export default class IdleAction extends Action {
  constructor() {
    super();
    this.id = 'idle';
    this.idleTime = null;
    this.idleWait = null;
    this.actionName = {
      presentTense: 'chilling',
      default: 'chill'
    };
  }

  perform(entity, map, entities) {
    if (this.performSubAction(entity, map, entities))
      return PREFORM_ACTION_RESULT.ACTIVE;
    if (this.cancelled)
      return PREFORM_ACTION_RESULT.CANCELLED;
    if (!this.idleTime) {
      if (this.idleWait) {
        let tile = map.findRandomCloseEmptyTile(entity.x, entity.y);
        if (!tile)
          return PREFORM_ACTION_RESULT.CANCELLED;
        // this.subAction = new GoToAction(tile);
        this.setSubAction(entity, new GoToAction(tile));
      }
      
      this.idleTime = GameTime.now();
      const randomInt = getRandomInt(5000);
      this.idleWait = 5000 + randomInt;
      return PREFORM_ACTION_RESULT.ACTIVE;
    }
    if (this.idleTime + this.idleWait < GameTime.now()) {
      if (Math.random() > .66)
        return PREFORM_ACTION_RESULT.CANCELLED;
      this.idleTime = null;
      return PREFORM_ACTION_RESULT.ACTIVE;
    }
    return PREFORM_ACTION_RESULT.ACTIVE;
  }

}