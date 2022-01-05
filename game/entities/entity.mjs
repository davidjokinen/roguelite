import { v4 as uuidv4 } from 'uuid';

import { createStats } from './stats.mjs';
import { createBag } from '../items/bag.mjs';

import getScript from './get-script.mjs';
import { getConfig, actionToEntityMap, actionMap } from './get-config.mjs';

import MapComponent from './components/map-component.mjs';
import ActionComponent from './components/action-component.mjs';
import HealthComponent from './components/health-component.mjs';
import AttackComponent from './components/attack-component.mjs';

export default class Entity {
  constructor(data, x, y, params) {
    this.data = null;
    this.params = params;
    let loadData = null;
    if (typeof data === 'string') {
      loadData = getConfig(data);
    }
    this.data = loadData;
    if (!this.data)
      console.log('Error ',data, loadData)

    this.type = this.data.id;
    // id
    this.id = uuidv4();

    // pos 
    this.x = x;
    this.y = y;

    this._handlers = {};
    this._components = {};
    this._tickComponents = [];

    this._dead = false;
    this._remove = false;
    this._isUpdateEntity = false;

    this.addComponent(new MapComponent());
    this.addComponent(new ActionComponent());
    this.addComponent(new HealthComponent());
    this.addComponent(new AttackComponent());
    

    this.walkable = this.data.walkable || false;
    this.movingTime = 200;
    // cur image/animation
    // status

    this.stats = createStats(data.stats);
    this.bag = createBag(data.bag);
    
  }

  _RegisterHandler(n, h) {
    if (!(n in this._handlers)) {
      this._handlers[n] = [];
    }
    this._handlers[n].push(h);
  }

  initEntity(map, world) {
    for (let k in this._components) {
      this._components[k].initEntity(map, world);
    }
    this.map = map;
    this.broadcast({
      topic: 'update.position',
      init: true,
    });
  }

  getComponent(n) {
    return this._components[n];
  }

  addComponent(c) {
    c.setParent(this);
    this._components[c.id] = c;
    
    c.initComponent();
    if (c.tickComponent)
      this._tickComponents.push(c);
  }

  broadcast(msg) {
    if (!(msg.topic in this._handlers)) {
      return;
    }

    for (let curHandler of this._handlers[msg.topic]) {
      curHandler(msg);
    }
  }

  get getScript() {
    return getScript;
  }

  get isUpdateEntity() {
    return this._tickComponents.length > 0 || this._isUpdateEntity;
  }

  get map() {
    // Function set by component
    if (this.getMap)
      return this.getMap();
    return undefined;
  }

  set map(newMap) {
    // Function set by component
    if (this.updateMap) {
      return this.updateMap(newMap, true);
    } else {
      console.log('ERROR')
    }
    return undefined;
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
  }

  update(map, entities) {
    for (let i=0;i<this._tickComponents.length;i++) {
      const component = this._tickComponents[i];
      component.update(map, entities);
    }

    // Temp for testing
    if (this.getComponent('HealthComponent'))
      this.getComponent('HealthComponent').update();
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
    
    if (this.world) {
      const world = this.world;
      this.world = null;
      world.removeEntity(this, true);
      return;
    } 
    if (this.map) {
      const map = this.map;
      map.removeEntity(this, true);
      return;
    }
    this._remove = true;
  }

  destroy() {
    if (this._destroyed) return;
    this.remove();
    this._destroyed = true;
    for (let k in this._components) {
      this._components[k].destroy();
      delete this._components[k]
    }
  }

  export() {
    if (!this.getMap())
      console.log(this.type)
    return {
      id: this.id,
      mapID: this.getMap().id,
      type: this.type,
      x: this.x,
      y: this.y,
    };
  }

}