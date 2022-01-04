import GameWorld from "./game-world.mjs";

import Entity from '../entities/entity-client.js';

export default class ClientGameWorld extends GameWorld {

  getEntityClass() {
    return Entity;
  }

  setMapFocus(mapID, x, y) {
    const oldFocusMap = this.getMapFocus();
    super.setMapFocus(mapID, x, y);
    const newFocusMap = this.getMapFocus();
    if (oldFocusMap && oldFocusMap !== newFocusMap) {
      oldFocusMap.remove();
      // this.removeMap(oldFocusMap);
    }
  }
}