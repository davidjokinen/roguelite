import * as THREE from 'three';
import BaseService from './base-service.mjs';

import Mouse from '../core/mouse.mjs';

export default class TileSelector extends BaseService {
  constructor(camera) {
    super();
    this.id = 'tile-selector';
    this.camera = camera;
    this.raycaster = new THREE.Raycaster();
    this.mousePoint = new THREE.Vector2();
    this.plane = new THREE.Plane( new THREE.Vector3( 0, 0, 1 ),  -1 );
    this.cursorPoint = {
      x: 0,
      y: 0,
      rawX: 0,
      rawY: 0,
    };

    this._onMouseMove = [];
    this.onMouseMove = this.onMouseMove.bind(this);
  }

  onMouseMove(event) {
    const {
      raycaster,
      mousePoint,
      plane,
      cursorPoint,
      camera,
    } = this;
    mousePoint.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    mousePoint.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
    
    raycaster.setFromCamera( mousePoint, camera );
    
    var intersects = new THREE.Vector3();
    raycaster.ray.intersectPlane( plane, intersects );

    let x = ~~intersects.x;
    let y = ~~intersects.y;
    if (intersects.x<0) x-=1;
    if (intersects.y<0) y-=1;
    if (cursorPoint.x !== x || cursorPoint.y !== y) {
      cursorPoint.x = x;
      cursorPoint.y = y;
      cursorPoint.rawX = intersects.x;
      cursorPoint.rawY = intersects.y;
      this._onMouseMove.forEach(event => event(cursorPoint));
    }
  }

  addOnMouseMove(event) {
    return this._onMouseMove.push(event);
  }

  removeOnMouseMove(event) {
    const index = this._onMouseMove.indexOf(event);
		if (index < -1) return;
		this._onMouseMove.splice(index, 1); 
  }

  init() {
    const mouse = Mouse.getMouse();
    mouse.addOnMove(this.onMouseMove);
  }

  remove() {
    const mouse = Mouse.getMouse();
    mouse.removeOnMove(this.onMouseMove);
  }
}