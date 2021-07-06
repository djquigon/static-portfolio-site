// threejs 
var scene, camera, fieldOfView, aspectRatio, nearPlane, farPlane, shadowLight, light, renderer, container;

// screen 
var HEIGHT, WIDTH, windowHalfX, windowHalfY, xLimit, yLimit;

// rocket body parts
var rocket, rocketBody, rocketTail, rocketTop;

// rocket speed
var rocketFastColor = {r:209, g:127, b:130}; // white with red tint
		rocketSlowColor = {r:255, g:255, b:255}; // white
    angleTail = 0; // angle used to move the rockettail

// array used to store a color scheme to randomly tint the asteroids 
var colors = ['#813124', '#2a1c0e', '#954535', '#8b4633', '#8B4513', '#A0522D', '#654321'];

// asteroids
var flyingParticles = []; 
		waitingParticles = [];
		maxParticlesZ = 600; 

// speed
var speed = {x:0, y:0};
var smoothing = 10;

// useful variables
var mousePos = {x:0, y:0};
var halfPI = Math.PI/2;

/**
 * Initializes three.js variables 
 */
function init(){
  // create the scene
  scene = new THREE.Scene();
  // create the camera
  HEIGHT = window.innerHeight;
  WIDTH = window.innerWidth;
  aspectRatio = WIDTH / HEIGHT;
  fieldOfView = 60;
  nearPlane = 1; // the camera won't "see" any object placed in front of this plane
  farPlane = 2000; // the camera wont't see any object placed further than this plane
  camera = new THREE.PerspectiveCamera(
    fieldOfView,
    aspectRatio,
    nearPlane,
    farPlane);
  camera.position.z = 1500;  
  //create the renderer 
  renderer = new THREE.WebGLRenderer({alpha: true, antialias: true });
  renderer.setSize(WIDTH, HEIGHT);
  container = document.getElementById('rocket-container');
  container.appendChild(renderer.domElement);

  // convert the field of view to radians
  var ang = (fieldOfView/2)* Math.PI / 180; 
  // calculate the max y position and max x position seen by the camera related to the maxParticlesZ position
  yLimit = (camera.position.z) * Math.tan(ang);
  xLimit = yLimit *camera.aspect;
   
  // precalculate the center of the screen, used to update the speed depending on the mouse position
  windowHalfX = WIDTH / 2;
  windowHalfY = HEIGHT / 2;
  
  // handling resize and mouse move events
  window.addEventListener('resize', onWindowResize, false);
  document.addEventListener('mousemove', handleMouseMove, false);
  document.addEventListener('touchstart', handleTouchStart, false);
	document.addEventListener('touchend', handleTouchEnd, false);
	document.addEventListener('touchmove',handleTouchMove, false);
}

/**
 * Adjust properties based on the size of the window.
 */
function onWindowResize() {
  HEIGHT = window.innerHeight;
  WIDTH = window.innerWidth;
  windowHalfX = WIDTH / 2;
  windowHalfY = HEIGHT / 2;
  renderer.setSize(WIDTH, HEIGHT);
  camera.aspect = WIDTH / HEIGHT;
  camera.updateProjectionMatrix();
  // recalculate the limits
 	var ang = (fieldOfView/2)* Math.PI / 180; 
  yLimit = (camera.position.z) * Math.tan(ang); 
  xLimit = yLimit *camera.aspect;
}

/**
 * Handles the start of the user touching the mouse or mousepad. 
 */
function handleMouseMove(event) {
  mousePos = {x:event.clientX, y:event.clientY};
  updateSpeed()
}

/**
 * Initializes three.js variables 
 */
function handleTouchStart(event) {
  if (event.touches.length > 1) {
    event.preventDefault();
		mousePos = {x:event.touches[0].pageX, y:event.touches[0].pageY};
    updateSpeed();
  }
}

/**
 * Handles the end of the user touching the mouse or mousepad. 
 */
function handleTouchEnd(event) {
    mousePos = {x:windowHalfX, y:windowHalfY};
    updateSpeed();
}

/**
 * Handles movement of mouse or touchpad.
 */
function handleTouchMove(event) {
  if (event.touches.length == 1) {
    event.preventDefault();
		mousePos = {x:event.touches[0].pageX, y:event.touches[0].pageY};
    updateSpeed();
  }
}

/**
 * Helper function that updates the speed of the rocket.
 */
function updateSpeed(){
  speed.x = (mousePos.x / WIDTH)*100;
  speed.y = (mousePos.y-windowHalfY) / 10;
}

/**
 * Constant loop that updates the rocket and asteroids position, color, speed, etc.
 */
