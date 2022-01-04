import BaseEffect from "./base-effect";


export default class DamageEffect extends BaseEffect {
  constructor() {
    super();
    

    this.graphicFocus = null;
    // TODO replace with time
    this.count = 0;
    this.color = 0xFFFFFF;
  }

  remove() {
    super.remove();
    if (this.graphicFocus && this.graphicFocus.sprite) {
      this.graphicFocus.sprite.tint = 0xFFFFFF;
    }
  }

  init() {
    this.graphicFocus = this.parent.graphic;
  }

  update() {
    this.count++;
    if (this.count > 10) {
      this.remove();
      return;
    }
    this.color = (~~((Math.sin(this.count/10)/2+.5)*127+127) << 16) + 0xAAAA;
    if (this.graphicFocus.sprite)
      this.graphicFocus.sprite.tint = this.color;
  }

  render() {
    if (this.graphicFocus && this.graphicFocus.sprite) {
      this.graphicFocus.sprite.tint = this.color;
    }
  }
}