import Keyboard from '../../core/keyboard.js';
import Mouse from '../../core/mouse.mjs';
import EntityScript from '../entity-script.mjs';
import { createCooldown } from '../../core/utils.mjs';

import PLAYER_COMMANDS from '../../net/common/player.js';

export default class SocketPlayerControl extends EntityScript {
  start(target) {
    this.inputCooldown = createCooldown(target.movingTime);
  }

  _onAttack(target, e) {
    // if (!target.client) return;
    const tileSelector = target.world.scene.componentMap['tile-selector'];
    const { cursorPoint } = tileSelector;
    console.log(e)
    tileSelector.onMouseMove(e, true);
    if (e.button === 0) {
      target.broadcast({
        topic: 'entity.attack',
        targetX: cursorPoint.rawX,
        targetY: cursorPoint.rawY,
      });
    }
  }

  update(target, map, entities) {
    if (!target.client) return;
    if (this.inputCooldown.check()) return;

    const socket = map.scene.componentMap['socket'];
    const mouse = Mouse.getMouse();
    
    if (!socket) return;
    if (!this.socket) {
      // Init player controls to socket
      this.socket = socket;
      this.socket.addOnMessage(PLAYER_COMMANDS.PLAYER_MOVE, (command, data) => {
        console.log('PLAYER_MOVE')
      });
      this.onAttack = this._onAttack.bind(this, target);
      mouse.addOnClickDown(this.onAttack);
    }

    const keyboard = Keyboard.getKeyboard();
    const KEY_W = 87;
    const KEY_S = 83;
    const KEY_A = 65;
    const KEY_D = 68;

    const MOVE_UP = keyboard.key[KEY_W];
    const MOVE_DOWN = keyboard.key[KEY_S];
    const MOVE_LEFT = keyboard.key[KEY_A];
    const MOVE_RIGHT = keyboard.key[KEY_D];

    if (MOVE_UP !== this.MOVE_UP ||
      MOVE_DOWN !== this.MOVE_DOWN ||
      MOVE_LEFT !== this.MOVE_LEFT ||
      MOVE_RIGHT !== this.MOVE_RIGHT 
      ) {
      
      this.MOVE_UP = MOVE_UP;
      this.MOVE_DOWN = MOVE_DOWN;
      this.MOVE_LEFT = MOVE_LEFT;
      this.MOVE_RIGHT = MOVE_RIGHT;
      this.socket.send(PLAYER_COMMANDS.PLAYER_MOVE, {
        MOVE_UP,
        MOVE_DOWN,
        MOVE_LEFT,
        MOVE_RIGHT
      });
    }
  }

  end(target, map, entities) {
    delete this.inputCooldown;
    const mouse = Mouse.getMouse();
    if (this.onAttack)
      mouse.removeOnClickDown(this.onAttack);
  }
}