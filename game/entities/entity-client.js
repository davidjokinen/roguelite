import Entity from './entity.mjs';

import EntityGraphic from '../graphics/entity-graphic.js';

class EntityClient extends Entity {
  constructor() {
    super();

    this.renderUpdate = true;
    this.graphic = new EntityGraphic(this);
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