import React from 'react';
import ReactDOM from 'react-dom';

export default class DefaultScene {
  constructor() {
    this.sceneComponent = null;
    this.changeScene = this.changeScene.bind(this);
    this._inited = false;
  }

  changeScene(sceneId) {
    // Set outside
    if (!this._changeScene) {
      console.error('Change scene is missing')
      return;
    }
    return this._changeScene(sceneId);
  }

  init() {
    this._inited = true;
  }

  focusScene(oldScene) {
    if (!this._inited)
      this.init();
    else 
      this.drawUI();
    return true;
  }

  getUiProps() {
    return {
      changeScene: this.changeScene,
    };
  }

  drawUI() {
    const sceneId = 'scene-container';
    const { sceneComponent } = this;
    if (!document.getElementById(sceneId)) {
      const newDiv = document.createElement("div");
      newDiv.id = sceneId;
      document.body.appendChild(newDiv);
    }
    if (sceneComponent) {
      ReactDOM.render(
        sceneComponent,
        document.getElementById(sceneId)
      );
    }
  }

  update() {

  }

  render() {
    
  }

  remove() {

  }
}