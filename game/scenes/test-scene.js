import Entity from '../entity';
import Map from '../map';
import { loopXbyX } from '../utils';

export default class TestScene {
  constructor(camera) {
    this.camera = camera;
    this.cameraTarget = null;
  }

  init() {
    this.entities = [];
    this.map = new Map();
    // I sort of hate this. 
    const e1 = new Entity('player', 20, 20);
    const e2 = new Entity('npm-wander', 20, 22);
    const bush = new Entity('bush', 24, 24);
    loopXbyX(28, 25, 10, 10, (x, y) => {
      this.entities.push(new Entity('tree', x, y))
    })
    this.entities.push(e1);
    this.entities.push(e2);
    this.entities.push(bush);
    for (let i=0; i<7; i++)
      this.entities.push(new Entity('long-bush', 26+i, 23));
    for (let i=0; i<2; i++)
      this.entities.push(new Entity('long-bush', 35+i, 23));

    e1.attack(e2);
    this.cameraTarget = e1
    
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
  }
}