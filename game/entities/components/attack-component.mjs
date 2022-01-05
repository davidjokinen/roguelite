import Component from "../component.mjs";
import LifeComponent from "./lifespan-component.mjs";
import VelocityComponent from "./velocity-component.mjs";

export default class AttackComponent extends Component {
  constructor() {
    super();
    this.id = 'AttackComponent';
  }

  initComponent() {
    const parent = this.parent;

    this._RegisterHandler('entity.attack', (m) => { this._onEntityAttack(m); });
  }

  _onEntityAttack(m) {
    console.log('Attacking!!! ', m)
    const parent = this.parent;
    const { world } = parent;
    const px = parent.x + .5;//+ .5;
    const py = parent.y ;
    const vecScale = .1;

    const difX = m.targetX - px ;
    const difY = m.targetY - py ;
    const magnitude = Math.sqrt((difX * difX) + (difY * difY));
    const vecX = difX / magnitude;
    const vecY = difY / magnitude;

    const entity = new world.Entity('grass', parent.x + vecX * 1.2, parent.y + vecY* 1.2);
    entity.addComponent(new VelocityComponent(vecX * vecScale, vecY * vecScale));
    entity.addComponent(new LifeComponent());
    parent.map.addEntity(entity);
  }
}