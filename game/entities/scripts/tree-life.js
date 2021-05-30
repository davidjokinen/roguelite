import EntityScript from '../entity-script';
import { createCooldown } from '../../utils';

import { getConfig } from '../get-config';

export default class TreeLife extends EntityScript {
  start(target) {
    this.inputCooldown = createCooldown(5000);
  }

  update(target, map, entities) {
    if (this.inputCooldown.check()) return;

    const grow = false;
    const die = false;
    const repopulate = false;
    // TODO replace with growing system that checks map and stuff
    if (Math.random() > .95)
      grow = true;
    else if (Math.random() > .99)
      die = true;
    else if (Math.random() > .99)
      repopulate = true;

    if (grow) {
      if (target.type === 'small-tree') {
        target.type = 'tree';
        target.
      }
    } else if (die) {
      target.remove();
    } else if (repopulate) {

    }
    this.inputCooldown.reset();
  }

  end(target, map, entities) {
    delete this.inputCooldown;
  }
}