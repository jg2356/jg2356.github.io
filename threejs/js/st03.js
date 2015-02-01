/***********
 * st03.js
 * An javascript function that returns a Geometry object that represents an n-sided regular polygon.
 * J. Gomez
 * January 31, 2014
 ***********/

var camera, scene, renderer;
var cameraControls;
var clock = new THREE.Clock();

// begin: ST.3
// challenge: Write a Javascript function regularPolygonGeometry(n, innerColor, outerColor) that returns a Geometry object that represents an n-sided regular polygon.
function regularPolygonGeometry(n, innerColor, outerColor) {
  // I started working on this assignment by writing a loop that would calculate the each vertex using sine/cosine functions
  // but quickly realized that the CircleGeometry actually draws a circle by drawing n triangles with a given radius, which is
  // centered at the origin and lies in the xy plane (textbook what I needed)
  // so I started with a CircleGeometry of radius 2 and n segments, and modified its faces to have vertex colors

  var geom = new THREE.CircleGeometry(2, n);
  for(var i = 0; i < geom.faces.length; i++) {
    geom.faces[i].vertexColors.push(outerColor);
    geom.faces[i].vertexColors.push(outerColor);
    geom.faces[i].vertexColors.push(innerColor);
  }
  return geom;
}

function createScene() {
  // polygon geometry
  var red = new THREE.Color(0xFF0000);
  var blue = new THREE.Color(0x0000FF);
  var geom = regularPolygonGeometry(8, red, blue);

  // our basic material
  var mat = new THREE.MeshBasicMaterial({vertexColors: THREE.VertexColors, side: THREE.DoubleSide });

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
  // set the clear color to black
  renderer.setClearColor(0x000000, 1.0);

  // set the camera position for looking at our polygon
  // and point the camera at our target
  var target = new THREE.Vector3(0, 0, 0);
  camera = new THREE.PerspectiveCamera(40, canvasRatio, 1, 1000);
  camera.position.set(0, 0, 10);
  camera.lookAt(target);
  cameraControls = new THREE.OrbitControls(camera, renderer.domElement);
  cameraControls.target = target;
  cameraControls.center = target;
}
// end: ST.3

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
