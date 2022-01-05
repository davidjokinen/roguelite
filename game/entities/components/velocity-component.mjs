import Component from "../component.mjs";

export default class VelocityComponent extends Component {
  constructor(vx, vy) {
    super();
    this.id = 'MapComponent';
    this.tickComponent = true;
    this.vx = vx || 0;
    this.vy = vy || 0;
  }

  initComponent() {
    const parent = this.parent;

    this._RegisterHandler('entity.collide', (m) => { this._onEntityCollide(m); });
  }

  _onEntityCollide(m) {
    console.log('Collide! ', m)
    const parent = this.parent;
    
    if (m.hit) {
      console.log('Hit')
      m.hit.broadcast({
        topic: 'entity.damage',
        damage: 1,
      });
    }
    parent.destroy();
  }

  update() {
    const parent = this.parent;
    if (this.vx === 0 && this.vy === 0) {
      return;
    }
    parent.x += this.vx;
    parent.y += this.vy;
    parent.broadcast({
      topic: 'update.position',
    })
  }
}