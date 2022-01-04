import EntityScript from '../entity-script.mjs';
import { createCooldown } from '../../core/utils.mjs';

import WalkAction from '../../actions/walk-action.mjs';

export default class ServerPlayerControl extends EntityScript {
  start(target) {
    this.inputCooldown = createCooldown(target.movingTime);
  }

  update(target, map, entities) {
    if (this.inputCooldown.check()) return;

    let moveX = 0;
    let moveY = 0;
    if (target.MOVE_UP)
      moveY += 1;
    if (target.MOVE_DOWN)
      moveY -= 1;
    if (target.MOVE_LEFT)
      moveX -= 1;
    if (target.MOVE_RIGHT)
      moveX += 1;

    if (moveX == 0 && moveY == 0)
      return;
    
    // replace when entites are stored in map
    let clearSpot = true;
    let newX = target.x + moveX;
    let newY = target.y + moveY;
    const tile = map.getTile(newX, newY);
    // console.log(tile.entities.map(e => e.id))
    // console.log(target.id)
    if (tile) {
      if (!tile.walkable) {
        clearSpot = false;
      }
      tile.entities.forEach(entity => {
        if (!entity.walkable) {
          clearSpot = false;
        }
      });
    }

    if (!clearSpot || !tile) return;
    this.inputCooldown.reset();
    return new WalkAction(moveX, moveY);
  }

  end(target, map, entities) {
    delete this.inputCooldown;
  }
}