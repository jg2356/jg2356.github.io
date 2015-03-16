/***********
 * ba02.js
 * Author: Jose Gomez
 * March 15, 2014
 ***********/

var camera, scene, renderer;
var cameraControls;
var clock = new THREE.Clock();

// begin: Challenge BA.2

function makeSatellite(root, node, distance, secondsPerRevolution, angularOffset) {
  node.theta = 0 + angularOffset;
  node.rotate = function (delta) {
    var rotation = 2 * Math.PI / secondsPerRevolution;
    node.theta += (rotation * delta);
    if (node.theta >= 2*Math.PI)
      node.theta -= 2*Math.PI;
    node.position.x = root.position.x + distance * Math.cos(node.theta);
    node.position.y = root.position.y + distance * Math.sin(node.theta);
  }
  node.rotate(0);
}

function rotateSatellites(system, delta) {
  for(var i = 0; i < system.children.length; i++) {
    var child = system.children[i];
    if (child.rotate) {
      child.rotate(delta);
    }
    rotateSatellites(child, delta);
  }
}

function createScene() {
  var sunMat = new THREE.MeshLambertMaterial({color: 'yellow'});
  var sunGeom = new THREE.SphereGeometry(10, 20, 20);
  var sun = new THREE.Mesh(sunGeom, sunMat);

  var earthMat = new THREE.MeshLambertMaterial({color: 'blue'});
  var earthGeom = new THREE.SphereGeometry(2, 20, 20);
  var earth = new THREE.Mesh(earthGeom, earthMat);

  var moonMat = new THREE.MeshLambertMaterial({color: 'white'});
  var moonGeom = new THREE.SphereGeometry(1, 20, 20);
  var moon = new THREE.Mesh(moonGeom, moonMat);

  makeSatellite(sun, earth, 30, 13, 0);
  makeSatellite(earth, moon, 5, 1, 0);

  var system = new THREE.Object3D();
  system.add(sun);
  system.add(earth);
  system.add(moon);

  scene.add(system);
}

function render() {
  var delta = clock.getDelta();

  rotateSatellites(scene, delta);

  cameraControls.update(delta);
  renderer.render(scene, camera);
}

function animate() {
  window.requestAnimationFrame(animate);
  render();
}

// end: BA.2

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
  light.position.set(-20, -10, 40);
  var ambientLight = new THREE.AmbientLight(0x222222);
  scene.add(light);
  scene.add(ambientLight);

  // set the camera position for looking at our open box
  // and point the camera at our target
  var target = new THREE.Vector3(0, 0, 0);
  camera = new THREE.PerspectiveCamera(40, canvasRatio, 1, 1000);
  camera.position.set(0, -70, 70);
  camera.lookAt(target);
  cameraControls = new THREE.OrbitControls(camera, renderer.domElement);
  cameraControls.target = target;
  cameraControls.center = target;
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
  throw e;
}
