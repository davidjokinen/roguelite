import BaseEffect from "./base-effect";


export default class FadeEffect extends BaseEffect {
  constructor() {
    super();
    

    this.graphicFocus = null;
    // TODO replace with time
    this.count = 0;
    this.alpha = 1.0;
  }

  remove() {
    super.remove();
    if (this.graphicFocus && this.graphicFocus.sprite) {
      this.graphicFocus.sprite.alpha = 1.0;
    }
  }

  init() {
    this.graphicFocus = this.parent.graphic;
    this.start = Date.now();
    this.graphicFocus.sprite.alpha = 0;
  }

  update() {
    const now = Date.now();
    const delta = now-this.start;
    if (delta > 200) {
      this.remove();
      return;
    }
    this.alpha = (200-delta)/200;
  }

  render() {
    if (this.graphicFocus && this.graphicFocus.sprite) {
      this.graphicFocus.sprite.alpha = this.alpha;
    }
  }
}