function loop() {
  
  // Update rocket position, rotation, scale depending on the mouse position
  // currentValue += (targetValue - currentValue) / smoothing

  rocket.rotation.z += ((-speed.y/50)-rocket.rotation.z)/smoothing;
  rocket.rotation.x += ((-speed.y/50)-rocket.rotation.x)/smoothing;
  rocket.rotation.y += ((-speed.y/50)-rocket.rotation.y)/smoothing;

  rocket.position.x += (((mousePos.x - windowHalfX)) - rocket.position.x) / smoothing;
  rocket.position.y += ((-speed.y*10)-rocket.position.y)/smoothing;
  
  // used to update the rocket tail, the color of the rocket and the scale of the rocket
  var s2 = speed.x/100; // speed and color 
  var s3 = speed.x/500; // scale
  angleTail += s2+10;
  // precalculate sine and cosines
  var backTailCycle = Math.cos(angleTail);
  
  rocketTail.rotation.y = backTailCycle*.5;
  
  // color update depending on the speed
  var rvalue = (rocketSlowColor.r + (rocketFastColor.r - rocketSlowColor.r)*s2)/255;
  var gvalue = (rocketSlowColor.g + (rocketFastColor.g - rocketSlowColor.g)*s2)/255;
  var bvalue = (rocketSlowColor.b + (rocketFastColor.b - rocketSlowColor.b)*s2)/255;
  rocketBody.material.color.setRGB(rvalue,gvalue,bvalue);
  rocketTop.material.color.setRGB(rvalue,gvalue,bvalue);
  
  // scale update depending on the speed
  rocket.scale.set(0.5+s3,0.65-s3,0.5-s3);
  
  // asteroid update 
  for (var i=0; i<flyingParticles.length; i++){
    var particle = flyingParticles[i];
    particle.rotation.y += (1/particle.scale.x) *.05;
    particle.rotation.x += (1/particle.scale.x) *.05;
    particle.rotation.z += (1/particle.scale.x) *.05;
    particle.position.x += -10 -(1/particle.scale.x) * speed.x *.2;
    particle.position.y += (1/particle.scale.x) * speed.y *.2;
    if (particle.position.x < -xLimit - 80){ // check if the particle is out of the field of view
      scene.remove(particle);
      waitingParticles.push(flyingParticles.splice(i,1)[0]); // recycle the particle
      i--;
    }
  }
  renderer.render(scene, camera);
  requestAnimationFrame(loop);
}

/**
 * Creates a light object and adds it to the scene.
 */
function createLight() {
  light = new THREE.HemisphereLight(0xffffff, 0xffffff, .3)
  scene.add(light);
  shadowLight = new THREE.DirectionalLight(0xffffff, .8);
  shadowLight.position.set(1, 1, 1);
 	scene.add(shadowLight);
}

/**
 * Creates the 3D rocket object and adds it to the scene.
 */
function createRocket(){
  // group that contains each part of the rocket
  rocket = new THREE.Group();
  
  // rocket body 
  var bodyGeom = new THREE.CylinderGeometry(50, 50, 200);
 	var bodyMat = new THREE.MeshLambertMaterial({
    color: 0xffffff,
    shading: THREE.FlatShading
  });
  rocketBody = new THREE.Mesh(bodyGeom, bodyMat);
  rocketBody.scale.set(.5,.75,.5);
  rocketBody.rotation.z = 300;
  
  // rocket tail
  var tailGeom = new THREE.CylinderGeometry(0, 75, 100, 4, false);
 	var tailMat = new THREE.MeshLambertMaterial({
    color: 0xe25822,
    shading: THREE.FlatShading
  });
  
  rocketTail = new THREE.Mesh(tailGeom, tailMat);
  rocketTail.scale.set(.3,.75,.3);
  rocketTail.position.x = -60; 
  rocketTail.rotation.z = -halfPI;
    
  var topGeom = new THREE.CylinderGeometry(0, 60, 100,);
  var topMat = new THREE.MeshLambertMaterial({
    color: {r:0, g:0, b:0},
    shading: THREE.FlatShading
  });
  
  // rocket tip
  rocketTop = new THREE.Mesh(topGeom,topMat);
  rocketTop.scale.set(.5,.75,.5);
  rocketTop.position.x = 110;
  rocketTop.position.y = 0;
  rocketTop.position.z = 0;
  rocketTop.rotation.z = -halfPI;
  
  rocket.add(rocketBody);
  rocket.add(rocketTail);
  rocket.add(rocketTop);
  
  rocket.rotation.y = -Math.PI/4;
  scene.add(rocket);
}

/**
 * Initializes three.js variables 
 */
function createParticle(){
  var particle, geometryCore, ray, w,h,d, sh, sv;
  
  ray = 5+Math.random()*30;
  sh = 2 + Math.floor(Math.random()*2);
  sv = 2 + Math.floor(Math.random()*2);
  geometryCore = new THREE.SphereGeometry(ray, sh, sv);
  
  var materialCore = new THREE.MeshLambertMaterial({
    color: getRandomColor(),
    shading: THREE.FlatShading
  });
  particle = new THREE.Mesh(geometryCore, materialCore);
  return particle;
}

/**
 * Depending if there is particles stored in the waintingParticles array, get one from there or create a new one
 */
function getParticle(){
  if (waitingParticles.length) {
    return waitingParticles.pop();
  }else{
    return createParticle();
  }
}

/**
 * Create and set the particle position randomly but keep it out of the field of view, and give it a random scale
 */
function flyParticle(){
  var particle = getParticle();
  particle.position.x = xLimit;
  particle.position.y = -yLimit + Math.random()*yLimit*2;
  particle.position.z = Math.random()*maxParticlesZ;
  var s = .1 + Math.random();
  particle.scale.set(s,s,s);
  flyingParticles.push(particle);
 	scene.add(particle);
}

/**
 * Returns a random color using hexToRGB.
 */
function getRandomColor(){
  var col = hexToRgb(colors[Math.floor(Math.random()*colors.length)]);
  var threecol = new THREE.Color("rgb("+col.r+","+col.g+","+col.b+")");
  return threecol;
}
  
/**
 * Converts a hex value to an RGB value.
 */
function hexToRgb(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

init();
createLight();
createRocket();
createParticle();
loop();
setInterval(flyParticle, 70); // launch a new particle every 70ms