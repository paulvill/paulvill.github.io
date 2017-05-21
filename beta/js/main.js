// Global polygon mesh
// var boxMesh;
var planeVert;
var planeHoriz;

// Global scene object
var scene;
// Global camera object
var camera;
// The cube has to rotate around all three axes, so we need three rotation values.
// x, y and z rotation
var xRotation = 0.0;
var yRotation = 0.0;

var initialRotation = -Math.PI / 2 ;
// Rotation speed around x and y axis
var xSpeed = 0.0;
var ySpeed = 0.0;

// Translations
var xTranslation = 0;
var yTranslation = 0;
var zTranslation = 0;

const channelCount = 1;
const xrange = 512;
const yrange = 512;
const zrange = 18;
const trange = 25;
const imageCountX = xrange*trange;
const imageCountZ = zrange*trange;

var channels = {
	"path":[
		"images/Mem_02.tif/",
		],
	"name":[
		"Membranes",
	]
}


// Texture and flag for current texture filter
var textureArrayX = {};
var textureArrayZ = {};

var channelLoaded = [];
var managerX = [];
var managerZ = [];

for (ch = 0; ch < channelCount; ++ch) {
	channelLoaded[ch] = false;
	managerX.push(new THREE.LoadingManager());
	managerX[ch].ch = ch;
	managerX[ch].onLoad = function() {
		channelLoaded[this.ch] = true;
		if (this.ch == 0) {
			selectTexture(0, 0, 0, 0);
		}
	};
}

for (ch = 0; ch < channelCount; ++ch) {
	channelLoaded[ch] = false;
	managerZ.push(new THREE.LoadingManager());
	managerZ[ch].ch = ch;
	managerZ[ch].onLoad = function() {
		channelLoaded[this.ch] = true;
		if (this.ch == 0) {
			selectTexture(0, 0, 0, 0);
		}
	};
}


var slider;

// Initialize the scene
initializeScene();

// Instead of calling 'renderScene()', we call a new function: 'animateScene()'. It will
// update the rotation values and call 'renderScene()' in a loop.
// Animate the scene
animateScene();

/**
* Initialize the scene
*/
function initializeScene() {
// Check whether the browser supports WebGL. If so, instantiate the hardware accelerated
// WebGL renderer. For antialiasing, we have to enable it. The canvas renderer uses
// antialiasing by default.
// The approach of multiple renderers is quite nice, because your scene can also be
// viewed in browsers, which don't support WebGL. The limitations of the canvas renderer
// in contrast to the WebGL renderer will be explained in the tutorials, when there is a
// difference.
webGLAvailable = false;
if (Detector.webgl) {
	renderer = new THREE.WebGLRenderer({antialias:true});
	webGLAvailable = true;
} else {
	renderer = new THREE.CanvasRenderer();
}

// Set the background color
renderer.setClearColor(0x000000);//(0xc8c8c8);

// Get the size of the inner window (content area) to create a full size renderer
canvasWidth = window.innerWidth/1.5;
canvasHeight = window.innerHeight/1.5;

// Set the renderers size to the content areas size
renderer.setSize(canvasWidth, canvasHeight);

// Get the DIV element from the HTML document by its ID and append the renderers DOM
// object to it
document.getElementById("WebGLCanvas").appendChild(renderer.domElement);

// Create the scene, in which all objects are stored 
scene = new THREE.Scene();

camera = new THREE.PerspectiveCamera(45, canvasWidth / canvasHeight, 1, 100);
camera.position.set(0, 0, 10);
camera.lookAt(scene.position);
scene.add(camera);


// Load an image as texture
	for (ch = 0; ch < channelCount; ++ch) {
		var textureLoader = new THREE.TextureLoader(managerX[ch]);
		for (tstep = 0; tstep < trange-1; ++tstep) {
			for (xval = 0; xval < xrange-1; ++xval) {
				textureArrayX[ch * imageCountX + tstep*xrange + xval] = textureLoader.load(channels.path[ch].concat("t_", tstep+1,"_x_",xval+1,".png")); 
			}
		}
		console.log(channels.path[ch].concat("t_", tstep+1,"_x_",xval+1,".png"));
		console.log("X loaded");
	}

	for (ch = 0; ch < channelCount; ++ch) {
		var textureLoader = new THREE.TextureLoader(managerZ[ch]);
		for (tstep = 0; tstep < trange-1; ++tstep) {
			for (zval = 0; zval < zrange-1; ++zval) {
				textureArrayZ[ch * imageCountZ + tstep*zrange + zval] = textureLoader.load(channels.path[ch].concat("t_", tstep+1,"_z_",zval+1,".png")); 
			}
		}
		console.log("Z loaded");
	}

var planeVertMaterial = new THREE.MeshBasicMaterial({ 
// map:neheTexture,
side:THREE.DoubleSide,
transparent:true,
depthWrite:false
});
planeVertMaterial.blending = THREE.AdditiveBlending;
// planeVertMaterial.blending = THREE.CustomBlending;
// planeVertMaterial.blendEquation = THREE.AddEquation; //default
// planeVertMaterial.blendSrc = THREE.SrcAlpha; //default
// planeVertMaterial.blendDst = THREE.OneFactor; //default

// plane
planeVert = new THREE.Mesh(new THREE.PlaneGeometry(8, 8),planeVertMaterial);
planeVert.material.map = textureArrayX[0];

planeVert.overdraw = true;

scene.add(planeVert);



var planeHorizMaterial = new THREE.MeshBasicMaterial({ 
	side:THREE.DoubleSide,
	transparent:true,
	depthWrite:false
});

planeHorizMaterial.blending = THREE.AdditiveBlending;
// plane
planeHoriz = new THREE.Mesh(new THREE.PlaneGeometry(8, 8),planeHorizMaterial);
planeHoriz.material.map = textureArrayZ[0];
// planeHoriz.rotationX(Math.PI / 2 );
planeHoriz.overdraw = true;

scene.add(planeHoriz);


// Add a listener for 'keydown' events. By this listener, all key events will be
// passed to the function 'onDocumentKeyDown'. There's another event type 'keypress'.
// It will report only the visible characters like 'a', but not the function keys
// like 'cursor up'.
document.addEventListener("keydown", onDocumentKeyDown, false);

// slider = document.getElementById("myRange"),
document.addEventListener("input", onSlide, false);

document.addEventListener('dblclick', onDblClick, false); 

}

