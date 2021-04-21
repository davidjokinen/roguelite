import EntityScript from '../entity-script';
import { createCooldown } from '../../utils';

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
      target.move(moveX, moveY);
      this.inputCooldown.updateTimeout(1000 + 5000 * Math.random());
      this.inputCooldown.reset();
    } 
  }

  end(target, map, entities) {
    delete this.inputCooldown;
  }
}