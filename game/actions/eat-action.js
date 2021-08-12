import { PREFORM_ACTION_RESULT } from './base-action';
import BaseEntityAction from './base-entity-action';


export default class EatAction extends BaseEntityAction {
  constructor(target) {
    super(target);
    this.id = 'eat';
  }

  perform(entity, map, entities) {
    const output = super.perform(entity, map, entities);
    if (output)
      return output;
    this.target.remove();
    return PREFORM_ACTION_RESULT.FINISHED_SUCCESS;
  }
}