import Keyboard from '../../keyboard';
import EntityScript from '../entity-script';
import { createCooldown } from '../../utils';

export default class PlayerControl extends EntityScript {
  start(target) {
    this.inputCooldown = createCooldown(target.movingTime);
  }

  update(target, map, entities) {
    if (this.inputCooldown.check()) return;

    const keyboard = Keyboard.getKeyboard();
    const KEY_W = 87;
    const KEY_S = 83;
    const KEY_A = 65;
    const KEY_D = 68;
    let moveX = 0;
    let moveY = 0;
    if (keyboard.key[KEY_W])
      moveY += 1;
    if (keyboard.key[KEY_S])
      moveY -= 1;
    if (keyboard.key[KEY_D])
      moveX += 1;
    if (keyboard.key[KEY_A])
      moveX -= 1;

    if (moveX == 0 && moveY == 0)
      return;
    
    // replace when entites are stored in map
    let clearSpot = true;
    let newX = target.x + moveX;
    let newY = target.y + moveY;
    entities.forEach(entity => {
      if (entity === target) return;
      if (entity.x === newX && entity.y === newY && !entity.walkable) {
        clearSpot = false;
      }
    });

    if (!clearSpot) return;

    target.move(moveX, moveY);
    this.inputCooldown.reset();
  }

  end(target, map, entities) {
    delete this.inputCooldown;
  }
}