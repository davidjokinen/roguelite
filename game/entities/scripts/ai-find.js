import EntityScript from '../entity-script';
import { createCooldown } from '../../utils';

export default class AiWander extends EntityScript {
  start(target) {
    this.inputCooldown = createCooldown(target.movingTime);
    this.path = null;
    this.pathWorker = null;
  }

  update(target, map, entities) {
    if (this.inputCooldown.check()) return;
    if (this.pathWorker) {
      if (this.pathWorker.done) {
        this.path = this.pathWorker.path;
        if (this.path) {
          this.path.splice(0, 1);
        }
        this.pathWorker = null
      }
      return;
    }
    if (this.path === null) {
      let goToEntity = entities[~~(entities.length*Math.random())];
      if (goToEntity === target) return;
      const gotoTile = map.findEmptyTile(goToEntity.x, goToEntity.y);
      if (!gotoTile) return;
      this.pathWorker  = map.findPath(target.x, target.y, gotoTile.x, gotoTile.y);
      return;
    } else {
      if (!this.path) return;
      const nextTile = this.path[0];
      this.path.splice(0, 1);
      if (this.path.length === 0) {
        this.path = null;
      }
      // console.log('Moving to: ', nextTile.x, nextTile.y)
      target.move(nextTile);
      this.inputCooldown.reset();
    }
  }

  end(target, map, entities) {
    delete this.inputCooldown;
  }
}