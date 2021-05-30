import DefaultScene from './default-scene';

import React from 'react';
import Title from '../ui/pages/title';

export default class TitleScreen extends DefaultScene {


  init() {
    super.init();
    this.sceneComponent = <Title {...this.getUiProps()}/>;
    this.drawUI();
  }
}