import Component from "../component.mjs";
import { createEventlistener } from '../../core/utils.mjs';

export default class HealthComponent extends Component {
  constructor() {
    super();

    this.health = 160;
    this.maxHealth = 200;

    this.pp = 10;
    this.maxPP = 100;

    this._onHealthChange = createEventlistener();
    this._onPPChange = createEventlistener();

    this.testCount = 0; 
  }

  addOnHealthChange(evt) {
    this._onHealthChange.add(evt);
  }

  removeOnHealthChange(evt) {
    this._onHealthChange.remove(evt);
  }

  addOnPPChange(evt) {
    this._onPPChange.add(evt);
  }

  removeOnPPChange(evt) {
    this._onPPChange.remove(evt);
  }

  _onEntityDamage(m) {
    const damage = m.damage;
    this.health -= damage;
    if (this.health < 0)
      this.health = 0;
    this._onHealthChange.trigger();
    if (this.health === 0) {
      this.broadcast({
        topic: 'entity.death',
      });
    }
    
    if (this.parent.getComponent('GraphicComponent')) {
      this.parent.getComponent('GraphicComponent').addEffect('DamageEffect');
    }
  }

  _onEntityHeal(m) {
    const heal = m.heal;
    this.health += heal;
    if (this.health > this.maxHealth) {
      this.health = this.maxHealth;
    }
  }

  initComponent() {
    this._RegisterHandler('entity.damage', (m) => { this._onEntityDamage(m); });
    this._RegisterHandler('entity.heal', (m) => { this._onEntityHeal(m); });
  }

  update() {
    if (this.testCount++ % 15 === 0) {
      if (this.pp < this.maxPP)
        this.pp++;
      this._onPPChange.trigger();
    }
    else if (Math.random() > .99) {
      this.pp -= ~~(20*Math.random());
      if (this.pp <= 0) {
        this.pp = this.maxPP;
      }
      this._onPPChange.trigger();
    }
    if (Math.random() > .99) {
      if (this.health-8> 0)
        this.broadcast({
          topic: 'entity.damage',
          damage: 8,
        });
      else 
        this.broadcast({
          topic: 'entity.heal',
          heal: 200,
        });
    }
    
    
  }
}