

export default class BaseEffect {
  constructor() {
    this.parent = null;
  }

  init() {

  }

  remove() {
    this.parent.removeEffect(this);
  }

  update() {

  }

  render() {

  }
}