import { loopXbyX } from '../../core/utils.mjs';
import BaseGenerator from './base-generator.mjs';

import perlinNoise from './utils/perlin-noise.mjs';

export default class CaveGenerator extends BaseGenerator {

  constructor() {
    super();
  }

  tileInit(x, y) {
    return 'dirt';
  }

  chunkPost(posX, posY, size) {
    const startX = posX*size;
    const startY = posY*size;
    const Entity = this.map.getEntityClass();
    loopXbyX(startX, startY, size, size, (x, y) => {
      if (Math.random() > .95)
        this.map.addEntity(new Entity('bed', x, y));
    });
  }
}