import Keyboard from '../../core/keyboard.js';
import EntityScript from '../entity-script.mjs';
import { createCooldown } from '../../core/utils.mjs';

import WalkAction from '../../actions/walk-action.mjs';
import PLAYER_COMMANDS from '../../net/common/player.js';



export default class SocketPlayerControl extends EntityScript {
  start(target) {
    this.inputCooldown = createCooldown(target.movingTime);
  }

  update(target, map, entities) {
    // console.log('test')
    if (this.inputCooldown.check()) return;

    const socket = map.scene.componentMap['socket'];
    
    if (!target.client) return;
    if (!socket) return;
    if (!this.socket) {
      // Init player controls to socket
      this.socket = socket;
      this.socket.addOnMessage(PLAYER_COMMANDS.PLAYER_MOVE, (command, data) => {
        console.log('PLAYER_MOVE')
      });
    }

    const keyboard = Keyboard.getKeyboard();
    const KEY_W = 87;
    const KEY_S = 83;
    const KEY_A = 65;
    const KEY_D = 68;
    // let moveX = 0;
    // let moveY = 0;
    // if (keyboard.key[KEY_W])
    //   moveY += 1;
    // if (keyboard.key[KEY_S])
    //   moveY -= 1;
    // if (keyboard.key[KEY_D])
    //   moveX += 1;
    // if (keyboard.key[KEY_A])
    //   moveX -= 1;

    // if (moveX == 0 && moveY == 0)
    //   return;
    
    // replace when entites are stored in map
    // let clearSpot = true;
    // let newX = target.x + moveX;
    // let newY = target.y + moveY;

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
    
    // target.move(moveX, moveY);
    // this.inputCooldown.reset();
    // return new WalkAction(moveX, moveY);
  }

  end(target, map, entities) {
    delete this.inputCooldown;
  }
}