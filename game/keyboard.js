let keyboard = null;

export default class Keyboard {
	constructor() {
		this.key = [];
		for(let i =0;i<255;i++)
			this.key[i] = false;
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
		const code = e.keyCode;
		// console.log(e.target, code)
		if(code < 0)return;
		if(code > 255)return;

		this.key[code] = true;
	}

	keyup(e){
		const code = e.keyCode;
		if(code < 0)return;
		if(code > 255)return;

		this.key[code] = false;
	}

}
