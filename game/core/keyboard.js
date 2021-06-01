let keyboard = null;

export default class Keyboard {
	constructor() {
		this.key = [];
		for(let i =0;i<255;i++)
			this.key[i] = false;
		this._keyEventId = 0;
		this._onKeyDown = {};
		this._onKeyUp = {};
	}

	onKeyDown(down) {
		const newKeyID = this._keyEventId;
		this._onKeyDown[newKeyID] = down;
		this._keyEventId++;
		return newKeyID;
	}

	removeOnKeyDown(keyId) {
		if (keyId in this._onKeyDown) {
			delete this._onKeyDown[keyId];
		}
	}

	onKeyUp(up) {
		const newKeyID = this._keyEventId;
		this._onKeyUp[newKeyID] = up;
		this._keyEventId++;
		return newKeyID;
	}

	removeOnKeyUp(keyId) {
		if (keyId in this._onKeyUp) {
			delete this._onKeyUp[keyId];
		}
	}

	static getKeyboard() {
		if (!keyboard) {
			keyboard = new Keyboard();
			keyboard.init();
		}
		return keyboard;
	}

	init() {
		window.addEventListener('keydown', (e)=>{this.keydown(e)}, false);
		window.addEventListener('keyup', (e)=>{this.keyup(e)}, false);
	}

	keydown(e){
		if (e.target.nodeName === "INPUT") {
			return;
		}
		Object.values(this._onKeyDown).forEach(down => down(e));
		const code = e.keyCode;
		if(code < 0)return;
		if(code > 255)return;

		this.key[code] = true;
	}

	keyup(e){
		const list = Object.values(this._onKeyUp).reverse();
		for (let i=0;i<list.length;i++) {
			const up = list[i];
			const out = up(e);
			if (out === false) {
				return;
			}
		}
		const code = e.keyCode;
		if(code < 0)return;
		if(code > 255)return;

		this.key[code] = false;
	}

}
