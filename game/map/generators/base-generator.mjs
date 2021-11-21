import { loopXbyX } from '../../core/utils.mjs';

// import Entity from '../../entities/entity.mjs';
import perlinNoise from './utils/perlin-noise.mjs';

export default class BaseGenerator {

  constructor() {
    this.map = null;
    // this.entities = entities;
    this.waterNoise = perlinNoise(1);
    this.plantNoise = perlinNoise(2);
  }

  init(map) {
    this.map = map;
  }

  tileInit(x, y) {
    const height = this.waterNoise.getHeight(x/2, y/2);
    if (height < -.2)
      return 'water';
    else if (height > .60)
      return 'dirt';
    else 
      return 'grass';
  }

  chunkPost(posX, posY, size) {
    const startX = posX*size;
    const startY = posY*size;
    const Entity = this.map.getEntityClass();
    loopXbyX(startX, startY, size, size, (x, y) => {
      const tile = this.map.getTile(x, y);
      const height = this.waterNoise.getHeight(x/2, y/2);
      const plantDense = this.plantNoise.getHeight(x, y)/3;
      if (!tile || tile.type === 'water') return;
      
      if (Math.random() > .95+plantDense)
        this.map.addEntity(new Entity('tree', x, y));
      else if (Math.random() > .99)
        this.map.addEntity(new Entity('bush', x, y));
      else if (Math.random() > .99)
        this.map.addEntity(new Entity('berry-bush', x, y));
      else if (Math.random() > .95+plantDense+height/3)
        this.map.addEntity(new Entity('small-tree', x, y));
      else if (height > .55 && Math.random() > .9)
        this.map.addEntity(new Entity('rock', x, y));
      else if (height > .1 && Math.random() > .995)
        this.map.addEntity(new Entity('rock', x, y));
      else if (Math.random() > 1.05-plantDense)
        this.map.addEntity(new Entity('grass', x, y));
      else if (Math.random() > .99)
        this.map.addEntity(new Entity('dead-tree', x, y));
      else if (Math.random() > .99)
        this.map.addEntity(new Entity('small-dead-tree', x, y));
    });
  }
}