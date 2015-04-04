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

function getBond(adata1, adata2, bdata) {
  var bonds = new THREE.Object3D();

  var point1 = new THREE.Vector3(adata1.x, adata1.y, adata1.z);
  var point2 = new THREE.Vector3(adata2.x, adata2.y, adata2.z);
  var path = new THREE.Line3(point1, point2);

  var points = [point1, point2];
  var atoms = [adata1, adata2];

  for(var i = 0; i < 2; i++) {
    var adata = atoms[i];
    var pointX = points[i];
    var pointY = path.center();
    var material = new THREE.MeshLambertMaterial({color: new THREE.Color(adata.atom.color)});
    var direction = new THREE.Vector3().subVectors(pointY, pointX);
    var orientation = new THREE.Matrix4();
    orientation.lookAt(pointX, pointY, new THREE.Object3D().up);
    orientation.multiply(new THREE.Matrix4().set(1, 0, 0, 0,
                                                 0, 0, 1, 0,
                                                 0, -1, 0, 0,
                                                 0, 0, 0, 1));
    var radius = 0.20;
    var geom = new THREE.CylinderGeometry(radius, radius, direction.length(), 32, 32);
    var bond = new THREE.Mesh(geom, material);
    bond.applyMatrix(orientation);
    var line = new THREE.Line3(pointX, pointY);
    bond.position = line.center();
    bonds.add(bond);
  }

  return bonds;
}

function getAtom(adata, opacity) {
  var mat = new THREE.MeshLambertMaterial({color: new THREE.Color(adata.atom.color), transparent: true, opacity: opacity});
  var geom = new THREE.SphereGeometry(1, 32, 32);
  var atom = new THREE.Mesh(geom, mat);
  atom.position.set(adata.x, adata.y, adata.z);
  return atom;
}

function getMolStructure(molData, options) {
  var structure = new THREE.Object3D();
  for(var i in molData.atoms) {
    var adata = molData.atoms[i];
    var atom = getAtom(adata, options.opacity);
    structure.add(atom);
  }

  for(var i in molData.bonds) {
    var bdata = molData.bonds[i];
    var adata1 = molData.atoms[bdata.a - 1];
    var adata2 = molData.atoms[bdata.b - 1];
    var bond = getBond(adata1, adata2, bdata);
    structure.add(bond);
  }

  return structure;
}

function Controls(scene) {
  var structure, moldata;
  var molform = document.getElementById('molform');
  var molfile = document.getElementById('molfile');

  var $this = this;

  var updateFn = function() {
    if (moldata) {
      if (structure) {
        scene.remove(structure);
      }
      structure = getMolStructure(moldata, $this);
      scene.add(structure);
    }
  };

  this.load = function() {
    molfile.click();
  };

  this.opacity = 0.90;

  this.update = function() {
    updateFn.call($this);
  };

  this.upload = function() {
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
          moldata = data;
          updateFn.call($this);
        }
      });
    }
  };
}

function createScene() {
  controls = new Controls(scene);
  gui = new dat.GUI();
  gui.add(controls, 'load').name('Load File');
  gui.add(controls, 'opacity', 0.05, 1.00).name('Opacity').step(0.05).listen();
  gui.add(controls, 'update').name('Update');

  // lots of lights to illuminate the molecule well
  var lights = [{x: 50}, {y: 50}, {z: 50}, {x: -50}, {y: -50}, {z: -50}];
  for(var i in lights) {
    var l = lights[i];
    var light = new THREE.PointLight(0xFFFFFF, 1, 1000);
    scene.add(light);
    light.position.set(l.x || 0, l.y || 0, l.z || 0);
  }
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
  camera.position.set(20, 20, 0);
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