/**
* Select current texture to display in loaded texture arrays
*/
function selectTexture( channel, varX, varZ, tstep) {
// boxMesh.material.map = textureArray[channel * imageCount + image];
planeVert.material.map = textureArrayX[channel*imageCountX + tstep*xrange + varX];
console.log(channel*imageCountX + tstep*xrange + varX);
// var index = channel * imageCount + image;// + parseInt(10*yTranslation,10);
// index = index + parseInt(10*planeHoriz.position.y,10); 
// console.log(index);
planeHoriz.material.map = textureArrayZ[channel*imageCountZ + tstep*zrange + varZ];
// // console.log(channel * imageCount + image +parseInt(10*yTranslation,10));
// console.log(parseInt(10*yTranslation,10));
// console.log(yTranslation);
document.getElementById("overlaytext").innerHTML = channels.name[channel].concat(" - t: ",tstep+1," - x: ",varX, " - z: ", varZ);
document.getElementById("myRange").value = image;
}

/**
* This function is called, when a key is pushed down.
*/
function onDocumentKeyDown(event) {
	this.currentVarX = this.currentVarX || 0;
	this.currentVarZ = this.currentVarZ || 0;
	this.currentTStep = this.currentTStep || 0;
	this.currentChannel = this.currentChannel || 0;

// Get the key code of the pressed key
var keyCode = event.which;
if (keyCode == enums.keyboard.SPACE) {	// SWITCH CHANNEL
	if (this.currentChannel < channelCount - 1 && channelLoaded[this.currentChannel+1]) {
		++this.currentChannel;
	} else {
		this.currentChannel = 0;
	}

} else if(keyCode == enums.keyboard.KEY_W) {	// ROTATE UP
// xSpeed -= 0.01;
xRotation -= 0.1;
} else if(keyCode == enums.keyboard.KEY_S) {	// ROTATE DOWN
// xSpeed += 0.01;
xRotation += 0.1;
} else if(keyCode == enums.keyboard.KEY_A) {	// ROTATE LEFT
// ySpeed -= 0.01;
yRotation -= 0.1;
} else if(keyCode == enums.keyboard.KEY_D) {	// ROTATE RIGHT
// ySpeed += 0.01;
yRotation += 0.1;
} else if(keyCode == enums.keyboard.KEY_P) {	
// ySpeed -= 0.01;
yTranslation += 0.1;
++this.currentVarZ;
}  else if(keyCode == enums.keyboard.KEY_L) {	
// ySpeed -= 0.01;
yTranslation -= 0.1;
--this.currentVarZ;
} else if(keyCode == enums.keyboard.KEY_O) {	
// ySpeed -= 0.01;
xTranslation += 0.1;
++this.currentVarX;
}  else if(keyCode == enums.keyboard.KEY_K) {	
// ySpeed -= 0.01;
xTranslation -= 0.1;
--this.currentVarX;
} else if(keyCode == enums.keyboard.LEFT_ARROW) {	// NEXT IMAGE
	if (this.currentTStep > 0) {
		--this.currentTStep;
	} else {
		this.currentTStep = trange - 1;
	}

} else if(keyCode == enums.keyboard.RIGHT_ARROW) {	// PREVIOUS IMAGE
	if (this.currentTStep < trange - 1) {
		++this.currentTStep;
	} else {
		this.currentTStep = 0;
	}

// Page up
} else if(keyCode == enums.keyboard.UP_ARROW) {	// ZOOM IN
	zTranslation += 0.2;
// Page down
} else if(keyCode == enums.keyboard.DOWN_ARROW) {	// ZOOM OUT
	zTranslation -= 0.2;
}
else if(keyCode == enums.keyboard.KEY_R) {	// RESET VIEW
	xRotation = 0.0;
	yRotation = 0.0;
	xSpeed = 0.0;
	ySpeed = 0.0;
	xTranslation = 0;
	yTranslation = 0;
	zTranslation = 0;
	planeHoriz.position.x = 0;
	planeHoriz.position.y = 0;
	planeHoriz.position.z = 0;
	planeVert.position.x = 0;
	planeVert.position.y = 0;
	planeVert.position.z = 0;
}
selectTexture(this.currentChannel, this.currentVarX, this.currentVarZ, this.currentTStep);
}

