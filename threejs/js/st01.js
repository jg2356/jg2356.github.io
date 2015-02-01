/***********
 * st01.js
 * A blue square
 * J. Gomez
 * January 31, 2014
 ***********/

var camera, scene, renderer;
var cameraControls;
var clock = new THREE.Clock();

// begin: ST.1
// challenge: Write a program that produces a blue square.
function createScene() {
  // square geometry
  var size = 10;
  var geom = new THREE.Geometry();
  geom.vertices.push(new THREE.Vector3(0, 0, 0.1));
  geom.vertices.push(new THREE.Vector3(0, size, 0.1));
  geom.vertices.push(new THREE.Vector3(size, size, 0.1));
  geom.vertices.push(new THREE.Vector3(size, 0, 0.1));

  // two triangle faces are needed to draw a square
  var face_bt = new THREE.Face3(0, 1, 2);
  var face_tp = new THREE.Face3(0, 3, 2);
  geom.faces.push(face_tp);
  geom.faces.push(face_bt);

  // blue basic mesh material
  var mat = new THREE.MeshBasicMaterial( {color: 0x0011FA, side: THREE.DoubleSide })

  // create our mesh
  var mesh = new THREE.Mesh(geom, mat);

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
  renderer.setClearColor(0xFFFFFF, 1.0);

  // set the camera position for looking at our blue box centered
  // and point the camera at our target
  var target = new THREE.Vector3(5, 5, 0);
  camera = new THREE.PerspectiveCamera(40, canvasRatio, 1, 1000);
  camera.lookAt(target);
  camera.position.set(5, 5, 40);
  cameraControls = new THREE.OrbitControls(camera, renderer.domElement);
  cameraControls.target = target;
  cameraControls.center = target;
}
// end: ST.1

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
