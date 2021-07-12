import Entity from '../entities/entity';
import Map from '../map/map.js';
import BaseGenerator from '../map/generators/base-generator';
import DefaultScene from './default-scene';

import Game from '../ui/pages/game';

import Keyboard from '../core/keyboard';
import Mouse from '../core/mouse';

import TileSelector from '../services/tile-selector';
import PathFinding from '../services/path-finding';
import MapEditor from '../services/map-editor';

import React from 'react';

import { LAYERS, SHEETS } from '../graphics/resources.js';

import { loopXbyX } from '../core/utils';

export default class TestScene extends DefaultScene {
  constructor(camera) {
    super();
    this.camera = camera;
    this.cameraTarget = null;
  }

  init() {
    super.init();

    const tileSelector = new TileSelector(this.camera);
    const pathFinding = new PathFinding();
    const mapEditor = new MapEditor(tileSelector);
    this.addComponent(tileSelector);
    this.addComponent(pathFinding);
    this.addComponent(mapEditor);

    this.map = new Map(new BaseGenerator(), pathFinding);
    
    // let tile = this.map.findEmptyTile(75,75);
    // const e1 = new Entity('player', tile.x, tile.y);
    // this.map.addEntity(e1);

    for (let i=0;i<3;i++) {
      let tile = this.map.findEmptyTile(80,80);
      const e2 = new Entity('npm-sim', tile.x, tile.y);
      this.map.addEntity(e2);
    }

    let tile = this.map.findEmptyTile(80,90);
    const e2 = new Entity('npm-wander', tile.x, tile.y);
    this.map.addEntity(e2);
  

    // loopXbyX(50, 50, 50, 50, (x, y) => {
    //   const texture = SHEETS['colors'].getTexture(~~(Math.random()*3)); 
    //   LAYERS['overlay'].createSprite(texture, x, y);
    // });
    for (let i=0;i<87;i++) {
      // let tile = this.map.findEmptyTile(75,75);
      // const wood = new Entity('wood-pile', tile.x, tile.y);
      // this.entities.push(wood);
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

    // let lastPos = null;
    // tileSelector.addOnMouseMove(cursorPoint => {
      
    //   if (!lastPos) {
    //     lastPos = {
    //       x: cursorPoint.rawX,
    //       y: cursorPoint.rawY,
    //     }
    //   }
    //   console.log(lastPos.x - cursorPoint.rawX)
    //   if (mouse.buttons[2]) {

    //     this.camera.position.x += lastPos.x - cursorPoint.rawX;
    //     this.camera.position.y += lastPos.y - cursorPoint.rawY;
    //   }
    //   lastPos = {
    //     x: cursorPoint.rawX,
    //     y: cursorPoint.rawY,
    //   }
    // });

    // this.entities.push(new Entity('tree', 53, 56));
    // this.entities.push(new Entity('tree', 53, 55));
    // this.entities.push(new Entity('tree', 53, 54));
    // this.entities.push(new Entity('tree', 53, 53));
    // this.entities.push(new Entity('tree', 53, 52));
    // this.entities.push(new Entity('tree', 53, 51));
    // const path = this.map.findPath(50, 50, 70, 70) || [];
    // path.forEach(tile => {
    //   const tes = new Entity('bush', tile.x, tile.y);
    //   this.entities.push(tes);
    // })
    // console.log(path)

    // e1.attack(e2);
    // this.cameraTarget = e1;
    
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