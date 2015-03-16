/***********
 * c01.js
 * Author: Jose Gomez
 * March 15, 2014
 ***********/

var camera, scene, renderer;
var cameraControls;
var clock = new THREE.Clock();

// begin: Challenge C.1

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomFloat(min, max) {
  return Math.random() * (max - min) + min;
}

function createFloor(x, y) {
  var shape = new THREE.Shape();
  shape.moveTo(0, 0);
  shape.lineTo(0, y);
  shape.lineTo(x, y);
  shape.lineTo(x, 0);
  shape.lineTo(0, 0);
  var geom = new THREE.ShapeGeometry(shape);
  var mat = new THREE.MeshLambertMaterial({color: 'gray',
                                           shading: THREE.FlatShading,
                                           side: THREE.DoubleSide});
  return new THREE.Mesh(geom, mat);
}

function randomBoxes(nbrBoxes, minSide, maxSide, minHeight, maxHeight) {
  var boxes = new THREE.Object3D();
  for (var i = 0; i < nbrBoxes; i++) {
    var bx = randomInt(minSide, maxSide);
    var by = randomInt(minSide, maxSide);
    var bz = randomInt(minHeight, maxHeight);
    var geom = new THREE.BoxGeometry(bx, by, bz);
    var color = new THREE.Color().setHSL(randomFloat(0, 1),
                                         randomFloat(0.8, 0.95),
                                         randomFloat(0.3, 0.7));
    var mat = new THREE.MeshLambertMaterial({color: color,
                                             shading: THREE.FlatShading,
                                             side: THREE.DoubleSide,
                                             opacity: 0.8,
                                             transparent: true});
    var box = new THREE.Mesh(geom, mat);
    box.position.x = randomInt(0 + bx / 2, 200 - bx / 2);
    box.position.y = randomInt(0 + by / 2, 200 - by / 2);
    box.position.z = bz / 2;
    boxes.add(box);
  }
  var base = createFloor(200, 200);
  base.add(boxes);
  return base;
}

function createScene() {
  var boxes = randomBoxes(100, 5, 20, 5, 60);
  scene.add(boxes);
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
  // set the clear color to black
  renderer.setClearColor(0x000000, 1.0);

  // lights
  var light = new THREE.PointLight(0xFFFFFF, 1, 1000);
  light.position.set(-20, 20, 200);
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
