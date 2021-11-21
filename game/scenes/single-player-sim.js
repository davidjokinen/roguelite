import Entity from '../entities/entity-client.js';
import { ClientMap } from '../map/client-map.mjs';
import BaseGenerator from '../map/generators/base-generator.mjs';
import DefaultScene from './default-scene.mjs';

import Game from '../ui/pages/game';

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

export default class SinglePlayerSimScene extends DefaultScene {
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

    this.map = new ClientMap(this, new BaseGenerator(), pathFinding);
    // this.map = new ClientMap(this, null, pathFinding);
    

    const entitySelector = new EntitySelector(tileSelector, this.map);
    
    this.addComponent(tileSelector);
    this.addComponent(pathFinding);
    this.addComponent(mapEditor);
    this.addComponent(gameTime);
    this.addComponent(entitySelector);
    this.addComponent(actionQueue);


    for (let i=0;i<5;i++) {
      let tile = this.map.findEmptyTile(80,80);
      const e2 = new Entity('npm-sim', tile.x, tile.y);
      this.map.addEntity(e2);
      // this.cameraTarget = e2;
    }

    const mouse = Mouse.getMouse();
    const keyboard = Keyboard.getKeyboard();
    this.onKeyEvent = keyboard.onKeyDown((e) => {
      const code = e.keyCode;
      if (code === 27) {
        this.changeScene('pause');
        return false;
      }
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