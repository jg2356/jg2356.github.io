/***********
 * mc02.js
 * Author: Jose Gomez
 * February 27, 2014
 ***********/

var camera, scene, renderer;
var cameraControls;
var clock = new THREE.Clock();

// begin: Challenge MC.2

function ziggurat(n, zheight, sf) {
  var zig = new THREE.Object3D();

  var x = 2;
  var z = 2;

  var mat_a = new THREE.MeshLambertMaterial({color: 0x0000FF, shading: THREE.FlatShading, side: THREE.DoubleSide, opacity: 0.75, transparent: true});
  var mat_b = new THREE.MeshLambertMaterial({color: 0xFF0000, shading: THREE.FlatShading, side: THREE.DoubleSide, opacity: 0.75, transparent: true});

  for (var i = 0; i < n; i++) {
    var geom = new THREE.BoxGeometry(x, zheight, z);
    var even = i % 2;
    var box = new THREE.Mesh(geom, (even == 0 ? mat_a : mat_b));
    box.position.y = i * zheight;
    zig.add(box);
    x = x * sf;
    z = z * sf;
  }
  return zig;
}

function createScene() {
  var zig = ziggurat(30, .2, .9);
  scene.add(zig);
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
  var target = new THREE.Vector3(0, 3, 0);
  camera = new THREE.PerspectiveCamera(40, canvasRatio, 1, 1000);
  camera.position.set(-10, 13, 7);
  camera.lookAt(target);
  cameraControls = new THREE.OrbitControls(camera, renderer.domElement);
  cameraControls.target = target;
  cameraControls.center = target;
}

// end: MC.2

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
