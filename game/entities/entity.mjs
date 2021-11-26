import { createStats } from './stats.mjs';
import { createBag } from '../items/bag.mjs';

import getScript from './get-script.mjs';
import { getConfig, actionToEntityMap, actionMap } from './get-config.mjs';


import { PREFORM_ACTION_RESULT } from '../actions/base-action.mjs';

import Map from '../map/map.mjs';

let id = 0;

export default class Entity {
  constructor(data, x, y) {
    this.data = null;
    let loadData = null;
    if (y === undefined) {
      y = x;
      x = data;
      this.data = {};
    } else {
      
      if (typeof data === 'string') {
        loadData = getConfig(data);
      }
      this.data = loadData;
      if (!this.data)
        console.log('Error ',data, loadData)
    }
    this._remove = false;
    this.type = this.data.id;
    // id
    this.id = id++;

    // pos 
    this.x = x;
    this.y = y;
    this._curTile = null;

    this.walkable = this.data.walkable || false;
    this.movingTime = 100;
    // cur image/animation
    // status

    this.stats = createStats(data.stats);
    this.bag = createBag(data.bag);

    // script?
    this.script = null;
    this.actionQueue = [];
    if (this.data.script) {
      if (this.data.script.main) {
        const scriptClass = this.getScript(this.data.script.main);
        if (scriptClass) {
          this.script = new scriptClass();
          this.script.start(this);
        } else {
          console.log(`no script loaded "${data.script.main}"`)
        }
      }
    }

    
    this._onActionUpdateList = [];
    this._onEntityUpdate = [];
    this._onChangePosition();
  }

  get getScript() {
    return getScript;
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

  actionUpdate(action) {
    this._onActionUpdateList.forEach(event => event(action));
  }

  onActionUpdate(event) {
    this._onActionUpdateList.push(event);
  }

  addSocketAction(action) {
    this.socketAction = action;
  }

  updateType(newType) {
    const data = getConfig(newType);
    this.data = data;
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
    const { SERVER_UPDATE } = this;
    if (SERVER_UPDATE) {
      if (this.socketAction) {
        this.socketAction.perform(this, map, entities);
      }
      if (this.script) {
        this.script.update(this, map, entities);
      }
      return;
    }
    // This will change more later. In the future Actions will queue up and the script will be able to cancel actions.
    if (!this.action && this.actionQueue.length > 0) {
      this.action = this.actionQueue.shift();
      this.actionUpdate(this.action);
      // TODO: cleanup _onActionUpdate
      this._onActionUpdate();
    } else if (!this.action && this.script) {
      const action = this.script.update(this, map, entities);
      if (action) {
        this.action = action;
        this.actionUpdate(action);
        // TODO: cleanup _onActionUpdate
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
    if (isImportant && this.action) {
      this.action.cancel();
    }
    this.actionQueue.push(action);
  }

  checkEdges(map) {
    
  }

  render() {
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
    this._remove = true;
    if (this.map) {
      this.map.removeEntity(this);
    } else {
      console.log('LOST?')
    }
    if (this.graphic) {
      this.graphic.remove();
    }
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

  export() {
    return {
      id: this.id,
      type: this.type,
      x: this.x,
      y: this.y,
    };
  }

}