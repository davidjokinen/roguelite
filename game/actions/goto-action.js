import { Action, PREFORM_ACTION_RESULT } from './base-action';
import WalkAction from './walk-action';

export default class GoToAction extends Action {
  constructor(gotoTile) {
    super();
    this.id = 'goto';
    this.actionName = {
      presentTense: 'walking',
      default: 'walk'
    };
    this.gotoTile = gotoTile;

    this.path = null;
    this.pathWorker = null;
  }

  initGoTo(entity, map, entities) {
    const { gotoTile } = this;
    if (!gotoTile) return PREFORM_ACTION_RESULT.FINISHED_FAIL;
    this.pathWorker = map.findPath(entity.x, entity.y, gotoTile.x, gotoTile.y);
    return PREFORM_ACTION_RESULT.ACTIVE;
  }

  waitForPathWorker() {
    if (this.pathWorker.done) {
      this.path = this.pathWorker.path;
      if (this.path) {
        this.path.splice(0, 1);
      } else
        return PREFORM_ACTION_RESULT.FINISHED_FAIL;
      this.pathWorker = null
    }
    return PREFORM_ACTION_RESULT.ACTIVE;
  }

  perform(entity, map, entities) {
    if (this.performSubAction(entity, map, entities))
      return PREFORM_ACTION_RESULT.ACTIVE;
    if (this.cancelled)
      return PREFORM_ACTION_RESULT.CANCELLED;
    if (this.pathWorker)
      return this.waitForPathWorker();
    if (this.path === null)
      return this.initGoTo(entity, map, entities);
    if (this.path.length === 0) {
      let tile = map.getTile(entity.x, entity.y)
      if (!tile.isWalkable(entity)) {
        this.path = null;
        let tile = map.findRandomCloseEmptyTile(entity.x, entity.y);
        if (!tile) return PREFORM_ACTION_RESULT.FINISHED_FAIL;
        this.gotoTile = tile;
        return PREFORM_ACTION_RESULT.ACTIVE;
      } else {
        return PREFORM_ACTION_RESULT.FINISHED_SUCCESS;
      }
    }
      
    const nextTile = this.path[0];
    this.path.splice(0, 1);
    // TODO replace check
    if (!nextTile.isWalkable(entity)) {
      this.path = null;
      return PREFORM_ACTION_RESULT.ACTIVE;
    }
    // console.log('Moving to: ', nextTile.x, nextTile.y)
    this.subAction = new WalkAction(nextTile);
    return PREFORM_ACTION_RESULT.ACTIVE;
  }
}