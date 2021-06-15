import EntityScript from '../entity-script';

import GoToAction from '../../actions/goto-action';

export default class AiWander extends EntityScript {
  start(target) {
    
  }

  update(target, map, entities) {
    let goToEntity = entities[~~(entities.length*Math.random())];
    if (goToEntity === target) return;
    const gotoTile = map.findEmptyTile(goToEntity.x, goToEntity.y);
    return new GoToAction(gotoTile);
  }

  end(target, map, entities) {

  }
}