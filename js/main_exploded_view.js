// Global polygon mesh
// var boxMesh;
var plane1;
var plane2;
var plane3;
var plane4;
var plane5;
var plane6;

// Global scene object
var scene;
// Global camera object
var camera;
// The cube has to rotate around all three axes, so we need three rotation values.
// x, y and z rotation
var xRotation = 0.0;
var yRotation = -0.9;


var initialRotation = -Math.PI / 2 ;
// Rotation speed around x and y axis
var xSpeed = 0.0;
var ySpeed = 0.0;

// Translations
var xTranslation = 2.5;
var yTranslation = 0;
var zTranslation = 0;

var group = new THREE.Group();

const imageCount = 42;
const channelCount = 6;

var channels = {
	"path":[
	"images/coloredmovie_4datasets/grayscale/nuclei",
	"images/coloredmovie_4datasets/grayscale/dpERK",
	"images/coloredmovie_4datasets/grayscale/twist",
	"images/coloredmovie_4datasets/grayscale/dorsal",
	"images/coloredmovie_4datasets/grayscale/ind",
	"images/coloredmovie_4datasets/grayscale/rhomboid",
	],
	"name":[
	"all_",
	"nuclei_",
	"dpERK_",
	"twist_",
	"dorsal_",
	"ind_",
	"rhomboid_",
	]
};


