/***********
 * ot01.js
 * A program starburst(n, innerColor, outerColor) that renders a starburst of lines of length 2.
 * J. Gomez
 * January 31, 2014
 ***********/

var camera, scene, renderer;
var cameraControls;
var clock = new THREE.Clock();

// begin: OT.1
// challenge: Write a program starburst(n, innerColor, outerColor) that renders a starburst of lines of length 2.
function starburst(n, innerColor, outerColor) {
  // constant values used to calculate segments
  var radius = 2;
  var thetaStart = 0;
	var thetaLength = Math.PI * 2;

  // the starburst is centered at the origin
	var center = new THREE.Vector3(0, 0, 0);

  // create the lines
	for(var i = 0; i <= n; i ++) {
    // get the current segment
    var segment = thetaStart + i / n * thetaLength;
    // get the line length, randomly generated to get the burst effect, with a maximum of radius = 2 and min = 1
    var length = Math.random() * radius + 1;
    // get our end point coordinates
    var x = length * Math.cos(segment);
		var y = length * Math.sin(segment);

    // create our vertex to paint the line
		var vertex = new THREE.Vector3(x, y, 0);

    // create the line geometry using the calculated vertex
    var geom = new THREE.Geometry();
    geom.vertices.push(center.clone());
		geom.vertices.push(vertex);

    // push the line colors
    geom.colors.push(innerColor);
    geom.colors.push(outerColor);

    // render the line
    var mat = new THREE.LineBasicMaterial({vertexColors: true, linewidth: 1});
    var line = new THREE.Line(geom, mat, THREE.LineStrip);
    scene.add(line);
	}
}

function createScene() {
  // starburst geometry
  var red = new THREE.Color(0xFF0000);
  var green = new THREE.Color(0x00FF00);

  starburst(200, red, green);
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

  // set the camera position for looking at our starburst
  // and point the camera at our target
  var target = new THREE.Vector3(0, 0, 0);
  camera = new THREE.PerspectiveCamera(40, canvasRatio, 1, 1000);
  camera.position.set(0, 0, 10);
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
