import Entity from './entity.mjs';

import EntityGraphic from '../graphics/entity-graphic.js';
import getScript from './get-script-client.mjs';

export default class EntityClient extends Entity {
  constructor() {
    super(...arguments);

    this.graphic = new EntityGraphic(this);
  }

  get getScript() {
    return getScript;
  }

  updateType(newType) {
    super.updateType(newType);

    this.graphic.checkTextureData();
    this.graphic.updateTextures = true;
  }

  checkEdges(map) {
    this.graphic.checkEdges(map, map.entities);
  }

  render() {
    this.graphic.render();
    this.renderUpdate = false;
  }

}