// Texture and flag for current texture filter
var textureArray = {};
var channelLoaded = [];
var manager = [];
for (ch = 0; ch < channelCount; ++ch) {
	channelLoaded[ch] = false;
	manager.push(new THREE.LoadingManager());
	manager[ch].ch = ch;
	manager[ch].onLoad = function() {
		channelLoaded[this.ch] = true;
		if (this.ch == 0) {
			selectTexture(0, 0);
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

// Now that we have a scene, we want to look into it. Therefore we need a camera.
// Three.js offers three camera types:
//  - PerspectiveCamera (perspective projection)
//  - OrthographicCamera (parallel projection)
//  - CombinedCamera (allows to switch between perspective / parallel projection
//    during runtime)
// In this example we create a perspective camera. Parameters for the perspective
// camera are ...
// ... field of view (FOV),
// ... aspect ratio (usually set to the quotient of canvas width to canvas height)
// ... near and
// ... far.
// Near and far define the cliping planes of the view frustum. Three.js provides an
// example (http://mrdoob.github.com/three.js/examples/
// -> canvas_camera_orthographic2.html), which allows to play around with these
// parameters.
// The camera is moved 10 units towards the z axis to allow looking to the center of
// the scene.
// After definition, the camera has to be added to the scene.
camera = new THREE.PerspectiveCamera(45, canvasWidth / canvasHeight, 1, 100);
camera.position.set(0, 0, 20);
camera.lookAt(scene.position);
scene.add(camera);


// Load an image as texture
for (ch = 0; ch < channelCount; ++ch) {
	var textureLoader = new THREE.TextureLoader(manager[ch]);
	for (img = 0; img < imageCount; ++img) {
		textureArray[ch * imageCount + img] = textureLoader.load(channels.path[ch].concat(img+1,".png"));
	}
}

var plane1Material = new THREE.MeshBasicMaterial({ 
// map:neheTexture,
side:THREE.DoubleSide,
transparent:true,
depthWrite:false
});
plane1Material.blending = THREE.AdditiveBlending;
// plane1Material.blending = THREE.CustomBlending;
// plane1Material.blendEquation = THREE.AddEquation; //default
// plane1Material.blendSrc = THREE.SrcAlpha; //default
// plane1Material.blendDst = THREE.OneFactor; //default

// plane
plane1 = new THREE.Mesh(new THREE.PlaneGeometry(8, 8),plane1Material);
plane1.material.map = textureArray[0];

plane1.overdraw = true;

scene.add(plane1);



var plane2Material = new THREE.MeshBasicMaterial({ 
	side:THREE.DoubleSide,
	transparent:true,
	depthWrite:false
});

plane2Material.blending = THREE.AdditiveBlending;
// plane
plane2 = new THREE.Mesh(new THREE.PlaneGeometry(8, 8),plane2Material);
plane2.material.map = textureArray[0];
// plane2.rotationX(Math.PI / 2 );
plane2.overdraw = true;

scene.add(plane2);


var plane3Material = new THREE.MeshBasicMaterial({ 
	side:THREE.DoubleSide,
	transparent:true,
	depthWrite:false
});

plane3Material.blending = THREE.AdditiveBlending;
// plane
plane3 = new THREE.Mesh(new THREE.PlaneGeometry(8, 8),plane3Material);
plane3.material.map = textureArray[0];
// plane3.rotationX(Math.PI / 2 );
plane3.overdraw = true;

scene.add(plane3);

var plane4Material = new THREE.MeshBasicMaterial({ 
	side:THREE.DoubleSide,
	transparent:true,
	depthWrite:false
});

plane4Material.blending = THREE.AdditiveBlending;
// plane
plane4 = new THREE.Mesh(new THREE.PlaneGeometry(8, 8),plane4Material);
plane4.material.map = textureArray[0];
// plane4.rotationX(Math.PI / 2 );
plane4.overdraw = true;

scene.add(plane4);


var plane5Material = new THREE.MeshBasicMaterial({ 
	side:THREE.DoubleSide,
	transparent:true,
	depthWrite:false
});

plane5Material.blending = THREE.AdditiveBlending;
// plane
plane5 = new THREE.Mesh(new THREE.PlaneGeometry(8, 8),plane5Material);
plane5.material.map = textureArray[0];
// plane5.rotationX(Math.PI / 2 );
plane5.overdraw = true;

scene.add(plane5);

var plane6Material = new THREE.MeshBasicMaterial({ 
	side:THREE.DoubleSide,
	transparent:true,
	depthWrite:false
});

plane6Material.blending = THREE.AdditiveBlending;
// plane
plane6 = new THREE.Mesh(new THREE.PlaneGeometry(8, 8),plane6Material);
plane6.material.map = textureArray[0];
// plane5.rotationX(Math.PI / 2 );
plane6.overdraw = true;

scene.add(plane6);

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
function selectTexture(channel, image) {
// boxMesh.material.map = textureArray[channel * imageCount + image];
plane1.material.map = textureArray[channel * imageCount + image];
plane2.material.map = textureArray[(channel+1) * imageCount + image];
plane3.material.map = textureArray[(channel+2) * imageCount + image];
plane4.material.map = textureArray[(channel+3) * imageCount + image];
plane5.material.map = textureArray[(channel+4) * imageCount + image];
plane6.material.map = textureArray[(channel+5) * imageCount + image];

// console.log(channel * imageCount + image +parseInt(10*yTranslation,10));
// console.log(parseInt(10*yTranslation,10));
// console.log(yTranslation);
document.getElementById("overlaytext").innerHTML = image+1;
document.getElementById("myRange").value = image;
}

/**
* This function is called, when a key is pushed down.
*/
function onDocumentKeyDown(event) {
	this.currentImage = this.currentImage || 0;
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
}  else if(keyCode == enums.keyboard.KEY_L) {	
// ySpeed -= 0.01;
yTranslation -= 0.1;
} else if(keyCode == enums.keyboard.KEY_O) {	
// ySpeed -= 0.01;
xTranslation += 0.1;
}  else if(keyCode == enums.keyboard.KEY_K) {	
// ySpeed -= 0.01;
xTranslation -= 0.1;
} else if(keyCode == enums.keyboard.LEFT_ARROW) {	// NEXT IMAGE
	if (this.currentImage > 0) {
		--this.currentImage;
	} else {
		this.currentImage = imageCount - 1;
	}

} else if(keyCode == enums.keyboard.RIGHT_ARROW) {	// PREVIOUS IMAGE
	if (this.currentImage < imageCount - 1) {
		++this.currentImage;
	} else {
		this.currentImage = 0;
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
	plane2.position.x = 0;
	plane2.position.y = 0;
	plane2.position.z = 0;
	plane1.position.x = 0;
	plane1.position.y = 0;
	plane1.position.z = 0;
}
selectTexture(this.currentChannel, this.currentImage);
}

function onSlide(event){
	this.currentImage = this.currentImage || 0;
	this.currentChannel = this.currentChannel || 0;
	this.currentImage = parseInt(document.getElementById("myRange").value);
	selectTexture(this.currentChannel, this.currentImage);
}

function onDblClick(event) {
	this.currentImage = this.currentImage || 0;
	this.currentChannel = this.currentChannel || 0;
	if (this.currentChannel < channelCount - 1 && channelLoaded[this.currentChannel+1]) {
		++this.currentChannel;
	} else {
		this.currentChannel = 0;
	}
	selectTexture(this.currentChannel, this.currentImage);
}

/**
* Import images using html input
*/
function showImages() {

	var preview = document.querySelector('#preview');
	var files   = document.querySelector('input[type=file]').files;
	var count = 0;
	function changeTexture(file) {

// Make sure `file.name` matches our extensions criteria
if ( /\.(jpe?g|png|gif)$/i.test(file.name) ) {
	var reader = new FileReader();

	reader.onload = function(evt){
		console.log(evt);
		var image = document.createElement( 'img' );
		image.src = evt.target.result;
		textureArray[count] = THREE.ImageUtils.loadTexture(evt.target.result);
		count += 1;
	}


	reader.readAsDataURL(file);

// document.getElementById("preview").innerHTML = file.tmp_name;

}

}

if (files) {
	[].forEach.call(files, changeTexture);

}

selectTexture(this.currentChannel, this.currentImage);

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
plane1.rotation.set(xRotation, yRotation, 0.0, 'XYZ' );
plane2.rotation.set(xRotation, yRotation, 0.0, 'XYZ' );
plane3.rotation.set(xRotation, yRotation, 0.0, 'XYZ' );
plane4.rotation.set(xRotation, yRotation, 0.0, 'XYZ' );
plane5.rotation.set(xRotation, yRotation, 0.0, 'XYZ' );
plane6.rotation.set(xRotation, yRotation, 0.0, 'XYZ' );

// Apply the the translation along the z axis
// boxMesh.position.z = zTranslation;
plane1.position.z = zTranslation;
plane2.position.z = zTranslation;
plane3.position.z = zTranslation;
plane4.position.z = zTranslation;
plane5.position.z = zTranslation;
plane6.position.z = zTranslation;

plane2.translateZ(xTranslation);
plane3.translateZ(2*xTranslation);
plane4.translateZ(3*xTranslation);
plane5.translateZ(4*xTranslation);
plane6.translateZ(5*xTranslation);
xTranslation = 0;
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


