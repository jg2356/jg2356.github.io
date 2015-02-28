/***********
 * mc01.js
 * Author: Jose Gomez
 * February 27, 2014
 ***********/

var camera, scene, renderer;
var cameraControls;
var clock = new THREE.Clock();

// begin: Challenge MC.1

function create3DCubeMatrix(a, b, c, offset) {
  var matrix = new THREE.Object3D();
  var offset = offset !== undefined ? offset : 2.0;
  var geom = new THREE.CubeGeometry(1, 1, 1);
  var mat = new THREE.MeshLambertMaterial({color: 0x00FF00, shading: THREE.FlatShading, side: THREE.DoubleSide, opacity: 0.75, transparent: true});
  var xMin = -offset * ((a-1) / 2.0);
  var yMin = -offset * ((b-1) / 2.0);
  var zMin = -offset * ((c-1) / 2.0);
  for (var i = 0, x = xMin; i < a; i++, x += offset) {
    for (var j = 0, y = yMin; j < b; j++, y += offset) {
      for (var k = 0, z = zMin; k < c; k++, z += offset) {
        var box = new THREE.Mesh(geom, mat)
        box.position.x = x;
        box.position.y = y;
        box.position.z = z;
        matrix.add(box);
      }
    }
  }
  return matrix;
}

function createScene() {
  var cube = create3DCubeMatrix(10, 10, 10, 2.0);
  scene.add(cube);
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
  var target = new THREE.Vector3(0, 0, 0);
  camera = new THREE.PerspectiveCamera(40, canvasRatio, 1, 1000);
  camera.position.set(-50, 40, -35);
  camera.lookAt(target);
  cameraControls = new THREE.OrbitControls(camera, renderer.domElement);
  cameraControls.target = target;
  cameraControls.center = target;
}

// end: MC.1

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
