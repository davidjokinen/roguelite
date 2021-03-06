import BaseService from './base-service.mjs';

export default class GameTime extends BaseService {
  constructor() {
    super();
    this.id = 'game-time';
    this.time = 0;
    this.timeSpeed = 1;
    this.lastTime = null;
    this.init()
  }

  now() {
    return this.time;
  }

  init() {
    try {
      // Global ref to replace Date.now
      if (!window.GameTime) {
        window.GameTime = this;
      }
    } catch(e) {
      globalThis.GameTime = this;
    }
    
  }

  remove() {
    try {
      if (window.GameTime === this) {
        window.GameTime = undefined;
      }
    } catch(e) {
      globalThis.GameTime = undefined;
    }
    
  }

  update() {
    let timeBetweenTicks = 0;
    if (this.lastTime) {
      timeBetweenTicks = Date.now() - this.lastTime;
    }
    if (timeBetweenTicks > 200) {
      timeBetweenTicks = 200;
    }
    this.lastTime = Date.now();
    const timeAdd = this.timeSpeed * timeBetweenTicks;
    this.time += timeAdd;
  }

}