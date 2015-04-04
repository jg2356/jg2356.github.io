/***********
 * final.js
 * Final Project
 * J. Gomez
 * April 4, 2014
 ***********/

var camera, scene, renderer;
var cameraControls;
var clock = new THREE.Clock();

function createScene() {
  var geom = new THREE.BoxGeometry(10, 10, 10);

  // red lambert material, which is affected by lights
  var mat = new THREE.MeshLambertMaterial({color: 0xFF0000, shading: THREE.FlatShading, side: THREE.DoubleSide});

  // create our mesh
  var mesh = new THREE.Mesh(geom, mat);

  // lights
  var light = new THREE.PointLight(0xFFFFFF, 1, 1000);
  light.position.set(-15, 8, 2);
  var ambientLight = new THREE.AmbientLight(0x222222);
  scene.add(light);
  scene.add(ambientLight);

  // add to the scene
  scene.add(mesh);
}

function init() {
  var canvasWidth = window.innerWidth;
  var canvasHeight = window.innerHeight;
  var canvasRatio = canvasWidth / canvasHeight;

  scene = new THREE.Scene();

  renderer = new THREE.WebGLRenderer({antialias : true, preserveDrawingBuffer: true});
  renderer.gammaInput = true;
  renderer.gammaOutput = true;
  renderer.setSize(canvasWidth, canvasHeight);
  renderer.setClearColor(0x000000, 1.0);

  // set the camera position
  // and point the camera at our target
  var target = new THREE.Vector3(0, 0, 0);
  camera = new THREE.PerspectiveCamera(40, canvasRatio, 1, 1000);
  camera.position.set(-15, 20, 20);
  camera.lookAt(target);
  cameraControls = new THREE.OrbitControls(camera, renderer.domElement);
  cameraControls.target = target;
  cameraControls.center = target;
}

function animate() {
  window.requestAnimationFrame(animate);
  render();
}

function render() {
  var delta = clock.getDelta();
  cameraControls.update(delta);
  renderer.render(scene, camera);
}

function addToDOM() {
  var container = document.getElementById('container');
  var canvas = container.getElementsByTagName('canvas');
  if (canvas.length>0) {
    container.removeChild(canvas[0]);
  }
  container.appendChild( renderer.domElement );
}

init();
createScene();
addToDOM();
render();
animate();
