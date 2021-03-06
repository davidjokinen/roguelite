import EntityScript from '../entity-script.mjs';

import GoToAction from '../../actions/goto-action.mjs';

import { getRandomInt } from '../../core/utils.mjs';

export default class AiWander extends EntityScript {
  start(target) {
    
  }

  update(target, map, entities) {
    if (entities.length === 0) return;
    const randomInt = getRandomInt(entities.length);
    let goToEntity = entities[randomInt];
    if (goToEntity === target) return;
    const gotoTile = map.findEmptyTile(goToEntity.x, goToEntity.y);
    return new GoToAction(gotoTile);
  }

  end(target, map, entities) {

  }
}