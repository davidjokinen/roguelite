import { PREFORM_ACTION_RESULT } from './base-action.mjs';
import BaseEntityAction from './base-entity-action.mjs';
import Entity from '../entities/entity.mjs';


export default class CutAction extends BaseEntityAction {
  constructor(target) {
    super(target);
    this.id = 'cut';
    this.actionName = {
      presentTense: 'cutting',
      default: 'cut'
    };
  }

  perform(entity, map, entities) {
    const output = super.perform(entity, map, entities);
    if (output)
      return output;
    this.target.destroy();
    // map.addEntity(new Entity('wood-pile', this.target.x, this.target.y));
    return PREFORM_ACTION_RESULT.FINISHED_SUCCESS;
  }
}