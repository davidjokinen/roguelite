import DefaultScene from './default-scene';

import React from 'react';
import Pause from '../ui/pages/pause';

export default class PauseScreen extends DefaultScene {

  focusScene(oldScene) {
    this.pausedScene = oldScene;
    super.focusScene(oldScene);
    return false;
  }

  init() {
    const returnToGame = () => {
      const pausedScene = this.pausedScene;
      this.pausedScene = null;
      return pausedScene;
    }
    this.sceneComponent = <Pause {...this.getUiProps()} backToGame={returnToGame}/>;
    this.drawUI();
  }

  remove() {
    if (this.pausedScene)
      this.pausedScene.remove();
  }
}