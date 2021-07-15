import EntityScript from '../entity-script';

import { PREFORM_ACTION_RESULT } from '../../actions/base-action';
import CutAction from '../../actions/cut-action';
import GoToAction from '../../actions/goto-action';
import HarvestAction from '../../actions/havest-action';
import IdleAction from '../../actions/idle-action';
import WalkAction from '../../actions/walk-action';

const isCloser = (self, currentClosest, checkEntity) => {
  const difCurX = Math.abs(self.x - currentClosest.x);
  const difCurY = Math.abs(self.y - currentClosest.y);
  const difCheckX = Math.abs(self.x - checkEntity.x);
  const difCheckY = Math.abs(self.y - checkEntity.y);
  return difCurX*difCurX + difCurY*difCurY > difCheckX*difCheckX + difCheckY*difCheckY;
};

export default class AiSim extends EntityScript {
  start(target) {
    this.dontTargetList = [];
  }

  findTarget(target, map, entities, targetID) {
    let currentClosest = null;
    for (let i =0; i<entities.length; i++) {
      const checkEntity = entities[i];
      if (checkEntity._remove) continue;
      if (checkEntity.data.id === targetID) {
        if (this.dontTargetList.some(e => e === checkEntity))
          continue;
        if (!map.findRandomCloseEmptyTile(checkEntity.x, checkEntity.y))
          continue;
        if (!currentClosest) {
          currentClosest = checkEntity;
        } else {
          if (isCloser(target, currentClosest, checkEntity)) {
            currentClosest = checkEntity;
          }
        }
      }
    }
    return currentClosest;
  }

  update(target, map, entities) {
    if (target.lastActionResult === PREFORM_ACTION_RESULT.FINISHED_FAIL) {
      if (target.lastAction.target) {
        this.dontTargetList.push(target.lastAction.target);
      }
      target.lastAction = null;
      target.lastActionResult = null;
    }
    let targetEntity = this.findTarget(target, map, entities, 'tree')
    if (!targetEntity || targetEntity === target) return new IdleAction();
    return new CutAction(targetEntity);
  }

  end(target, map, entities) {

  }
}