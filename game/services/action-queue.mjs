import BaseService from './base-service.mjs';

export class ActionBlueprint {
  constructor(entity, action) {
    this.entity = entity;
    this.action = action;

    this.sprite = null;
    this.init();
  }

  init() {
    // Graphics for client
  }

  remove() {
    // Graphics for client
  }
}

export default class ActionQueue extends BaseService {
  constructor() {
    super();
    this.id = 'action-queue';

    this.workList = [];
  }

  init() {

  }

  remove() {

  }

  addWork(entity, action) {
    this.workList.push(new ActionBlueprint(entity, action));
  }

  getWork(entity) {
    return this.workList.shift();
  }

  update() {

  }

}