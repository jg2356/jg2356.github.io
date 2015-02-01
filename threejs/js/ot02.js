/***********
 * ot02.js
 * A program ruledCylinder(n, color) that returns the line mesh of a ruled n-sided cylinder of given color.
 * J. Gomez
 * January 31, 2014
 ***********/

var camera, scene, renderer;
var cameraControls;
var clock = new THREE.Clock();

// begin: OT.2
// challenge: Write a program ruledCylinder(n, color) that returns the line mesh of a ruled n-sided cylinder of given color.
function ruledCylinder (n, color) {
  // create the cylinder geometry
  var geom = new THREE.CylinderGeometry(2, 2, 5, n, n, true);

  // create the cylinder mesh
  var mat = new THREE.MeshBasicMaterial();
  var mesh = new THREE.Mesh(geom, mat);

  // use the edges helper to outline only the edges of our geometry
  var egh = new THREE.EdgesHelper(mesh, color);
  egh.material.linewidth = 2;

  return egh;
}

function createScene() {
  var red = new THREE.Color(0xFF0000);

  var mesh = ruledCylinder(10, red);

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
  // set the clear color to black
  renderer.setClearColor(0x000000, 1.0);

  // set the camera position for looking at our cylinder
  // and point the camera at our target
  var target = new THREE.Vector3(0, 0, 0);
  camera = new THREE.PerspectiveCamera(40, canvasRatio, 1, 1000);
  camera.position.set(3, 9, 12);
  camera.lookAt(target);
  cameraControls = new THREE.OrbitControls(camera, renderer.domElement);
  cameraControls.target = target;
  cameraControls.center = target;
}
// end: OT.1

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
