import React from 'react';

import Paper from '@material-ui/core/Paper';

export default class TileSelector extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selecting: null,
      x: 0,
      y: 0,
    };

    this.updateMouse = this.updateMouse.bind(this);
  }

  componentDidMount() {
    const { components } = this.props;
    const tileSelector = components['tile-selector'];
    tileSelector.addOnMouseMove(this.updateMouse);
    this.updateMouse();
  }

  componentWillUnmount() {
    const { components } = this.props;
    const tileSelector = components['tile-selector'];
    tileSelector.removeOnMouseMove(this.updateMouse);
  }

  updateMouse() {
    this.setState(function(state, props) {
      const { components, map } = props;
      const tileSelector = components['tile-selector'];
      // 
      if (!tileSelector) return;
      const { cursorPoint } = tileSelector;
      let tile = null;
      if (cursorPoint) {
        tile = map.getTile(cursorPoint.x, cursorPoint.y);
      }
      return {
        x: cursorPoint.x,
        y: cursorPoint.y,
        tile: tile,
      };
    });
  }

  render() {
    const { x, y, tile } = this.state;
    const style = {
      padding: '5px',
      margin: '10px',
      width: '150px'
    }
    let tileSection = null;
    let entitySection = [];
    if (tile) {
      
      if (tile.entities) {
        entitySection = tile.entities.map(entity => {
          return <p key={entity.data.id}>Entity: {entity.data.id}</p>
        });
      }
      tileSection = <p>Tile ID: {tile.data.id}</p>;
    }
    return (
      <Paper style={style}>
        {entitySection}
        {tileSection}
        <p>Mouse at: {x}, {y}</p>
      </Paper>
    );
  }
}