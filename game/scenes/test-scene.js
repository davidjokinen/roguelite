import Entity from '../entity';
import Map from '../map/map.js';
import BaseGenerator from '../map/generators/base-generator';
import DefaultScene from './default-scene';

import Game from '../ui/pages/game';

import React from 'react';

export default class TestScene extends DefaultScene {
  constructor(camera) {
    super();
    this.camera = camera;
    this.cameraTarget = null;
  }

  init() {
    super.init();
    this.entities = [];
    this.map = new Map(new BaseGenerator(this.entities));
    
    let tile = this.map.findEmptyTile(75,75);
    const e1 = new Entity('player', tile.x, tile.y);
    this.entities.push(e1);

    tile = this.map.findEmptyTile(80,80);
    const e2 = new Entity('npm-wander', tile.x, tile.y);
    this.entities.push(e2);

    for (let i=0;i<87;i++) {
      let tile = this.map.findEmptyTile(75,75);
      const wood = new Entity('wood-pile', tile.x, tile.y);
      this.entities.push(wood);
    }

    // e1.attack(e2);
    this.cameraTarget = e1;
    
    this.entities.forEach(entity => entity.checkEdges(this.map, this.entities));

    this.sceneComponent = <Game {...this.getUiProps()}/>;
    this.drawUI();
  }

  update() {
    const { cameraTarget, camera } = this;
    
    const listLength = this.entities.length;
    for(let i=0; i<listLength; i++) {
      this.entities[i].update(this.map, this.entities);
    }

    if (cameraTarget) {
      if (cameraTarget.moving) {
        camera.position.x = cameraTarget.moveX + .5;
        camera.position.y = cameraTarget.moveY + .5;
      } else {
        camera.position.x = cameraTarget.x + .5;
        camera.position.y = cameraTarget.y + .5;
      }
      
    }
  }

  render() {
    this.map.render();
    this.entities.forEach(entity => entity.render());
  }

  remove() {
    this.map.remove();
    this.entities.forEach(entity => entity.remove());
  }
}