import Component from "../component.mjs";
import { PREFORM_ACTION_RESULT } from '../../actions/base-action.mjs';

export default class ActionComponent extends Component {
  constructor() {
    super();
    this.id = 'ActionComponent';
    this.action = null;
    this.script = null;
    this.actionQueue = [];

    this._onActionUpdateList = [];
    this._onEntityUpdate = [];

    this.socketActionList = [];
  }

  initComponent() {
    const parent = this.parent;
    if (!parent.getScript) {
      console.error(parent);
      return;
    }
    if (parent.data && parent.data.script) {
      if (parent.data.script.main) {
        const scriptClass = parent.getScript(parent.data.script.main);
        if (scriptClass) {
          this.script = new scriptClass();
          this.script.start(this);
          parent._isUpdateEntity = true;
          this.tickComponent = true;
        } else {
          console.log(`no script loaded "${this.data.script.main}"`)
        }
      }
    }

    parent.addOnEntityUpdate = (a) => this.addOnEntityUpdate(a);
    parent.removeOnEntityUpdate = (a) => this.removeOnEntityUpdate(a);
    parent.actionUpdate = (a) => this.actionUpdate(a);
    parent.onActionUpdate = (a) => this.onActionUpdate(a);
    parent.addSocketAction = (a) => this.addSocketAction(a);
    parent.queueAction = (a) => this.queueAction(a);
  }

  destroy() {
    if (this.script) {
      this.script.end(this);
      this.script = null;
    }
  }

  _onActionUpdate() {
    this._onEntityUpdate.forEach(action => action());
  }

  addOnEntityUpdate(action) {
    this._onEntityUpdate.push(action);
  }

  removeOnEntityUpdate(action) {
    const index = this._onEntityUpdate.indexOf(action);
		if (index < -1) return;
		this._onEntityUpdate.splice(index, 1); 
  }

  actionUpdate(action) {
    this._onActionUpdateList.forEach(event => event(action));
  }

  onActionUpdate(event) {
    this._onActionUpdateList.push(event);
  }

  addSocketAction(action) {
    this.socketActionList.push(action)
    if (this.socketActionList.length > 1)
      this.socketActionList.shift();
  }

  queueAction(action, isImportant) {
    isImportant = false
    if (isImportant && this.action) {
      this.action.cancel();
    }
    this.actionQueue.push(action);
  }

  update(map, entities) {
    const parent = this.parent;
    const { SERVER_UPDATE } = parent;
    if (SERVER_UPDATE) {
      if (this.socketActionList.length > 0) {
        this.socketAction = this.socketActionList.shift();
      }
      if (this.socketAction) {
        const actionResult = this.socketAction.perform(parent, map, entities);
        if (actionResult !== PREFORM_ACTION_RESULT.ACTIVE) {
          this.socketAction = null;
        }
      }
      if (this.script) {
        this.script.update(parent, map, entities);
      }
      return;
    }
    // This will change more later. In the future Actions will queue up and the script will be able to cancel actions.
    if (!this.action && this.actionQueue.length > 0) {
      this.action = this.actionQueue.shift();
      // console.log('New action ',Date.now());
      this.actionUpdate(this.action);
      // TODO: cleanup _onActionUpdate
      this._onActionUpdate();
    } else if (!this.action && this.script) {
      const action = this.script.update(parent, map, entities);
      // console.log(action)
      if (action) {
        this.action = action;
        this.actionUpdate(action);
        // TODO: cleanup _onActionUpdate
        this._onActionUpdate();
      }
    }
    if (this.action) {
      const hasSubAction = !!this.action.subAction;
      const actionResult = this.action.perform(parent, map, entities);
     
      if (hasSubAction !== !!this.action.subAction)
        this._onActionUpdate();
      if (actionResult !== PREFORM_ACTION_RESULT.ACTIVE) {
        // console.log('Action done')
        this.lastAction = this.action;
        this.lastActionResult = actionResult;
        this.action.finally();
        this.action = null;
      } else {
        return;
      }
    }
  }
}