import BaseService from './base-service';

import Mouse from '../core/mouse';
import GoToAction from '../actions/goto-action';
import ChopAction from '../actions/chop-action';
import MineAction from '../actions/mine-action';
import CutAction from '../actions/cut-action';
import EatAction from '../actions/eat-action';
import HarvestAction from '../actions/harvest-action';

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
    this.onMouseUp = this.onMouseUp.bind(this);
  }

  init() {
    const mouse = Mouse.getMouse();
    mouse.addOnClickDown(this.onMouseDown);
    mouse.addOnClickUp(this.onMouseUp);
  }

  remove() {
    const mouse = Mouse.getMouse();
    mouse.removeOnClickDown(this.onMouseDown);
    mouse.removeOnClickUp(this.onMouseUp);
  }

  giveEntityAction(entity, tile) {
    let selectedAction = null;
    const checkAction = (action) => {
      const ACTION_MAP = {
        mine: MineAction,
        chop: ChopAction,
        cut: CutAction,
        harvest: HarvestAction,
        eat: EatAction,
      };
      if (selectedAction) return;
      const [ searchEntity ] = tile.findEntities({action: action});
      if (!selectedAction && searchEntity) {
        selectedAction = new ACTION_MAP[action](searchEntity);
      }
    } 
    checkAction('chop');
    checkAction('cut');
    checkAction('eat');
    checkAction('harvest');
    checkAction('mine');
    if (!selectedAction) selectedAction = new GoToAction(tile);
    entity.queueAction(selectedAction);
  }

  onMouseUp(event) {
    if (event.button === 0) return;
    const { x, y } = this.tileSelector.cursorPoint;
    const ACTION_TIME_WINDOW = 250;
    if (Date.now() - this.actionTimer < ACTION_TIME_WINDOW) {
      const tile = this.map.getTile(x, y);
      if (!tile) return;
      if (this.selectedEntity.entity)
        this.giveEntityAction(this.selectedEntity.entity, tile);
    }
  }

  onMouseDown(event) {
    const {
      x,
      y
    } = this.tileSelector.cursorPoint;
    if (event.button !== 0) {
      this.actionTimer = Date.now();
      return;
    }
    if (!this.selectedEntity.active)
      return;
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