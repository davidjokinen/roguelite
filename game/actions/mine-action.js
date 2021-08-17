import { PREFORM_ACTION_RESULT } from './base-action';
import BaseEntityAction from './base-entity-action';
import Entity from '../entities/entity';


export default class MineAction extends BaseEntityAction {
  constructor(target) {
    super(target);
    this.id = 'mine';
    this.actionName = {
      presentTense: 'mining',
      default: 'mine'
    };
  }

  perform(entity, map, entities) {
    const output = super.perform(entity, map, entities);
    if (output)
      return output;
    this.target.remove();
    map.addEntity(new Entity('stone-pile', this.target.x, this.target.y));
    return PREFORM_ACTION_RESULT.FINISHED_SUCCESS;
  }
}