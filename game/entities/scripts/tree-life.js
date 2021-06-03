import EntityScript from '../entity-script';
import { createCooldown } from '../../utils';

import Entity from '../../entity';

export default class TreeLife extends EntityScript {
  start(target) {
    this.inputCooldown = createCooldown(1000);
  }

  update(target, map, entities) {
    return;
    if (this.inputCooldown.check()) return;

    let grow = false;
    let die = false;
    let repopulate = false;
    // TODO replace with growing system that checks map and stuff
    if (Math.random() > .95)
      grow = true;
    else if (Math.random() > .99)
      die = true;
    if (target.data.id === 'dead-tree') {
      if (Math.random() > .8)
        die = true;
    }
    if (target.data.id === 'tree') {
      if (Math.random() > .99)
        repopulate = true;
    }

    if (grow) {
      if (target.data.id === 'small-tree') {
        target.updateType('tree');
      }
      // if (target.data.id === 'tree') {
      //   target.updateType('small-tree');
      // }
    } else if (die) {
      if (target.data.id === 'small-tree') {
        target.updateType('small-dead-tree');
      } else if (target.data.id === 'tree') {
        target.updateType('dead-tree');
      } else {
        target.remove();
      }
    } else if (repopulate) {
      const tile = map.findEmptyTile(target.x, target.y);
      entities.push(new Entity('small-tree', tile.x, tile.y));
    }
    this.inputCooldown.reset();
  }

  end(target, map, entities) {
    delete this.inputCooldown;
  }
}