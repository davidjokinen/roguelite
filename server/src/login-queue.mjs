
class FiniteStateMachine {
  constructor(onEvent) {
    this.currentState = null;
    this.onEvent = onEvent;
  }

  get State() {
    return this.currentState;
  }

  broadcast(evt) {
    this.onEvent(evt);
  }

  onMessage(evt, data) {
    return this.currentState.onMessage(evt, data);
  }

  setState(state) {
    const prevState = this.currentState;

    if (prevState) {
      prevState.onExit();
    }

    this.currentState = state;
    this.currentState.parent = this;
    state.onEnter(prevState);
  }
}

class State {
  constructor() {}

  broadcast(evt) {
    this.parent.broadcast(evt);
  }

  onEnter() {}

  onMessage() {}

  onExit() {}
}

class Login_Await extends State {
  constructor() {
    super();
    this._params = {};
  }

  onMessage(evt, data) {
    if (evt != 'login.commit') {
      return false;
    }
    this._params.accountName = data;
    this.parent.setState(new Login_Confirm(this._params))

    return true;
  }
}

class Login_Confirm extends State {
  constructor(params) {
    super();
    this._params = {...params};
  }

  onEnter() {
    this.broadcast({topic: 'login.complete', params: this._params});
  }

  onMessage() {
    return true;
  }
}

class LoginClient {
  constructor(client, onLogin) {
    this.onLogin = onLogin;

    client.onMessage = (e, d) => this.onMessage(e, d);

    this._stateMachine = new FiniteStateMachine((e) => { this.onEvent(e) });
    this._stateMachine.setState(new Login_Await());
  }

  onEvent(evt) {
    this.onLogin(evt.params);
  }

  onMessage(topic, data) {
    return this._stateMachine.onMessage(topic, data);
  }
}

export default class LoginQueue {
  constructor(onLogin) {
    this._clients = {};
    this._onLogin = onLogin;
  }

  add(client) {
    this._clients[client.ID] = new LoginClient(client, e => {
      this._onLogin(client, e);
    });
  }

  onLogin(client, params) {
    delete this._clients[client.ID];

    this._onLogin(client, params);
  }
}

// module.exports = LoginQueue;