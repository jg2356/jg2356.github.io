/***********
 * final.js
 * Final Project
 * J. Gomez
 * April 4, 2014
 ***********/

var camera, scene, renderer;
var controls, gui;
var cameraControls;
var clock = new THREE.Clock();

function getMolStructure(molData) {
  var structure = new THREE.Object3D();
  for(var i in molData.atoms) {
    var data = molData.atoms[i];
    var mat = new THREE.MeshLambertMaterial({color: new THREE.Color(data.atom.color)});
    var geom = new THREE.SphereGeometry(1, 32, 32);
    var atom = new THREE.Mesh(geom, mat);
    atom.position.x = data.x;
    atom.position.y = data.y;
    atom.position.z = data.z;
    structure.add(atom);
  }
  return structure;
}

function Controls() {
  var structure;
  var molform = document.getElementById('molform');
  var molfile = document.getElementById('molfile');

  this.select = function() {
    molfile.click();
  };

  this.update = function() {
    if (molfile.value) {
      $.ajax({
        url: 'http://localhost:3000/api/molfile',
        type: 'POST',
        data: new FormData(molform),
        async: true,
        cache: false,
        contentType: false,
        enctype: 'multipart/form-data',
        processData: false,
        success: function (data) {
          if (structure) {
            scene.remove(structure);
          }
          structure = getMolStructure(data);
          scene.add(structure);
        }
      });
    }
  };
}

function createScene() {
  controls = new Controls();
  gui = new dat.GUI();
  gui.add(controls, 'select');

  // lots of lights to illuminate the molecule well
  var light0 = new THREE.PointLight(0xFFFFFF, 1, 1000);
  light0.position.set(50, 0, 0);
  scene.add(light0);
  var light1 = new THREE.PointLight(0xFFFFFF, 1, 1000);
  light1.position.set(0, 50, 0);
  scene.add(light1);
  var light2 = new THREE.PointLight(0xFFFFFF, 1, 1000);
  light2.position.set(0, 0, 50);
  scene.add(light2);
  var ambientLight = new THREE.AmbientLight(0x222222);
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
  renderer.setClearColor(0x000000, 1.0);

  // set the camera position
  // and point the camera at our target
  var target = new THREE.Vector3(0, 0, 0);
  camera = new THREE.PerspectiveCamera(40, canvasRatio, 1, 1000);
  camera.position.set(-15, 20, 20);
  camera.lookAt(target);
  cameraControls = new THREE.OrbitControls(camera, renderer.domElement);
  cameraControls.target = target;
  cameraControls.center = target;
}

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

init();
createScene();
addToDOM();
render();
animate();
