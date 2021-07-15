import { Action, PREFORM_ACTION_RESULT } from './base-action';
import GoToAction from './goto-action';

export default class IdleAction extends Action {
  constructor() {
    super();
    this.id = 'idle';
    this.idleTime = null;
    this.idleWait = null;
  }

  perform(entity, map, entities) {
    if (this.performSubAction(entity, map, entities))
      return PREFORM_ACTION_RESULT.ACTIVE;
    if (!this.idleTime) {
      if (this.idleWait) {
        let tile = map.findRandomCloseEmptyTile(entity.x, entity.y);
        if (!tile)
          return PREFORM_ACTION_RESULT.CANCELLED;
        this.subAction = new GoToAction(tile);
      }
      this.idleTime = GameTime.now();
      this.idleWait = 5000 + ~~(5000*Math.random());
      return PREFORM_ACTION_RESULT.ACTIVE;
    }
    if (this.idleTime + this.idleWait < GameTime.now()) {
      this.idleTime = null;
      return PREFORM_ACTION_RESULT.ACTIVE;
    }
    return PREFORM_ACTION_RESULT.ACTIVE;
  }

}