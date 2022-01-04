import Entity from '../entities/entity.mjs';
import { ClientMap } from '../map/client-map.mjs';
import BaseGenerator from '../map/generators/base-generator.mjs';
import DefaultScene from './default-scene.mjs';

import Game from '../ui/pages/roguelike-game';

import Keyboard from '../core/keyboard';
import Mouse from '../core/mouse.mjs';

import GameTime from '../services/game-time.mjs';
import TileSelector from '../services/tile-selector.mjs';
import PathFinding from '../services/path-finding.mjs';
import MapEditor from '../services/map-editor.mjs';
import EntitySelector from '../services/entity-selector.mjs';
import Socket from '../services/socket';

import React from 'react';

import { LAYERS, SHEETS } from '../graphics/resources.mjs';

import { loopXbyX } from '../core/utils.mjs';
import ActionQueue from '../services/action-queue-client.mjs';
import { PLAYER_SPAWN } from '../net/common/player';
import ClientGameWorld from '../map/client-world.mjs';
import PlayerService from '../services/player-service.mjs';

export default class RoguelikeGame extends DefaultScene {
  constructor(camera) {
    super();
    this.camera = camera;
    this.cameraTarget = null;
  }

  init() {
    super.init();

    const gameTime = new GameTime();
    const tileSelector = new TileSelector(this.camera);
    const pathFinding = new PathFinding();
    const actionQueue = new ActionQueue();
    const mapEditor = new MapEditor(tileSelector, actionQueue);
    const socketService = new Socket();
    const playerService = new PlayerService(this);

    mapEditor.addSocket(socketService);
    
    this.world = new ClientGameWorld(this);
    // this.map = new ClientMap(this, null, pathFinding);
    // this.map.addSocket(socketService);

    this.world.addSocket(socketService);

    // socketService.map = this.map;
    socketService.world = this.world;
    const entitySelector = new EntitySelector(tileSelector, this.world);
    
    this.addComponent(tileSelector);
    this.addComponent(pathFinding);
    this.addComponent(mapEditor);
    this.addComponent(gameTime);
    this.addComponent(entitySelector);
    this.addComponent(actionQueue);
    this.addComponent(socketService);
    this.addComponent(playerService);

    const mouse = Mouse.getMouse();
    const keyboard = Keyboard.getKeyboard();
    this.onKeyEvent = keyboard.onKeyDown((e) => {
      const code = e.keyCode;
      if (code === 27) {
        this.changeScene('pause');
        return false;
      }
    });
    this.socketService = socketService;
    socketService.onLogin(() => {
      // TODO: spawn in
      console.log('On login')
      socketService.addOnMessage(PLAYER_SPAWN, (command, data) => {
        const { id } = data;
        console.log(PLAYER_SPAWN, data);
        const entity = this.world.getEntityByID(id);
        const test = this.world.maps[0].entities;
        console.log(test[test.length-1])
        if (!entity) {
          console.log('Did not find player');
          return;
        }
        entity.client = true;
        this.cameraTarget = entity;
        // console.log(this.world)
      });
      const playerData = {
        // TODO customization 
      };
      
      console.log('spawning in 5 sec')
      setTimeout(() => {
        console.log('Asking to spawn in now')
        socketService.send(PLAYER_SPAWN, playerData);
      }, 1000);
      
    });

    socketService.onDisconnect(() => {
      console.log('On Disconnect')
      this.changeScene('disconnect');
    });

    this.world.forEachEntity((entity, map) => entity.checkEdges(map, map.entities));

    // this.map.entities.forEach(entity => entity.checkEdges(this.map, this.entities));

    this.sceneComponent = <Game {...this.getUiProps()} world={this.world} keyboard={keyboard} mouse={mouse}/>;
    this.drawUI();
  }

  update() {
    super.update();
    const { cameraTarget, camera } = this;
    
    this.world.update();
    

    if (cameraTarget) {
      if (cameraTarget.sprite) {
        // camera.position.x = cameraTarget.sprite._x + .5;
        // camera.position.y = cameraTarget.sprite._y + .5;
        const difX = camera.position.x-(cameraTarget.sprite._x + .5);
        const difY = camera.position.y-(cameraTarget.sprite._y + .5);
        camera.position.x -= Math.abs(difX) < .001 ? difX : difX * .3;
        camera.position.y -= Math.abs(difY) < .001 ? difY : difY * .3;
      } else {
        camera.position.x = cameraTarget.x + .5;
        camera.position.y = cameraTarget.y + .5;
      }
      
    }
  }

  render() {
    this.world.render();
  }

  remove() {
    if (this.socketService)
      this.socketService.onDisconnect(() => {});
    super.remove();
    const keyboard = Keyboard.getKeyboard();
    keyboard.removeOnKeyDown(this.onKeyEvent);
    this.world.remove();
  }
}