/***********
 * hgg01.js
 * Write a function createStairs(riser, tread, width, nbrSteps) that returns a geometry for stairs made of nbrSteps many steps,
 * where each step has specified width, and whose riser rises riser units and whose tread treads tread units (of course)
 * J. Gomez
 * February 13, 2014
 ***********/

var camera, scene, renderer;
var cameraControls;
var clock = new THREE.Clock();

// begin: HGG.1
// challenge:
// Stairs are made up of a series of steps, and each step is made up of a riser and a tread.
// The riser is the vertical part of the step and the tread is the horizontal part you step on (as labeled in the image below).
// Write a function createStairs(riser, tread, width, nbrSteps) that returns a geometry for stairs made of nbrSteps many steps,
// where each step has specified width, and whose riser rises riser units and whose tread treads tread units (of course), and
// use your function in a program to render stairs.
function createStairs(riser, tread, width, nbrSteps) {
  var geom = new THREE.Geometry();
  // create the initial two vertices, the base of the stairs
  geom.vertices.push(new THREE.Vector3(0, 0, 0));
  geom.vertices.push(new THREE.Vector3(0, 0, width));

  //steps
  for (var i = 0; i < nbrSteps; i++) {
    // get the last two vertices added, the base of the current step
    var ol = geom.vertices[geom.vertices.length - 2];
    var or = geom.vertices[geom.vertices.length - 1];

    // create four vertices, rising and then treading on each side (l, r)
    var v1 = new THREE.Vector3(ol.x, ol.y + riser, ol.z);
    var v2 = new THREE.Vector3(or.x, or.y + riser, or.z);
    var v3 = new THREE.Vector3(ol.x + tread, ol.y + riser, ol.z);
    var v4 = new THREE.Vector3(or.x + tread, or.y + riser, or.z);
    geom.vertices.push(v1, v2, v3, v4);

    // create the faces using the last 6 vertices added to our geometry
    var vi = geom.vertices.length;
    geom.faces.push(new THREE.Face3(vi - 6, vi - 5, vi - 4));
    geom.faces.push(new THREE.Face3(vi - 5, vi - 4, vi - 3));
    geom.faces.push(new THREE.Face3(vi - 4, vi - 3, vi - 2));
    geom.faces.push(new THREE.Face3(vi - 3, vi - 2, vi - 1));
  }

  geom.computeFaceNormals();

  return geom;
}

function createScene() {
  var geom = createStairs(1, 2, 4, 5);

  // red lambert material, which is affected by lights
  var mat = new THREE.MeshLambertMaterial({color: 0xFF0000, shading: THREE.FlatShading, side: THREE.DoubleSide});

  // create our mesh
  var mesh = new THREE.Mesh(geom, mat);

  // lights
  var light = new THREE.PointLight(0xFFFFFF, 1, 1000);
  light.position.set(-15, 8, 2);
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
  camera.position.set(-15, 20, 20);
  camera.lookAt(target);
  cameraControls = new THREE.OrbitControls(camera, renderer.domElement);
  cameraControls.target = target;
  cameraControls.center = target;
}
// end: HGG.2

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
