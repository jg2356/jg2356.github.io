/***********
 * mc04.js
 * Author: Jose Gomez
 * February 27, 2014
 ***********/

var camera, scene, renderer;
var cameraControls;
var clock = new THREE.Clock();

// begin: Challenge MC.4

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

function createScene() {
  var mat = new THREE.MeshLambertMaterial({color: 'blue'});
  var geom = new THREE.SphereGeometry(1, 12, 12);
  var mesh = new THREE.Mesh(geom, mat);
  var helix = createHelix(mesh, 49, 2, Math.PI / 4, 0.5);

  scene.add(helix);

  // lights
  var light = new THREE.PointLight(0xFFFFFF, 1, 1000);
  light.position.set(-200, 200, 200);
  var ambientLight = new THREE.AmbientLight(0x222222);
  scene.add(light);
  scene.add(ambientLight);
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
  camera.position.set(0, 0, 40);
  camera.lookAt(target);
  cameraControls = new THREE.OrbitControls(camera, renderer.domElement);
  cameraControls.target = target;
  cameraControls.center = target;
}

// end: MC.4

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
