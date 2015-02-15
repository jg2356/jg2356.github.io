/***********
 * sc01.js
 * Write a program that renders a cube in which colors are assigned on a per-vertex basis.
 * J. Gomez
 * February 13, 2014
 ***********/

var camera, scene, renderer;
var cameraControls;
var clock = new THREE.Clock();

// begin: SC.1
// challenge: Write a program that renders a cube in which colors are assigned on a per-vertex basis.
function createCube(vertexColors) {
  var size = 10;
  var geom = new THREE.CubeGeometry(size, size, size);

  var mat = new THREE.MeshBasicMaterial({vertexColors: THREE.VertexColors, side: THREE.DoubleSide});

  for(var i = 0; i < geom.faces.length; i++) {
    var va = geom.faces[i].a;
    var vb = geom.faces[i].b;
    var vc = geom.faces[i].c;
    geom.faces[i].vertexColors.push(new THREE.Color(vertexColors[va]));
    geom.faces[i].vertexColors.push(new THREE.Color(vertexColors[vb]));
    geom.faces[i].vertexColors.push(new THREE.Color(vertexColors[vc]));
  }

  // create our mesh
  return new THREE.Mesh(geom, mat);
}

function createScene() {
  // vertex colors
  var colors = ["red", "red", "green", "green", "blue", "blue", "magenta", "magenta"];

  // call createCube with our vertex colors
  var mesh = createCube(colors);

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
// end: SC.1

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
