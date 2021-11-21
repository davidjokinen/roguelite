import DefaultScene from './default-scene.mjs';

import React from 'react';
import Pause from '../ui/pages/pause';

import Keyboard from '../core/keyboard';

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
    const keyboard = Keyboard.getKeyboard();
    this.onKeyEvent = keyboard.onKeyDown((e) => {
      const code = e.keyCode;
      if (code === 27) {
        this.changeScene(returnToGame());
        return false;
      }
    });
    this.sceneComponent = <Pause {...this.getUiProps()} backToGame={returnToGame}/>;
    this.drawUI();
  }

  remove() {
    console.log('remove Pause')
    const keyboard = Keyboard.getKeyboard();
    keyboard.removeOnKeyDown(this.onKeyEvent);
    if (this.pausedScene)
      this.pausedScene.remove();
  }
}