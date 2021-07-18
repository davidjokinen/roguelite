import { PREFORM_ACTION_RESULT } from './base-action';
import BaseEntityAction from './base-entity-action';
import Entity from '../entities/entity';


export default class ChopAction extends BaseEntityAction {
  constructor(target) {
    super(target);
    this.id = 'chop';
  }

  perform(entity, map, entities) {
    const output = super.perform(entity, map, entities);
    if (output)
      return output;
    // this.cuttingTime = null;
    this.target.remove();
    map.addEntity(new Entity('wood-pile', this.target.x, this.target.y));
    return PREFORM_ACTION_RESULT.FINISHED_SUCCESS;
  }
}