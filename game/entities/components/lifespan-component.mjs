import Component from "../component.mjs";

export default class LifeComponent extends Component {
  constructor(lifeSpan) {
    super();
    this.id = 'LifeComponent';

    this.tickComponent = true;
    this.lifeSpan = lifeSpan || 2000;
    this.born = Date.now();
  }

  update() {
    if (this.born + this.lifeSpan < Date.now()) {
      this.parent.destroy();
    }
  }
}