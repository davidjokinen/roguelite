import BaseService from './base-service';

export default class GameTime extends BaseService {
  constructor() {
    super();
    this.id = 'game-time';
    this.time = 0;
    this.timeSpeed = 1;
  }

  now() {
    return this.time;
  }

  init() {
    // Global ref to replace Date.now
    if (!window.GameTime) {
      window.GameTime = this;
    }
  }

  remove() {
    if (window.GameTime === this) {
      window.GameTime = undefined;
    }
  }

  update() {
    const TIME_BETWEEN_TICKS = 50;
    const timeAdd = this.timeSpeed * TIME_BETWEEN_TICKS;
    this.time += timeAdd;
  }

}