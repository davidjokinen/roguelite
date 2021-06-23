import regeneratorRuntime from "regenerator-runtime";

import * as THREE from 'three';;
import * as Stats from 'stats.js';
import Mouse from "./core/mouse";
import { enableCameraMovement } from './core/camera.js';
import TestScene from './scenes/test-scene';
import TitleScreen from './scenes/title-screen';
import PauseScreen from './scenes/pause-screen';
import { Texture, TextureMap, GroupMeshHandler, Sprite } from 'simple2d';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 30, window.innerWidth / window.innerHeight, 1, 1000 );
camera.position.x = 75;
camera.position.y = 75;
camera.position.z = 60;

const handler = GroupMeshHandler.getRootHandler();
handler.scene = scene;
handler.setDefaultZ(0);

const renderer = new THREE.WebGLRenderer({
  alpha : true,
  // preserveDrawingBuffer : false,
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

var stats = new Stats();
stats.showPanel( 1 ); // 0: fps, 1: ms, 2: mb, 3+: custom
document.body.appendChild( stats.dom );
stats.dom.style.right = '0px';
stats.dom.style.left = 'initial';

let gameScene = new TitleScreen(camera);
const changeScene = (id) => {
  const sceneMap = {
    'title': TitleScreen,
    'game': TestScene,
    'pause': PauseScreen,
  }
  let newScene = null
  if (typeof id === 'string') {
    newScene = new sceneMap[id]();
  } else {
    newScene = id;
  }
  const oldScene = gameScene;
  gameScene = newScene;
  gameScene._changeScene = changeScene;
  gameScene.camera = camera;
  const remove = gameScene.focusScene(oldScene);
  if (oldScene && remove) {
    oldScene.remove();
  }
}

changeScene('game');
const gameLoop = function () {
  stats.begin();
  requestAnimationFrame( gameLoop );

  gameScene.update();
  gameScene.render();

  handler.checkMeshes();
  renderer.render( scene, camera );
  stats.end();
};


gameLoop();