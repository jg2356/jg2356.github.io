/***********
 * ba01.js
 * Author: Jose Gomez
 * March 15, 2014
 ***********/

var camera, scene, renderer;
var cameraControls, guiControls;
var clock = new THREE.Clock();

// begin: Challenge BA.1

function randomFloat(min, max) {
  return Math.random() * (max - min) + min;
}

function create2DCubeMatrix(a, b, offset, mat) {
  var matrix = new THREE.Object3D();
  var offset = offset !== undefined ? offset : 2.0;
  var geom = new THREE.CubeGeometry(1, 1, 1);
  var xMin = -offset * ((a-1) / 2.0);
  var yMin = -offset * ((b-1) / 2.0);
  for (var i = 0, x = xMin; i < a; i++, x += offset) {
    for (var j = 0, y = yMin; j < b; j++, y += offset) {
      var box = new THREE.Mesh(geom, mat)
      box.position.x = x;
      box.position.y = y;
      box.position.z = 0;
      matrix.add(box);
    }
  }
  return matrix;
}

function Controls(mat) {
  this.rate = 0.5;
  this.opacity = 0.8;

  var hue = 0.05;
  var timer = 0;

  this.update = function(delta) {
    timer += delta;
    if (timer >= this.rate) {
      timer = 0;
      if (hue >= 1) {
        hue = 0;
      }
      hue += 0.05;
      mat.color.setHSL(hue, 0.8, 0.5);
      mat.opacity = this.opacity;
    }
  }
}

function createScene() {
  var mat = new THREE.MeshLambertMaterial({color: new THREE.Color().setHSL(0.05, 0.8, 0.5),
                                           shading: THREE.FlatShading,
                                           side: THREE.DoubleSide,
                                           opacity: 0.8,
                                           transparent: true});

  guiControls = new Controls(mat);
  var gui = new dat.GUI();
  gui.add(guiControls, 'rate', 0.1, 10).step(0.1).listen();
  gui.add(guiControls, 'opacity', 0.1, 1.0).step(0.1).listen();
  scene.add(guiControls);

  var cube = create2DCubeMatrix(10, 10, 2.0, mat);
  scene.add(cube);
}

function render() {
  var delta = clock.getDelta();

  guiControls.update(delta);

  cameraControls.update(delta);
  renderer.render(scene, camera);
}

function animate() {
  window.requestAnimationFrame(animate);
  render();
}

// end: BA.1

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

  // lights
  var light = new THREE.PointLight(0xFFFFFF, 1, 1000);
  light.position.set(-20, -10, 40);
  var ambientLight = new THREE.AmbientLight(0x222222);
  scene.add(light);
  scene.add(ambientLight);

  // set the camera position for looking at our open box
  // and point the camera at our target
  var target = new THREE.Vector3(0, 0, 0);
  camera = new THREE.PerspectiveCamera(40, canvasRatio, 1, 1000);
  camera.position.set(0, -25, 25);
  camera.lookAt(target);
  cameraControls = new THREE.OrbitControls(camera, renderer.domElement);
  cameraControls.target = target;
  cameraControls.center = target;
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
  throw e;
}
