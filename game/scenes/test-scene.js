import Entity from '../entity';
import Map from '../map/map.js';
import BaseGenerator from '../map/generators/base-generator'

export default class TestScene {
  constructor(camera) {
    this.camera = camera;
    this.cameraTarget = null;
  }

  init() {
    this.entities = [];
    this.map = new Map(new BaseGenerator(this.entities));
    
    let tile = this.map.findEmptyTile(75,75);
    const e1 = new Entity('player', tile.x, tile.y);
    tile = this.map.findEmptyTile(80,80);
    const e2 = new Entity('npm-wander', tile.x, tile.x);

    this.entities.push(e1);
    this.entities.push(e2);

    // e1.attack(e2);
    this.cameraTarget = e1;
    
    this.entities.forEach(entity => entity.checkEdges(this.map, this.entities));
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
}