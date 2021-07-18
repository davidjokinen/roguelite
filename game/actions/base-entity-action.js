import { Action, PREFORM_ACTION_RESULT } from './base-action';
import GoToAction from './goto-action';
import Entity from '../entities/entity';

import { checkIfNotNextToTarget } from './action-utils';

const globalTargeting = {};

export default class BaseEntityAction extends Action {
  constructor(target) {
    super();
    this.id = 'base-entity-action';
    this.target = target;
    this.cuttingTime = null;
  }

  perform(entity, map, entities) {
    if (!globalTargeting[this.target.id])
      globalTargeting[this.target.id] = entity;
    if (globalTargeting[this.target.id] !== entity)
      return PREFORM_ACTION_RESULT.FINISHED_FAIL;
    if (this.target._remove)
      return PREFORM_ACTION_RESULT.CANCELLED;
    if (this.performSubAction(entity, map, entities))
      return PREFORM_ACTION_RESULT.ACTIVE;
    if (this.subActionResult === PREFORM_ACTION_RESULT.FINISHED_FAIL) {
      return PREFORM_ACTION_RESULT.FINISHED_FAIL;
    }
    if (checkIfNotNextToTarget(entity, this.target)) {
      let tile = map.findRandomCloseEmptyTile(this.target.x, this.target.y);
      if (!tile) {
        return PREFORM_ACTION_RESULT.CANCELLED;
      }
      this.subAction = new GoToAction(tile);
      return PREFORM_ACTION_RESULT.ACTIVE;
    }
    if (!this.cuttingTime) {
      this.cuttingTime = GameTime.now();
      return PREFORM_ACTION_RESULT.ACTIVE;
    }
    if (this.cuttingTime + 5000 > GameTime.now()) {
      return PREFORM_ACTION_RESULT.ACTIVE;
    }
    return null;
    this.cuttingTime = null;
    this.target.remove();
    delete globalTargeting[this.target.id];
    map.addEntity(new Entity('wood-pile', this.target.x, this.target.y));
    return PREFORM_ACTION_RESULT.FINISHED_SUCCESS;
  }

  finally() {
    delete globalTargeting[this.target.id];
  } 

}