/***********
 * sg01.js
 * Author: Jose Gomez
 * February 27, 2014
 ***********/

var camera, scene, renderer;
var cameraControls;
var clock = new THREE.Clock();

// begin: Challenge SG.1

function Controls(options) {
  var options = options || {};
  var mesh = null;
  var defaults = {
    radius: 100,
    tube : 40,
    radialSegments: 20,
    tubularSegments: 20,
    arc: Math.PI * 2,
    wireframe: false
  };

  this.radius = options.radius || defaults.radius;
  this.tube = options.tube || defaults.tube;
  this.radialSegments = options.radialSegments || defaults.radialSegments;
  this.tubularSegments = options.tubularSegments || defaults.tubularSegments;
  this.arc = options.arc || defaults.arc;
  this.wireframe = options.wireframe || defaults.wireframe;
  this.Go = function() {
    // remove existing mesh if it exists
    if (mesh)
      scene.remove(mesh);
    // create the geometry
    var geom = new THREE.TorusGeometry(this.radius,
                                       this.tube,
                                       this.radialSegments,
                                       this.tubularSegments,
                                       this.arc);
    // lambert material, which is affected by lights
    var mat = new THREE.MeshLambertMaterial({color: "blue",
                                             shading: THREE.FlatShading,
                                             side: THREE.DoubleSide});
    mat.wireframe = this.wireframe;
    // create our mesh
    mesh = new THREE.Mesh(geom, mat);
    // add to the scene
    scene.add(mesh);
  }
}

function createScene() {
  var controls = new Controls();
  var gui = new dat.GUI();
  gui.add(controls, 'radius', 1, 200).step(1).listen();
  gui.add(controls, 'tube', 1, 100).step(1).listen();
  gui.add(controls, 'radialSegments', 8, 40).step(1).listen();
  gui.add(controls, 'tubularSegments', 8, 40).step(1).listen();
  gui.add(controls, 'arc', Math.PI, Math.PI * 4).step(Math.PI).listen();
  gui.add(controls, 'wireframe');
  gui.add(controls, 'Go');
  controls.Go();
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
  light.position.set(-100, -200, 200);
  var ambientLight = new THREE.AmbientLight(0x222222);
  scene.add(light);
  scene.add(ambientLight);

  // set the camera position for looking at our open box
  // and point the camera at our target
  var target = new THREE.Vector3(0, 0, 0);
  camera = new THREE.PerspectiveCamera(40, canvasRatio, 1, 1000);
  camera.position.set(0, -300, 300);
  camera.lookAt(target);
  cameraControls = new THREE.OrbitControls(camera, renderer.domElement);
  cameraControls.target = target;
  cameraControls.center = target;
}
// end: SG.1

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
