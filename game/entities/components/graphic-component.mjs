import Component from "../component.mjs";
import EntityGraphic from '../../graphics/entity-graphic.js';
import DamageEffect from "../../graphics/effects/damage-effect.js";
import FadeEffect from "../../graphics/effects/fade-effect.js";

const classMap = {
  FadeEffect,
  DamageEffect,
}

export default class GraphicComponent extends Component {
  constructor() {
    super();
    this.id = 'GraphicComponent';
    this.effects = [];
  }

  addEffect(effect) {
    if (typeof effect === 'string' && effect in classMap) {
      effect = new classMap[effect]();
    }
    if (typeof effect === 'string') {
      console.error('Did not find effect ', effect)
      return;
    }
    let doubles = false;
    this.effects.forEach(check => {
      if (check.constructor == effect.constructor) 
        doubles = true;
    });
    if (doubles)
      return;
    effect.parent = this;
    effect.init();
    this.effects.push(effect);
  }

  removeEffect(effect) {
    const index = this.effects.indexOf(effect);
		if (index < -1) return;
		this.effects.splice(index, 1); 
  }

  _onChangePosition() {
    const parent = this.parent;
    this.graphic.updatePosition(parent.x, parent.y);
  }

  initComponent() {
    this.graphic = new EntityGraphic(this.parent);

    this._RegisterHandler('update.position', (m) => { this._onChangePosition(m); });
  }

  destroy() {
    if (this.graphic) {
      this.graphic.remove();
    }
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

  update() {
    for (let i=0; i<this.effects.length; i++) {
      this.effects[i].update()
    }
  }

  render() {
    this.graphic.render();
    this.renderUpdate = false;
    for (let i=0; i<this.effects.length; i++) {
      this.effects[i].render()
    }
  }
}