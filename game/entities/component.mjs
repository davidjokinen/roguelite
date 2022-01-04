
export default class Component {
  constructor() {
    this.parent_ = null;
    this.tickComponent = false;
  }

  destroy() {
  }

  setParent(p) {
    this.parent_ = p;
  }

  initComponent() {}
  
  initEntity() {}

  getComponent(n) {
    return this.parent_.getComponent(n);
  }

  get world() {
    return this.parent_.world;
  }

  get parent() {
    return this.parent_;
  }

  findEntity(n) {
    return this.parent_.findEntity(n);
  }

  broadcast(m) {
    this.parent_.broadcast(m);
  }

  Update(_) {}

  _RegisterHandler(n, h) {
    this.parent_._RegisterHandler(n, h);
  }
};
