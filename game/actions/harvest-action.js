import { PREFORM_ACTION_RESULT } from './base-action';
import BaseEntityAction from './base-entity-action';
import Entity from '../entities/entity';


export default class HarvestAction extends BaseEntityAction {
  constructor(target) {
    super(target);
    this.id = 'harvest';
    this.actionName = {
      presentTense: 'harvesting',
      default: 'harvest'
    };
  }

  perform(entity, map, entities) {
    const output = super.perform(entity, map, entities);
    if (output)
      return output;
    let tile = map.findEmptyTile(this.target.x, this.target.y);
    if (tile)
      map.addEntity(new Entity('berry-pile', tile.x, tile.y));
    return PREFORM_ACTION_RESULT.FINISHED_SUCCESS;
  }
}