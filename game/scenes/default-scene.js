import React from 'react';
import ReactDOM from 'react-dom';

export default class DefaultScene {
  constructor() {
    this.sceneComponent = null;
    this.changeScene = this.changeScene.bind(this);
    this.components = [];
    this.componentMap = {};
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

  addComponent(com) {
    com.init();
    if (com.id) {
      this.componentMap[com.id] = com;
    }
    this.components.push(com);
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
      components: this.componentMap,
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
    this.components.forEach(com => com.remove());
  }
}