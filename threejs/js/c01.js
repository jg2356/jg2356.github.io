/***********
 * c01.js
 * Author: Jose Gomez
 * March 15, 2014
 ***********/

var camera, scene, renderer;
var cameraControls;
var clock = new THREE.Clock();

// begin: Challenge C.1

function createHelix(obj, n, radius, angle, dist) {
  var helix = new THREE.Object3D();
  for (var i = 0; i < n; i++) {
    // clone
    var hobj = obj.clone();
    // reset
    hobj.position.x = radius * Math.cos(angle * i);
    hobj.position.y = radius * Math.sin(angle * i);
    hobj.position.z = dist * i;
    helix.add(hobj);
  }
  return helix;
}

function createFloor(x, y) {
  var shape = new THREE.Shape();
  shape.moveTo(0, 0);
  shape.lineTo(0, y);
  shape.lineTo(x, y);
  shape.lineTo(x, 0);
  shape.lineTo(0, 0);
  var geom = new THREE.ShapeGeometry(shape);
  var mat = new THREE.MeshLambertMaterial({color: 'gray'});
  return new THREE.Mesh(geom, mat);
}

function randomBoxes(nbrBoxes, minSide, maxSide, minHeight, maxHeight) {
  var boxes = new THREE.Object3D();
  for (var i = 0; i < nbrBoxes; i++) {
    var box = new THREE.BoxGeometry(
  }
}

function createScene() {
  var floor = createFloor(200, 200);

  scene.add(floor);
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
  // set the clear color to black, for our open box scene
  renderer.setClearColor(0x000000, 1.0);

  // lights
  var light = new THREE.PointLight(0xFFFFFF, 1, 1000);
  light.position.set(-200, 200, 200);
  var ambientLight = new THREE.AmbientLight(0x222222);
  scene.add(light);
  scene.add(ambientLight);

  // set the camera position for looking at our open box
  // and point the camera at our target
  var target = new THREE.Vector3(100, 100, 0);
  camera = new THREE.PerspectiveCamera(40, canvasRatio, 1, 1000);
  camera.position.set(100, -250, 250);
  camera.lookAt(target);
  cameraControls = new THREE.OrbitControls(camera, renderer.domElement);
  cameraControls.target = target;
  cameraControls.center = target;
}

// end: C.1

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


try {
  init();
  createScene();
  addToDOM();
  render();
  animate();
} catch(e) {
  var errorMsg = "Error: " + e;
  document.getElementById("msg").innerHTML = errorMsg;
}
