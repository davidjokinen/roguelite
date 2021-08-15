import BaseService from './base-service';

import Mouse from '../core/mouse';

export default class EntitySelector extends BaseService {
  constructor(tileSelector, map) {
    super();
    this.id = 'entity-selector';
    this.tileSelector = tileSelector;
    this.map = map;

    this.selectedEntity = {
      active: true,
      entity: null,
    };

    this._onSelectedEntity = [];

    this.onMouseDown = this.onMouseDown.bind(this);
  }

  init() {
    const mouse = Mouse.getMouse();
    mouse.addOnClickDown(this.onMouseDown);
  }

  remove() {
    const mouse = Mouse.getMouse();
    mouse.removeOnClickDown(this.onMouseDown);
  }

  onMouseDown(onMouseDown) {
    if (onMouseDown.button !== 0)
      return;
    if (!this.selectedEntity.active)
      return;
    const {
      x,
      y
    } = this.tileSelector.cursorPoint;
    const tile = this.map.getTile(x, y);
    if (!tile) return;
    if (tile.entities.length === 0) {
      this.selectedEntity.entity = null;
      this._onSelectedEntity.forEach(callback => callback(null));
      return;
    }

    const entity = tile.entities[0];
    let updateEntity = entity != this.selectedEntity.entity;
    if (updateEntity) {
      this.selectedEntity.entity = entity;
      this._onSelectedEntity.forEach(callback => callback(entity));
    }
  }

  addOnSelectedEntity(event) {
    return this._onSelectedEntity.push(event);
  }

  removeOnSelectedEntity(event) {
    const index = this._onSelectedEntity.indexOf(event);
		if (index < -1) return;
		this._onSelectedEntity.splice(index, 1); 
  }
}