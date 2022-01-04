import BaseService from './base-service.mjs';
import { createEventlistener } from '../core/utils.mjs';

export default class PlayerService extends BaseService {
  constructor(parent) {
    super();
    this.id = 'player';
    this.parent = parent;
    this.player = null;

    this._onPlayerChange = createEventlistener();
  }

  addOnPlayerChange(evt) {
    this._onPlayerChange.add(evt);
  }

  removeOnPlayerChange(evt) {
    this._onPlayerChange.remove(evt);
  }

  init() {
    
  }

  remove() {
    
  }

  _onTargetChange() {
    this.player = this.parent.cameraTarget;
    this._onPlayerChange.trigger(this.player);
  }

  update() {
    if (this.parent.cameraTarget !== this.player) {
      this._onTargetChange();
    }
  }

}