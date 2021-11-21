import Entity from '../entity.mjs';
import EntityScript from '../entity-script.mjs';

import { PREFORM_ACTION_RESULT } from '../../actions/base-action.mjs';
import ChopAction from '../../actions/chop-action.mjs';
import CutAction from '../../actions/cut-action.mjs';
import MineAction from '../../actions/mine-action.mjs';
import GoToAction from '../../actions/goto-action.mjs';
import HarvestAction from '../../actions/harvest-action.mjs';
import IdleAction from '../../actions/idle-action.mjs';
import WalkAction from '../../actions/walk-action.mjs';
import EatAction from '../../actions/eat-action.mjs';

import { getRandomInt } from '../../core/utils.mjs';


export default class SocketAiSim extends EntityScript {
  start(target) {
    this.dontTargetList = [];
  }

  update(target, map, entities) {
    return null;
    
  }

  end(target, map, entities) {

  }
}