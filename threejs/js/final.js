/***********
 * final.js
 * Final Project
 * J. Gomez
 * April 4, 2014
 ***********/

var camera, scene, renderer, controls, cameraControls;
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
    var bradius = radius*bdata.bond.type;
    var geom = new THREE.CylinderGeometry(bradius, bradius, direction.length(), 32, 32);
    var bond = new THREE.Mesh(geom, material);
    bond.applyMatrix(orientation);
    var line = new THREE.Line3(pointX, pointY);
    bond.position = line.center();
    bonds.add(bond);
  }

  bonds.data = bdata.bond;
  return bonds;
}

function getAtom(adata, opacity) {
  var mat = new THREE.MeshLambertMaterial({color: new THREE.Color(adata.atom.color), transparent: true, opacity: opacity});
  var geom = new THREE.SphereGeometry(1, 32, 32);
  var atom = new THREE.Mesh(geom, mat);
  atom.position.set(adata.x, adata.y, adata.z);

  atom.data = adata.atom;
  return atom;
}

function getMolStructure(moldata, options) {
  var structure = new THREE.Object3D();
  structure.atoms = [];
  structure.bonds = [];

  for(var i in moldata.atoms) {
    var adata = moldata.atoms[i];
    var atom = getAtom(adata, options.opacity);
    structure.add(atom);
    structure.atoms.push(atom);
  }

  for(var i in moldata.bonds) {
    var bdata = moldata.bonds[i];
    var adata1 = moldata.atoms[bdata.a - 1];
    var adata2 = moldata.atoms[bdata.b - 1];
    var bond = getBond(adata1, adata2, bdata);
    structure.add(bond);
    structure.bonds.push(bond);
  }

  return structure;
}

function Controls(scene, gui) {
  var structure, gui;
  var molform = document.getElementById('molform');
  var molfile = document.getElementById('molfile');
  var $this = this;

  this.opacity = 0.95;

  this.load = function() {
    molfile.click();
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
          if (data) {
            if (structure) {
              scene.remove(structure);
            }
            structure = getMolStructure(data, $this);
            scene.add(structure);
            $this.init();
          }
        }
      });
    }
  };

  this.init = function() {
    if (gui) {
      gui.destroy();
    }

    gui = new dat.GUI();
    gui.add($this, 'load').name('load mol file...');
    gui.add($this, 'opacity', 0.00, 1.00).name('atom opacity').step(0.05).onChange(function(value) {
      if (structure) {
        for(var i = 0; i < structure.atoms.length; i++) {
          var atom = structure.atoms[i];
          atom.material.opacity = value;
        }
      }
    });

    if (structure) {
      var folder = gui.addFolder('atom colors');
      folder.open();

      $this.colors = {};
      var forEachAtomColorKey = function(callback) {
        for(var i = 0; i < structure.atoms.length; i++) {
          var atom = structure.atoms[i];
          var ckey = 'atom_' + atom.data.number + '_color';
          callback(atom, ckey);
        }
      };
      forEachAtomColorKey(function(atom, ckey) {
        if (!$this.colors[ckey]) {
          var chex = '#' + atom.material.color.getHexString();
          $this.colors[ckey] = chex;
          folder.addColor($this.colors, ckey).name('[' + atom.data.symbol + ']' + atom.data.name).onChange(function() {
            forEachAtomColorKey(function(atom, ckey) {
              var chex = $this.colors[ckey];
              var cint = parseInt(chex.replace('#', ''), 16);
              atom.material.color.setHex(cint);
            });
          });
        }
      });
    }

    return $this;
  };
}

function createScene() {
  controls = new Controls(scene).init();

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
