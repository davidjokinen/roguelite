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

    mapEditor.addSocket(socketService);
    this.map = new ClientMap(this, null, pathFinding);
    this.map.addSocket(socketService);

    socketService.map = this.map;
    const entitySelector = new EntitySelector(tileSelector, this.map);
    
    this.addComponent(tileSelector);
    this.addComponent(pathFinding);
    this.addComponent(mapEditor);
    this.addComponent(gameTime);
    this.addComponent(entitySelector);
    this.addComponent(actionQueue);
    this.addComponent(socketService);

    const mouse = Mouse.getMouse();
    const keyboard = Keyboard.getKeyboard();
    this.onKeyEvent = keyboard.onKeyDown((e) => {
      const code = e.keyCode;
      if (code === 27) {
        this.changeScene('pause');
        return false;
      }
    });

    socketService.onLogin(() => {
      // TODO: spawn in
      console.log('On login')
      socketService.addOnMessage(PLAYER_SPAWN, (command, data) => {
        const { id } = data;
        const entity = this.map.getEntityByID(id);
        if (!entity) return;
        entity.client = true;
        this.cameraTarget = entity;
      });
      const playerData = {
        // TODO customization 
      };
      
      socketService.send(PLAYER_SPAWN, playerData);
    });

    
    this.map.entities.forEach(entity => entity.checkEdges(this.map, this.entities));

    this.sceneComponent = <Game {...this.getUiProps()} map={this.map} keyboard={keyboard} mouse={mouse}/>;
    this.drawUI();
  }

  update() {
    super.update();
    const { cameraTarget, camera } = this;
    
    this.map.update();
    

    if (cameraTarget) {
      if (cameraTarget.sprite) {
        camera.position.x = cameraTarget.sprite._x + .5;
        camera.position.y = cameraTarget.sprite._y + .5;
      } else {
        camera.position.x = cameraTarget.x + .5;
        camera.position.y = cameraTarget.y + .5;
      }
      
    }
  }

  render() {
    this.map.render();
  }

  remove() {
    super.remove();
    const keyboard = Keyboard.getKeyboard();
    keyboard.removeOnKeyDown(this.onKeyEvent);
    this.map.remove();
  }
}