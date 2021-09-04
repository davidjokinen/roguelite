import { createStats } from './stats';
import { createBag } from '../items/bag';

import getScript from './get-script';
import { getConfig, actionToEntityMap, actionMap } from './get-config';

import EntityGraphic from '../graphics/entity-graphic.js';

import { PREFORM_ACTION_RESULT } from '../actions/base-action';

import Map from '../map/map';

let id = 0;

export default class Entity {
  constructor(data, x, y) {
    this.data = null;
    if (!y) {
      y = x;
      x = data;
      this.data = {};
    } else {
      if (typeof data === 'string') {
        data = getConfig(data);
      }
      this.data = data;
    }
    this._remove = false;
    // id
    this.id = id++;

    // pos 
    this.x = x;
    this.y = y;
    this._curTile = null;

    this.walkable = data.walkable || false;
    this.movingTime = 500;
    // cur image/animation
    // status

    this.stats = createStats(data.stats);
    this.bag = createBag(data.bag);

    // script?
    this.script = null;
    this.actionQueue = [];
    if (data.script) {
      if (data.script.main) {
        const scriptClass = getScript(data.script.main);
        this.script = new scriptClass();
        this.script.start(this);
      }
    }

    this.renderUpdate = true;
    this.graphic = new EntityGraphic(this);
    
    this._onEntityUpdate = [];
    this._onChangePosition();
  }

  static viewEntitiesWithAction(action) {
    if (action in actionToEntityMap) 
      return actionToEntityMap[action];
    return [];
  }

  static viewActions(typeId) {
    if (typeId in actionMap) 
      return actionMap[typeId].allActions;
    return [];
  } 

  updateType(newType) {
    const data = getConfig(newType);
    this.data = data;
    this.graphic.checkTextureData();
    this.graphic.updateTextures = true;
  }

  _onChangePosition() {
    // This needs cleanup. along with sprite positions
    const map = Map.getFocus();
    if (!map) return;
    const tile = map.getTile(~~this.x, ~~this.y);
    if (!tile) return;
    if (this._curTile) {
      this._curTile.entities.splice(this._curTile.entities.indexOf(this), 1);
    }
    this._curTile = tile;
    tile.entities.push(this);
  }

  update(map, entities) {
    // This will change more later. In the future Actions will queue up and the script will be able to cancel actions.
    if (!this.action && this.actionQueue.length > 0) {
      this.action = this.actionQueue.shift();
    } else if (!this.action && this.script) {
      const action = this.script.update(this, map, entities);
      if (action) {
        this.action = action;
        this._onActionUpdate();
      }
    }
    if (this.action) {
      const hasSubAction = !!this.action.subAction;
      const actionResult = this.action.perform(this, map, entities);
      if (hasSubAction !== !!this.action.subAction)
        this._onActionUpdate();
      if (actionResult !== PREFORM_ACTION_RESULT.ACTIVE) {
        this.lastAction = this.action;
        this.lastActionResult = actionResult;
        this.action.finally();
        this.action = null;
      } else {
        return;
      }
    }
  }

  queueAction(action, isImportant) {
    isImportant = true
    if (isImportant) {
      this.action.cancel();
      this.actionQueue.push(action);
    } else {
      this.actionQueue.push(action);
    }
  }

  checkEdges(map) {
    this.graphic.checkEdges(map, map.entities);
  }

  render() {
    this.graphic.render();
    this.renderUpdate = false;
  }

  attack(target) {
    if (!target.stats) return;
    // const attack = this.stats.getAttack();
    const rawAttack = this.stats.attack;
    const defense = target.stats.defense;
    const attack = rawAttack - defense;
    target.stats.health -= attack;
  }

  useItem(item) {

  }

  remove() {
    if (this._remove) return;
    if (this.graphic) {
      this.graphic.remove();
    }
    this._remove = true;
    if (this._curTile) {
      this._curTile.entities.splice(this._curTile.entities.indexOf(this), 1);
    }
  }

  _onActionUpdate() {
    this._onEntityUpdate.forEach(action => action());
  }

  addOnEntityUpdate(action) {
    this._onEntityUpdate.push(action);
  }

  removeOnEntityUpdate(action) {
    const index = this._onEntityUpdate.indexOf(action);
		if (index < -1) return;
		this._onEntityUpdate.splice(index, 1); 
  }
}