/***********
 * st02.js
 * An open red box
 * J. Gomez
 * January 31, 2014
 ***********/

var camera, scene, renderer;
var cameraControls;
var clock = new THREE.Clock();

// begin: ST.2
// challenge: Write a program that renders an open red box.
function createScene() {
  // box geometry, i took a different approach here, by starting with a box geometry and then removing the to top faces
  // it took a bit of trying to find out which faces corresponded with the two top faces, effectively creating an open box
  var size = 10;
  var geom = new THREE.BoxGeometry(size, size, size);
  geom.faces.splice(4, 2);

  // red lambert material, which is affected by lights
  var mat = new THREE.MeshLambertMaterial({color: 0xFF0000, shading: THREE.FlatShading, side: THREE.DoubleSide});

  // create our mesh
  var mesh = new THREE.Mesh(geom, mat);

  // lights
  var light = new THREE.PointLight(0xFFFFFF, 1, 1000);
  light.position.set(0, 25, 40);
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
  // set the clear color to black, for our open box scene
  renderer.setClearColor(0x000000, 1.0);

  // set the camera position for looking at our open box
  // and point the camera at our target
  var target = new THREE.Vector3(0, 0, 0);
  camera = new THREE.PerspectiveCamera(40, canvasRatio, 1, 1000);
  camera.position.set(-15, 30, 20);
  camera.lookAt(target);
  cameraControls = new THREE.OrbitControls(camera, renderer.domElement);
  cameraControls.target = target;
  cameraControls.center = target;
}
// end: ST.2

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
