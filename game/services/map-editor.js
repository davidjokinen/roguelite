import BaseService from './base-service';
import Mouse from '../core/mouse';
import Entity from '../entities/entity';

// This is the service that the react components talk to to draw on the map.
export default class MapEditor extends BaseService {

  constructor(tileSelector) {
    super();
    this.id = 'map-editor';
    this.tileSelector = tileSelector;

    this.brush = null;

    this.mouse = Mouse.getMouse();
    this.onMouseDown = () => {
      if (this.mouse.buttons[0]) {
        this.updateMap();
      }
    };
    this.onMouseMove = this.onMouseMove.bind(this);
  }

  onMouseMove() {
    if (this.mouse.buttons[0]) {
      this.updateMap();
    }
  }

  updateMap() {
    if (!this.tool)
      return;
    const { map, brush } = this.tool;
    const { cursorPoint } = this.tileSelector;
    if (!brush)
      return;
    const { type } = brush;
    let tile = null;
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
      if (tile.data.id === type)
        return;
      tile.updateType(type);
      if (type === 'water')
        tile.entities.forEach(entity => entity.remove());
      tile.checkEdges(map);
      map.getNeighbors(tile.x, tile.y).forEach(tile2 => {
        tile2.checkEdges(map)
      });
    } else if (brush.target === 'entity') {
      if (tile.data.id === 'water')
        return;
      tile.entities.forEach(entity => entity.remove());
      map.addEntity(new Entity(type, tile.x, tile.y));
      tile.entities.map(e => e.checkEdges(map));
      map.getNeighbors(tile.x, tile.y).forEach(tile2 => {
        tile2.entities.map(e => e.checkEdges(map));
      });
    }
  }
  
  init() {
    const mouse = Mouse.getMouse();
    mouse.addOnClickDown(this.onMouseDown);
    this.tileSelector.addOnMouseMove(this.onMouseMove);
  }

  remove() {
    const mouse = Mouse.getMouse();
    mouse.removeOnClickDown(this.onMouseDown);
    this.tileSelector.removeOnMouseMove(this.onMouseMove)
  }

}