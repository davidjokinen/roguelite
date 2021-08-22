import BaseService from './base-service';
import Mouse from '../core/mouse';
import Entity from '../entities/entity';
import { loopXbyX } from '../core/utils';
import { LAYERS, SHEETS } from '../graphics/resources';

const GRAY_TEXTURE = 2;
const RED_TEXTURE = 65;
const GREEN_TEXTURE = 129;

const HIGHLIGHT_FILTERS = {
  chop: (tile) => {
    if (tile.checkEntities({action: 'chop'})) {
      return GREEN_TEXTURE;
    }
    return GRAY_TEXTURE;
  },
  cut: (tile) => {
    if (tile.checkEntities({action: 'cut'})) {
      return GREEN_TEXTURE;
    }
    return GRAY_TEXTURE;
  },
  haul: (tile) => {
    if (tile.checkEntities({action: 'haul'})) {
      return GREEN_TEXTURE;
    }
    return GRAY_TEXTURE;
  },
  harvest: (tile) => {
    if (tile.checkEntities({action: 'harvest'})) {
      return GREEN_TEXTURE;
    }
    return GRAY_TEXTURE;
  },
  mine: (tile) => {
    if (tile.checkEntities({action: 'mine'})) {
      return GREEN_TEXTURE;
    }
    return GRAY_TEXTURE;
  },
  storage: (tile) => {
    if (tile.data.id === 'water') {
      return RED_TEXTURE;
    }
    if (tile.checkEntities()) {
      return RED_TEXTURE;
    }
    return GRAY_TEXTURE;
  },
}

// This is the service that the react components talk to to draw on the map.
export default class MapEditor extends BaseService {

  constructor(tileSelector, actionQueue) {
    super();
    this.id = 'map-editor';
    this.tileSelector = tileSelector;
    this.actionQueue = actionQueue;

    this.brush = null;
    this.startPoint = null;
    this.spriteList = [];
    this.addOnEnd = null;

    this.mouse = Mouse.getMouse();
    this.onMouseDown = () => {
      if (this.mouse.buttons[0]) {
        this.updateMap(true);
      }
    };
    this.onMouseUp = () => {
      if (this.addOnEnd) {
        this.addOnEnd();
        this.addOnEnd = null;
      }
      this.clearGraphics();
      this.startPoint = null;
    };
    this.onMouseMove = this.onMouseMove.bind(this);
  }

  onMouseMove() {
    if (this.mouse.buttons[0]) {
      this.updateMap();
    }
  }

  addTile(tile) {
    const { map, brush } = this.tool;
    const { type } = brush;
    if (tile.data.id === type)
      return;
    tile.updateType(type);
    if (type === 'water')
      tile.entities.forEach(entity => entity.remove());
    tile.checkEdges(map);
    map.getNeighbors(tile.x, tile.y).forEach(tile2 => {
      tile2.checkEdges(map)
    });
  }

  addEntity(tile) {
    const { map, brush } = this.tool;
    const { type } = brush;
    if (tile.data.id === 'water')
      return;
    tile.entities.forEach(entity => entity.remove());
    map.addEntity(new Entity(type, tile.x, tile.y));
    tile.entities.map(e => e.checkEdges(map));
    map.getNeighbors(tile.x, tile.y).forEach(tile2 => {
      tile2.entities.map(e => e.checkEdges(map));
    });
  }

  clearGraphics() {
    this.spriteList.forEach(sprite => sprite.remove());
    this.spriteList = [];
  }

  addLayer(addActions) {
    const { cursorPoint } = this.tileSelector;
    const { map, brush } = this.tool;
    const { type } = brush;
    const actionQueue = this.actionQueue;

    const startPoint = this.startPoint;
    const endPoint = cursorPoint;

    const width = Math.abs(startPoint.x - endPoint.x) + 1;
    const height = Math.abs(startPoint.y - endPoint.y) + 1;
    const smallestX = startPoint.x < endPoint.x ? startPoint.x : endPoint.x;
    const smallestY = startPoint.y < endPoint.y ? startPoint.y : endPoint.y;

    if (!this.addOnEnd) {
      this.addOnEnd = () => {
        this.addLayer(true);
        this.addOnEnd = null;
      }
    }

    this.clearGraphics();
    if (!(type in HIGHLIGHT_FILTERS)) {
      return;
    }
    if (addActions) {
      loopXbyX(smallestX, smallestY, width, height, (x, y) => {
        const tile = map.getTile(x, y);
        const entities = tile.findEntities({action: type});
        entities.forEach(entity => {
          actionQueue.addWork(entity, type);
        });
      });
      return;
    }

    const newSpriteList = [];
    loopXbyX(smallestX, smallestY, width, height, (x, y) => {
      const tile = map.getTile(x, y);
      let tileTexture = HIGHLIGHT_FILTERS[type](tile);
      const texture = SHEETS['colors'].getTexture(tileTexture); 
      const sprite = LAYERS['overlay'].createSprite(texture, x, y);
      newSpriteList.push(sprite);
    });
    this.spriteList = newSpriteList;
  }

  updateMap(onMouseDown) {
    if (!this.tool)
      return;
    const { map, brush } = this.tool;
    const { cursorPoint } = this.tileSelector;
    if (!brush)
      return;
    const { type } = brush;
    let tile = null;
    if (onMouseDown) {
      this.startPoint = {
        x: cursorPoint.x, 
        y: cursorPoint.y,
      }
    }
    if (cursorPoint) {
      tile = map.getTile(cursorPoint.x, cursorPoint.y);
    }
    if (!tile) return;
    if (!type) return;
    if (type === 'delete') {
      tile.entities.forEach(entity => entity.remove());
      return;
    }

    if (brush.target === 'tile') {
      this.addTile(tile);
    } else if (brush.target === 'entity') {
      this.addEntity(tile);
    } else {
      this.addLayer();
    }
  }
  
  init() {
    const mouse = Mouse.getMouse();
    mouse.addOnClickDown(this.onMouseDown);
    mouse.addOnClickUp(this.onMouseUp);
    this.tileSelector.addOnMouseMove(this.onMouseMove);
  }

  remove() {
    const mouse = Mouse.getMouse();
    mouse.removeOnClickDown(this.onMouseDown);
    mouse.removeOnClickUp(this.onMouseUp);
    this.clearGraphics();
    this.tileSelector.removeOnMouseMove(this.onMouseMove)
  }

}