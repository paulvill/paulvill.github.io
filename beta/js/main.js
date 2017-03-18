// Global polygon mesh
var boxMesh;
// Global scene object
var scene;
// Global camera object
var camera;
// The cube has to rotate around all three axes, so we need three rotation values.
// x, y and z rotation
var xRotation = 0.0;
var yRotation = 0.0;
// Rotation speed around x and y axis
var xSpeed = 0.0;
var ySpeed = 0.0;
// Translation along the z axis
var zTranslation = 5;

const imageCount = 42;
const channelCount = 7;

var channels = {
	"path":[
		"images/coloredmovie_4datasets/",
		"images/coloredmovie_4datasets/grayscale/nuclei",
		"images/coloredmovie_4datasets/grayscale/dpERK",
		"images/coloredmovie_4datasets/grayscale/twist",
		"images/coloredmovie_4datasets/grayscale/dorsal",
		"images/coloredmovie_4datasets/grayscale/ind",
		"images/coloredmovie_4datasets/grayscale/rhomboid",
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
		// document.getElementById("overlaytext").innerHTML += "WebGL Renderer";
		// If its not supported, instantiate the canvas renderer to support all non WebGL
		// browsers
	} else {
		renderer = new THREE.CanvasRenderer();
		//document.getElementById("overlaytext").innerHTML += "Canvas Renderer";
	}

	// Set the background color
	renderer.setClearColor(0xc8c8c8);

	// Get the size of the inner window (content area) to create a full size renderer
	canvasWidth = window.innerWidth/1.5;
	canvasHeight = window.innerHeight/1.5;

	// Set the renderers size to the content areas size
	renderer.setSize(canvasWidth, canvasHeight);

	// Get the DIV element from the HTML document by its ID and append the renderers DOM
	// object to it
	document.getElementById("WebGLCanvas").appendChild(renderer.domElement);

	// Create the scene, in which all objects are stored (e. g. camera, lights,
	// geometries, ...)
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
	camera.position.set(0, 0, 10);
	camera.lookAt(scene.position);
	scene.add(camera);

	var boxMaterial = new THREE.MeshBasicMaterial({
		 side:THREE.DoubleSide
	});
	// Create the cube
	boxGeometry = new THREE.BoxGeometry(2.0, 2.0, 2.0);
	// Create a mesh and insert the geometry and the material. Translate the whole mesh
	// by 1.5 on the x axis and by 4 on the z axis and add the mesh to the scene.
	boxMesh = new THREE.Mesh(boxGeometry, boxMaterial);
	boxMesh.position.set(0.0, 0.0, 4.0);
	scene.add(boxMesh);

	// Load an image as texture
	for (ch = 0; ch < channelCount; ++ch) {
		var textureLoader = new THREE.TextureLoader(manager[ch]);
		for (img = 0; img < imageCount; ++img) {
			textureArray[ch * imageCount + img] = textureLoader.load(channels.path[ch].concat(img+1,".png"));
		}
	}

	// // Ambient light has no direction, it illuminates every object with the same
	// // intensity. If only ambient light is used, no shading effects will occur.
	// var ambientLight = new THREE.AmbientLight(0x101010, 1.0);
	// scene.add(ambientLight);

	// // Directional light has a source and shines in all directions, like the sun.
	// // This behaviour creates shading effects.
	// directionalLight = new THREE.DirectionalLight(0xffffff, 1.0);
	// directionalLight.position.set(0.0, 0.0, 1.0);
	// scene.add(directionalLight);

	// Add a listener for 'keydown' events. By this listener, all key events will be
	// passed to the function 'onDocumentKeyDown'. There's another event type 'keypress'.
	// It will report only the visible characters like 'a', but not the function keys
	// like 'cursor up'.
	document.addEventListener("keydown", onDocumentKeyDown, false);

	// // Ambient light has no direction, it illuminates every object with the same
	// // intensity. If only ambient light is used, no shading effects will occur.
	// ambientLight = new THREE.AmbientLight(0x404040);
	// scene.add(ambientLight);

	// // Directional light has a source and shines in all directions, like the sun.
	// // This behaviour creates shading effects.

	// directionalLight = new THREE.PointLight(0xffffff);
	// directionalLight.position.set(250,250,250);
	// scene.add(directionalLight);
}

/**
 * Select current texture to display in loaded texture arrays
 */
function selectTexture(channel, image) {
	boxMesh.material.map = textureArray[channel * imageCount + image];
	document.getElementById("overlaytext").innerHTML = channels.path[channel].concat(image+1,".png");
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
		xSpeed -= 0.01;
	} else if(keyCode == enums.keyboard.KEY_S) {	// ROTATE DOWN
		xSpeed += 0.01;
	} else if(keyCode == enums.keyboard.KEY_A) {	// ROTATE LEFT
		ySpeed -= 0.01;
	} else if(keyCode == enums.keyboard.KEY_D) {	// ROTATE RIGHT
		ySpeed += 0.01;

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
		zTranslation = 5;
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
	  xRotation += xSpeed;
	  yRotation += ySpeed;
	  boxMesh.rotation.set(xRotation, yRotation, 0.0);

	  // Apply the the translation along the z axis
	  boxMesh.position.z = zTranslation;
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

//   Old Script
// var scene = new THREE.Scene();
// var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
// var renderer = new THREE.WebGLRenderer();

// renderer.setSize( window.innerWidth/2, window.innerHeight/2 );
// renderer.setClearColor(0xc8c8c8);
// document.getElementById("WebGLCanvas").appendChild( renderer.domElement );

// // (width, height, depth)
// var geometry = new THREE.BoxGeometry( 5, 5, 5 );

// 		var loader = new THREE.TextureLoader();
// 		  loader.load("images/24.png", function(texture){
//  			var material = new THREE.MeshLambertMaterial({map: texture});
//  			cube= new THREE.Mesh(geometry, material);
//  			scene.add(cube);
// 		});

// //var material = new THREE.MeshLambertMaterial( { color: 0xf6546a } );
// //var cube = new THREE.Mesh( geometry, material );
// //scene.add( cube );

// // (color, intensity)
// var light = new THREE.PointLight(0xffffff, 1.2);
// // (x, y, z)
// light.position.set(0, 0, 6);
// scene.add(light);

// camera.position.z = 10;

// var render = function render() {
// 	requestAnimationFrame( render );
// 	cube.rotation.x += 0.01;
// 	cube.rotation.y += 0.01;
// 	renderer.render( scene, camera );
// }
// render();
