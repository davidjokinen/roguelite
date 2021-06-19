import Entity from '../entity';
import Map from '../map/map.js';
import BaseGenerator from '../map/generators/base-generator';
import DefaultScene from './default-scene';

import Game from '../ui/pages/game';

import Keyboard from '../core/keyboard';

import TileSelector from '../components/tile-selector';
import PathFindingComponent from '../components/path-finding';

import React from 'react';

export default class TestScene extends DefaultScene {
  constructor(camera) {
    super();
    this.camera = camera;
    this.cameraTarget = null;
  }

  init() {
    super.init();

    const tileSelector = new TileSelector(this.camera);
    const pathFindingComponent = new PathFindingComponent();
    this.addComponent(tileSelector);
    this.addComponent(pathFindingComponent);

    this.map = new Map(new BaseGenerator(), pathFindingComponent);
    
    let tile = this.map.findEmptyTile(75,75);
    const e1 = new Entity('player', tile.x, tile.y);
    this.map.addEntity(e1);

    for (let i=0;i<20;i++) {
      tile = this.map.findEmptyTile(80,80);
      const e2 = new Entity('npm-wander', tile.x, tile.y);
      this.map.addEntity(e2);
    }

    for (let i=0;i<87;i++) {
      // let tile = this.map.findEmptyTile(75,75);
      // const wood = new Entity('wood-pile', tile.x, tile.y);
      // this.entities.push(wood);
    }

    const keyboard = Keyboard.getKeyboard();
    this.onKeyEvent = keyboard.onKeyDown((e) => {
      const code = e.keyCode;
      if (code === 27) {
        this.changeScene('pause');
        return false;
      }
    });

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
    this.cameraTarget = e1;
    
    this.map.entities.forEach(entity => entity.checkEdges(this.map, this.entities));

    this.sceneComponent = <Game {...this.getUiProps()} keyboard={keyboard}/>;
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
    this.entities.forEach(entity => entity.remove());
  }
}