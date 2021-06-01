import React from 'react';

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
  }

  componentWillUnmount() {
    const { components } = this.props;
    const tileSelector = components['tile-selector'];
    tileSelector.removeOnMouseMove(this.updateMouse);
  }

  updateMouse() {
    this.setState(function(state, props) {
      const { components } = props;
      const tileSelector = components['tile-selector'];
      if (!tileSelector) return;
      const { cursorPoint } = tileSelector;
      return {
        x: cursorPoint.x,
        y: cursorPoint.y,
      };
    });
  }

  render() {
    const { x, y } = this.state;
    return (
      <div>
        Mouse at: {x}, {y}
      </div>
    );
  }
}