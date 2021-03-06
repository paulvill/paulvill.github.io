// Global polygon mesh
// var boxMesh;


var geometry, mesh, group, tcurrent,chcurrent;

// Global scene object
var scene;
// Global camera object
var camera;

var controls; 
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

// Mouse interaction
var isDragging = false;
var previousMousePosition = {
    x: 0,
    y: 0,
};

const channelCount = 1;
const xrange = 455;
const yrange = 445;
const zrange = 720;
const trange = 1;
const imageCountX = xrange*trange;
const imageCountZ = zrange*trange;

var channels = {
	"path":[
		"images/CTStack_Cropped.tif/",
		],
	"name":[
		"CT scan",
	]
}


// Texture and flag for current texture filter
var textureArrayX = {};
var textureArrayZ = {};

var channelLoaded = [];
var managerX = [];
var managerZ = [];

// for (ch = 0; ch < channelCount; ++ch) {
// 	channelLoaded[ch] = false;
// 	managerX.push(new THREE.LoadingManager());
// 	managerX[ch].ch = ch;
// 	managerX[ch].onLoad = function() {
// 		channelLoaded[this.ch] = true;
// 		if (this.ch == 0) {
// 			selectTexture(0, 0, 0, 0);
// 		}
// 	};
// }

for (ch = 0; ch < channelCount; ++ch) {
	channelLoaded[ch] = false;
	managerZ.push(new THREE.LoadingManager());
	managerZ[ch].ch = ch;
	managerZ[ch].onLoad = function() {
		channelLoaded[this.ch] = true;
		if (this.ch == 0) {
			selectTexture(0, 0);
		}
	};
}


var slider;

// Initialize the scene
initializeScene();

orbitControls(); 

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
renderer.setClearColor(0xc262626);//(0xc8c8c8);

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
camera.position.set(0, 0, 3);

camera.lookAt(scene.position);
scene.add(camera);


// Load an image as texture
// for (ch = 0; ch < channelCount; ++ch) {
// 	var textureLoader = new THREE.TextureLoader(managerX[ch]);
// 	for (tstep = 0; tstep < trange; ++tstep) {
// 		for (xval = 0; xval < xrange; ++xval) {
// 			textureArrayX[ch * imageCountX + tstep*xrange + xval] = textureLoader.load(channels.path[ch].concat("t_", tstep+1,"_x_",xval+1,".png")); 
// 		}
// 	}
// 	console.log(channels.path[ch].concat("t_", tstep+1,"_x_",xval+1,".png"));
// 	console.log("X loaded");
// }

for (ch = 0; ch < channelCount; ++ch) {
	var textureLoader = new THREE.TextureLoader(managerZ[ch]);
	tstep = 0
		for (zval = 0; zval < zrange; ++zval) {
			textureArrayZ[ch * imageCountZ + tstep*zrange + zval] = textureLoader.load(channels.path[ch].concat("z_",zval+1,".png")); 
		}
	console.log("Z loaded");
}


 // geometry = new Plane(xrange/4, yrange/4);
 group = [];
 var planeMaterial = new THREE.MeshBasicMaterial({ 
// map:neheTexture,
side:THREE.DoubleSide,
transparent:true,
depthWrite:false,
blending:THREE.AdditiveBlending
});

for (ch = 0; ch < channelCount; ++ch) {
for (tstep = 0; tstep < trange; ++tstep) {
	group[ch * imageCountZ +tstep] = new THREE.Object3D();
 for (var zval = 0; zval<zrange; zval++) {
 	mesh = new THREE.Mesh(new THREE.PlaneGeometry(1, yrange/xrange), new THREE.MeshBasicMaterial({map:textureArrayZ[ch * imageCountZ + tstep*zrange + zval], 
 		side:THREE.DoubleSide, opacity:0.01, transparent:true, depthWrite:false, blending:THREE.AdditiveBlending}));
 	mesh.position.z = 1-zval/zrange;
 	group[ch * imageCountZ +tstep].add(mesh);
 	group[ch * imageCountZ +tstep].name = tstep;
 }
}
}
tcurrent = 0;
chcurrent = 0;
scene.add(group[chcurrent * imageCountZ +tcurrent]);


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
function selectTexture( channel, tstep) {
	if ((tcurrent !== tstep)||(chcurrent !== channel)) {
		scene.remove(scene.getObjectByName(group[chcurrent * imageCountZ +tcurrent].name));
		scene.add(group[channel * imageCountZ +tstep]);
		tcurrent = tstep;
		chcurrent = channel;
	}

document.getElementById("overlaytext").innerHTML = channels.name[channel].concat(" - t: ",tstep+1);
document.getElementById("myRange").value = image;
}

/**
* This function is called, when a key is pushed down.
*/
function onDocumentKeyDown(event) {
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

}
selectTexture(this.currentChannel, this.currentTStep);
}

function onSlide(event){
	this.currentTStep = this.currentTStep || 0;
	this.currentChannel = this.currentChannel || 0;
	this.currentTStep = parseInt(document.getElementById("myRange").value);
	selectTexture(this.currentChannel, this.currentVarX, this.currentVarZ, this.currentTStep);
}

function onDblClick(event) {
	this.currentTStep = this.currentTStep || 0;
	this.currentChannel = this.currentChannel || 0;
	if (this.currentChannel < channelCount - 1 && channelLoaded[this.currentChannel+1]) {
		++this.currentChannel;
	} else {
		this.currentChannel = 0;
	}
	selectTexture(this.currentChannel, this.currentTStep);
}



function orbitControls() { 
     // add the controls 
     controls = new THREE.OrbitControls( camera, renderer.domElement ); 
} 


/**
* Animate the scene and call rendering.
*/
function animateScene() {
//directionalLight.position = camera.position;
if (channelLoaded[0]) {
// Map the 3D scene down to the 2D screen (render the frame)
group[chcurrent * imageCountZ +tcurrent].rotation.set(xRotation, 0.0, yRotation, 'XYZ' );
group[chcurrent * imageCountZ +tcurrent].position.z = zTranslation;
renderScene();
}

// Define the function, which is called by the browser supported timer loop. If the
// browser tab is not visible, the animation is paused. So 'animateScene()' is called
// in a browser controlled loop.
requestAnimationFrame(animateScene);
if (controls != null && typeof controls != 'undefined') {
	controls.update(); 
}

}

/**
* Render the scene. Map the 3D world to the 2D screen.
*/
function renderScene() {
	renderer.render(scene, camera);
}


