 
let mouse = null;

export default class Mouse {
	constructor(div) {
		this.x = 0;
		this.y = 0;
		this.mousedown = false;
		
		this.div = div;

		this.onClick = [];
		this.onMove = [];
		this.onZoom = [];
		this.onClickDown = [];
		this.onClickUp = [];

		this.buttons = [];
		for(let i=0;i<8;i++) {
			this.buttons[i] = false;
		}
	}

	static getMouse(div) {
		if (!mouse) {
			mouse = new Mouse(div);
			mouse.init();
		}
		return mouse;
	}

	touch2Mouse(e) {
		let screenX = 0;
		let screenY = 0;
		let clientX = 0;
		let clientY = 0;
		for (let i=0;i<1;i++) {
			
			screenX += e.changedTouches[i].screenX;
			screenY += e.changedTouches[i].screenY;
			clientX += e.changedTouches[i].clientX;
			clientY += e.changedTouches[i].clientY;
		}

		var mouseEv;
		var mouseEvent = document.createEvent("MouseEvent");
		mouseEvent.initMouseEvent(mouseEv, true, true, window, 1, screenX, screenY, clientX, clientY, false, false, false, false, 0, null);
		// theTouch.target.dispatchEvent(mouseEvent);
		switch(e.type)
		{
			case "touchstart": this.mousedownCanvas(mouseEvent); break;  
			case "touchend":   this.mouseupCanvas(mouseEvent); break;
			case "touchmove":  this.mousemoveCanvas(mouseEvent); break;
			default: return;
		}
		//e.preventDefault();
	}

	init() {
		this.div.addEventListener('mousedown', (e)=>{this.mousedownCanvas(e);}, false);
		this.div.addEventListener('mouseup', (e)=>{this.mouseupCanvas(e)}, false);
		this.div.addEventListener('mousemove', (e)=>{this.mousemoveCanvas(e)}, false);
		this.div.addEventListener('mousewheel', (e)=>{this.mousewheelCanvas(e)}, false);

		this.div.addEventListener("touchstart", this.touch2Mouse.bind(this), true);
		this.div.addEventListener("touchmove", this.touch2Mouse.bind(this), true);
		this.div.addEventListener("touchend", this.touch2Mouse.bind(this), true);
		// this.div.addEventListener('touchstart', (e)=>{this.mousedownCanvas(e)}, false);
		// this.div.addEventListener('touchend', (e)=>{this.mouseupCanvas(e)}, false);
		// this.div.addEventListener('touchmove', (e)=>{this.mousemoveCanvas(e)}, false);
		// this.div.addEventListener('mousewheel', (e)=>{this.mousewheelCanvas(e)}, false);
	}

	addOnClickDown(event){
		return this.onClickDown.push(event);
	}

	addOnClickUp(event){
		return this.onClickUp.push(event);
	}

	addOnClick(event){
		return this.onClick.push(event);
	}

	addOnMove(event){
		return this.onMove.push(event);
	}

	addOnZoom(event){
		return this.onZoom.push(event);
	}

	removeOnClickDown(event) {
		const index = this.onClickDown.indexOf(event);
		if (index < -1) return;
		this.onClickDown.splice(index, 1); 
	}

	removeOnClickUp(event) {
		const index = this.onClickUp.indexOf(event);
		if (index < -1) return;
		this.onClickUp.splice(index, 1); 
	}

	removeOnClick(event) {
		const index = this.onClick.indexOf(event);
		if (index < -1) return;
		this.onClick.splice(index, 1); 
	}

	removeOnMove(event) {
		const index = this.onMove.indexOf(event);
		if (index < -1) return;
		this.onMove.splice(index, 1); 
	}

	removeOnZoom(event) {
		const index = this.onZoom.indexOf(event);
		if (index < -1) return;
		this.onZoom.splice(index, 1); 
	}

	mousedownCanvas(e) {   
		this.buttons[e.button] = true;
		for(let i in this.onClickDown)
			this.onClickDown[i](e);
		for(let i in this.onMove)
			this.onMove[i](e);
	}

	mouseupCanvas(e) {
		this.buttons[e.button] = false;
		for(let i in this.onClickUp)
			this.onClickUp[i](e);
	}

	mousemoveCanvas(e) {
		this.x = e.pageX;
		this.y = e.pageY;
		for(let i in this.onMove)
			this.onMove[i](e);
	}

	mousewheelCanvas(e) {
		for(let i in this.onZoom)
			this.onZoom[i](e);
	}
}