function onSlide(event){
	this.currentVarX = this.currentVarX || 0;
	this.currentVarZ = this.currentVarZ || 0;
	this.currentTStep = this.currentTStep || 0;
	this.currentChannel = this.currentChannel || 0;
	this.currentTStep = parseInt(document.getElementById("myRange").value);
	selectTexture(this.currentChannel, this.currentVarX, this.currentVarZ, this.currentTStep);
}

function onDblClick(event) {
	this.currentVarX = this.currentVarX || 0;
	this.currentVarZ = this.currentVarZ || 0;
	this.currentTStep = this.currentTStep || 0;
	this.currentChannel = this.currentChannel || 0;
	if (this.currentChannel < channelCount - 1 && channelLoaded[this.currentChannel+1]) {
		++this.currentChannel;
	} else {
		this.currentChannel = 0;
	}
	selectTexture(this.currentChannel, this.currentVarX, this.currentVarZ, this.currentTStep);
}

/**
* Animate the scene and call rendering.
*/
function animateScene() {
//directionalLight.position = camera.position;
if (channelLoaded[0]) {
// Increase the x, y and z rotation of the cube
// xRotation += xSpeed;
// yRotation += ySpeed;
// boxMesh.rotation.set(xRotation, yRotation, 0.0);
planeVert.rotation.set(xRotation, yRotation, 0.0, 'XYZ' );
// planeVert.rotateX(xRotation);
// planeVert.rotateY(yRotation);

// planeHoriz.rotateX(xRotation+initialRotation);
// planeHoriz.rotateZ(yRotation);
// initialRotation = 0;
// xRotation = 0;
// yRotation = 0;
planeHoriz.rotation.set(xRotation+initialRotation, 0.0, yRotation, 'XYZ' );
// Apply the the translation along the z axis
// boxMesh.position.z = zTranslation;
planeVert.position.z = zTranslation;
// planeVert.translateY(yTranslation);
// planeVert.translateOnAxis(a, yTranslation);
// yTranslation = 0;
planeVert.translateZ(xTranslation);

xTranslation = 0;
planeHoriz.position.z = zTranslation;
// planeHoriz.position.y = yTranslation;
planeHoriz.translateZ(yTranslation);
yTranslation = 0;
// Map the 3D scene down to the 2D screen (render the frame)
renderScene();
}

// Define the function, which is called by the browser supported timer loop. If the
// browser tab is not visible, the animation is paused. So 'animateScene()' is called
// in a browser controlled loop.
requestAnimationFrame(animateScene);
}

/**
* Render the scene. Map the 3D world to the 2D screen.
*/
function renderScene() {
	renderer.render(scene, camera);
}


