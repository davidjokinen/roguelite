import Component from '../component';
import Mouse from '../core/mouse';

// This is the service that the react components talk to to draw on the map.
export default class MapEditor extends Component {

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
    if (!this.brush)
      return;
    const { map, selectedOption } = this.brush;
    const { cursorPoint } = this.tileSelector;
    if (!selectedOption)
      return;
    let tile = null;
    if (cursorPoint) {
      tile = map.getTile(cursorPoint.x, cursorPoint.y);
    }
    if (tile) {
      if (tile.data.id === selectedOption)
        return;
      tile.updateType(selectedOption); 
      tile.entities.forEach(entity => entity.remove());
      tile.checkEdges(map);
      map.getNeighbors(tile.x, tile.y).forEach(tile2 => {
        tile2.checkEdges(map)
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