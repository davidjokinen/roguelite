import Entity from '../entity';
import EntityScript from '../entity-script';

import { PREFORM_ACTION_RESULT } from '../../actions/base-action';
import ChopAction from '../../actions/chop-action';
import CutAction from '../../actions/cut-action';
import MineAction from '../../actions/mine-action';
import GoToAction from '../../actions/goto-action';
import HarvestAction from '../../actions/havest-action';
import IdleAction from '../../actions/idle-action';
import WalkAction from '../../actions/walk-action';
import EatAction from '../../actions/eat-action';

import { getRandomInt } from '../../core/utils';

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

  findTarget(target, map, entities, targetIDs) {
    let currentClosest = null;
    for (let targetIdIndex=0; targetIdIndex<targetIDs.length; targetIdIndex++) {
      const targetID = targetIDs[targetIdIndex];
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
    }
    return currentClosest;
  }

  tryAction(action, target, map, entities) {
    const targetEntities = Entity.viewEntitiesWithAction(action);
    if (targetEntities.length === 0) return;
    const actionMap = {
      mine: MineAction,
      chop: ChopAction,
      cut: CutAction,
      harvest: HarvestAction,
      eat: EatAction,
    };
    let targetEntity = this.findTarget(target, map, entities, targetEntities);
    if (!targetEntity || targetEntity === target) return;
    if (!(action in actionMap)) return;
    return new actionMap[action](targetEntity);
  }

  update(target, map, entities) {
    if (target.lastActionResult === PREFORM_ACTION_RESULT.FINISHED_FAIL) {
      if (target.lastAction.target) {
        this.dontTargetList.push(target.lastAction.target);
      }
      target.lastAction = null;
      target.lastActionResult = null;
    }
    let action = null;
    const actions = ['chop', 'chop', 'chop', 'harvest', 'eat', 'cut', 'mine'];
    const randomInt = getRandomInt(actions.length);
    const randomAction = actions[randomInt];
    action = this.tryAction(randomAction, target, map, entities);
    if (!action) return new IdleAction();
    return action;
  }

  end(target, map, entities) {

  }
}