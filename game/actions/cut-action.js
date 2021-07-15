import { Action, PREFORM_ACTION_RESULT } from './base-action';
import GoToAction from './goto-action';
import Entity from '../entities/entity';

const globalTargeting = {};

export default class CutAction extends Action {
  constructor(target) {
    super();
    this.id = 'cut';
    this.target = target;
    this.cuttingTime = null;
  }

  checkIfNotNextToTarget(self) {
    const difX = Math.abs(self.x-this.target.x);
    const difY = Math.abs(self.y-this.target.y);
    // console.log(self, this.target, difX, difY)
    return difX > 1 || difY > 1;
  }

  perform(entity, map, entities) {
    // if (!globalTargeting[this.target])
    //   globalTargeting[this.target] = entity;
    // if (globalTargeting[this.target] !== entity)
    //   return PREFORM_ACTION_RESULT.CANCELLED;
    if (this.target._remove)
      return PREFORM_ACTION_RESULT.CANCELLED;
    if (this.performSubAction(entity, map, entities))
      return PREFORM_ACTION_RESULT.ACTIVE;
    if (this.subActionResult === PREFORM_ACTION_RESULT.FINISHED_FAIL)
      return PREFORM_ACTION_RESULT.FINISHED_FAIL;
      
    if (this.checkIfNotNextToTarget(entity)) {
      let tile = map.findRandomCloseEmptyTile(this.target.x, this.target.y);
      if (!tile)
        return PREFORM_ACTION_RESULT.CANCELLED;
      this.subAction = new GoToAction(tile);
      return PREFORM_ACTION_RESULT.ACTIVE;
    }
    if (!this.cuttingTime) {
      this.cuttingTime = GameTime.now();
      return PREFORM_ACTION_RESULT.ACTIVE;
    }
    if (this.cuttingTime + 1000 > GameTime.now()) {
      return PREFORM_ACTION_RESULT.ACTIVE;
    }
    this.cuttingTime = null;
    this.target.remove();
    map.addEntity(new Entity('wood-pile', this.target.x, this.target.y));
    return PREFORM_ACTION_RESULT.FINISHED_SUCCESS;
  }

}