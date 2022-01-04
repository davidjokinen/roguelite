import Entity from './entity.mjs';


import getScript from './get-script-client.mjs';
import GraphicComponent from './components/graphic-component.mjs';

export default class EntityClient extends Entity {
  constructor() {
    super(...arguments);

    this.addComponent(new GraphicComponent());
  }

  get getScript() {
    return getScript;
  }

  updateType(newType) {
    super.updateType(newType);

    this.getComponent('GraphicComponent').updateType(map);
  }

  checkEdges(map) {
    this.getComponent('GraphicComponent').checkEdges(map);
  }

  render() {
    const graphicComponent = this.getComponent('GraphicComponent');
    if (graphicComponent)
      graphicComponent.render();
  }

  update(map, entities) {
    super.update(map, entities);
    const graphicComponent = this.getComponent('GraphicComponent');
    if (graphicComponent)
      graphicComponent.update();
  }

}