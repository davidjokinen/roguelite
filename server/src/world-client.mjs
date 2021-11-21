


export default class WorldClient {
  constructor(parent, client, params, onDisconnectAction) {
    this.parent = parent;
    this._client = client;
    this.params = params;
    this._onDisconnectAction = onDisconnectAction;

    this._client.onMessage = this.onMessage.bind(this);
    this._client.onDisconnect = this.onDisconnect.bind(this);

    this._eventTriggerMap = {};
  }

  get ID() {
    // console.log('aa ', this._socket)
    return this._client.ID;
  }

  send(evt, data) {
    this._client.send(evt, data);
  }

  destory() {

  }

  onEntityEvent(t, d) {

  }

  addOnMessage(key, callback) {
    this._eventTriggerMap[key] = callback;
  }

  removeOnMessage(key) {
    delete this._eventTriggerMap[key]
  }

  onDisconnect() {
    this._onDisconnectAction();
  }

  onMessage(evt, data) {
    if (evt in this._eventTriggerMap) {
      this._eventTriggerMap[evt](evt, data)
      return true;
    }
    if (evt in this.parent.eventTriggerMap) {
      this.parent.eventTriggerMap[evt](this._client, evt, data)
      return true;
    }
    if (evt == 'world.update') {
      this._entity.updateTransform(data);
      return true;
    }

    if (evt == 'chat.msg') {
      this._client.send('chat.msg', data);
      return true;
    }

    return false;
  }
  
}

// module.exports = WorldClient;