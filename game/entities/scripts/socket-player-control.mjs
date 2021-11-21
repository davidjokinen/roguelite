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
    let moveX = 0;
    let moveY = 0;
    if (keyboard.key[KEY_W])
      moveY += 1;
    if (keyboard.key[KEY_S])
      moveY -= 1;
    if (keyboard.key[KEY_D])
      moveX += 1;
    if (keyboard.key[KEY_A])
      moveX -= 1;

    if (moveX == 0 && moveY == 0)
      return;
    
    // replace when entites are stored in map
    let clearSpot = true;
    let newX = target.x + moveX;
    let newY = target.y + moveY;
    // const tile = map.getTile(newX, newY);
    // if (tile) {
    //   if (!tile.walkable) {
    //     clearSpot = false;
    //   }
    //   tile.entities.forEach(entity => {
    //     if (!entity.walkable) {
    //       clearSpot = false;
    //     }
    //   });
    // }
    // console.log(moveX, moveY)

    // if (!clearSpot || !tile) return;

    this.socket.send(PLAYER_COMMANDS.PLAYER_MOVE, {
      moveX,
      moveY,
    });
    // target.move(moveX, moveY);
    this.inputCooldown.reset();
    // return new WalkAction(moveX, moveY);
  }

  end(target, map, entities) {
    delete this.inputCooldown;
  }
}