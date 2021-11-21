
export const PREFORM_ACTION_RESULT = {
  'ACTIVE': 'ACTIVE',
  'ACTIVE_UPDATE': 'ACTIVE_UPDATE',
  'FINISHED_SUCCESS': 'FINISHED_SUCCESS',
  'FINISHED_FAIL': 'FINISHED_FAIL',
  'CANCELLED': 'CANCELLED',
}

export class Action {
  constructor() {
    this.id = 'action';
    this.completed = false;
    this.cancelable = false;
    this.subAction = null;
    this.subActionResult = null;

    this.cancelled = false;
  }

  import() {

  }

  export() {

  }

  setSubAction(entity, action) {
    this.subAction = action;
    entity.actionUpdate(action);
  }

  performSubAction(entity, map, entities) {
    if (this.subAction) {
      this.subActionResult = this.subAction.perform(entity, map, entities);
      if (this.subActionResult !== PREFORM_ACTION_RESULT.ACTIVE) {
        this.subAction = null;
        return false
      } else {
        return true;
      }
    }
    return false;
  }

  perform() {
    return PREFORM_ACTION_RESULT.FINISHED_SUCCESS;
  }

  cancel() {
    this.cancelled = true;
  }

  finally() {

  }
}