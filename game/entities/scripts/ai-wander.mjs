import EntityScript from '../entity-script';
import { createCooldown } from '../../utils';

import WalkAction from '../../actions/walk-action';

export default class AiWander extends EntityScript {
  start(target) {
    this.inputCooldown = createCooldown(target.movingTime);
  }

  update(target, map, entities) {
    if (this.inputCooldown.check()) return;

    let moveX = 0;
    let moveY = 0;
    if (Math.random() > .95)
      moveY += 1;
    if (Math.random() > .95)
      moveY -= 1;
    if (Math.random() > .95)
      moveX += 1;
    if (Math.random() > .95)
      moveX -= 1;

    

    if (moveX != 0 || moveY != 0) {
      let clearSpot = true;
      let newX = target.x + moveX;
      let newY = target.y + moveY;
      const tile = map.getTile(newX, newY);
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

      if (!clearSpot || !tile) {
        return;
      }
      // target.move(moveX, moveY);
      this.inputCooldown.updateTimeout(1000 + 5000 * Math.random());
      this.inputCooldown.reset();
      return new WalkAction(moveX, moveY);
      
    } 
  }

  end(target, map, entities) {
    delete this.inputCooldown;
  }
}