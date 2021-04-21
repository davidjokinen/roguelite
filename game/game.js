import regeneratorRuntime from "regenerator-runtime";

import * as THREE from 'three';;
import Mouse from "./mouse";
import { enableCameraMovement } from './camera.js';
import TestScene from './scenes/test-scene'
import { Texture, TextureMap, GroupMeshHandler, Sprite } from 'simple2d';

import roguelikeSheet from './resources/roguelikeSheet_transparent.png';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 30, window.innerWidth / window.innerHeight, 1, 1000 );
camera.position.z = 30;

const handler = GroupMeshHandler.getRootHandler();
handler.scene = scene;
handler.setDefaultZ(0);

const renderer = new THREE.WebGLRenderer({
  alpha : true,
  preserveDrawingBuffer : false,
});
renderer.getPixelRatio(window.devicePixelRatio);
document.body.appendChild( renderer.domElement );
let mouse = Mouse.getMouse(renderer.domElement);
enableCameraMovement(camera, mouse);

const resizeCanvas = () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize( window.innerWidth/1, window.innerHeight/1, false);
}

window.addEventListener('resize', () => {
  resizeCanvas();
}, false);
resizeCanvas();


// const map = new Map();
// const e1 = new Entity(3, 3);
// const e2 = new Entity(0, 0);

// e1.attack(e2);
// console.log(e1);
// console.log(e2); 

const gameScene = new TestScene(camera);
gameScene.init();
const gameLoop = function () {
  requestAnimationFrame( gameLoop );

  // if (Math.random() > .95) {
  //   const moveX = ~~(Math.random()*3)-1;
  //   const moveY = ~~(Math.random()*3)-1;
  //   e1.move(moveX, moveY);
  // }
  gameScene.update();
  gameScene.render();
  // if (Math.random() > .95)
    // map.update();
  // map.render();

  handler.checkMeshes();
  renderer.render( scene, camera );
};


gameLoop();