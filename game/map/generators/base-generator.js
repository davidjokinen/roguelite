import { loopXbyX } from '../../utils';

import Entity from '../../entity';
import perlinNoise from './utils/perlin-noise';

export default class BaseGenerator {

  constructor(entities) {
    this.map = null;
    this.entities = entities;
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
    loopXbyX(startX, startY, size, size, (x, y) => {
      const tile = this.map.getTile(x, y);
      const height = this.waterNoise.getHeight(x/2, y/2);
      const plantDense = this.plantNoise.getHeight(x, y)/3;
      if (!tile || tile.type === 'water') return;
      
      if (Math.random() > .95+plantDense)
        this.entities.push(new Entity('tree', x, y));
      else if (Math.random() > .95+plantDense)
        this.entities.push(new Entity('small-tree', x, y));
      else if (Math.random() > .98)
        this.entities.push(new Entity('dead-tree', x, y));
      else if (Math.random() > .98)
        this.entities.push(new Entity('small-dead-tree', x, y));
    });
  }
}