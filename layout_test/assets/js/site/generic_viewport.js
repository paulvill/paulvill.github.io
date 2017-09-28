var app = app || {};
app = {
	i: 0,
	xRotation: 0.0,
	yRotation: 0.0,
	zTranslation:0.0,
}


/**
* Initialize the scene
*/
app.initializeScene = function() {
  console.log("hellllooooooo! ")


  var loading = document.getElementById("loading_cover")
  loading.classList.remove("hidden")
  loading.style.opacity = 1

  	// reset view
  	app.xRotation=0.0;
  	app.yRotation=0.0;
  	app.zRotation=0.0;

	app.channelCount = app.dataset_list[app.i].channels;
	// const xrange = 512;
	// const yrange = 512;
	app.zrange = app.dataset_list[app.i].resolution[2]||1;
	app.trange = app.dataset_list[app.i].timesteps||1;
	console.log(app.trange)
	// const imageCountX = xrange*trange;
	app.imageCount = app.zrange*app.trange;


	// Texture and flag for current texture filter
	app.textureArray = {};
	app.channelLoaded = [];
	app.manager = [];

	for (ch = 0; ch < app.channelCount; ++ch) {
		app.channelLoaded[ch] = false;
		app.manager.push(new THREE.LoadingManager());
		app.manager[ch].ch = ch;
		app.manager[ch].onLoad = function() {
			app.channelLoaded[this.ch] = true;
			if (this.ch == 0) {
				app.selectTexture(0, 0);
			}
		};
	}
	// Check whether the browser supports WebGL. If so, instantiate the hardware accelerated
	// WebGL renderer. For antialiasing, we have to enable it. The canvas renderer uses
	// antialiasing by default.
	// The approach of multiple renderers is quite nice, because your scene can also be
	// viewed in browsers, which don't support WebGL. The limitations of the canvas renderer
	// in contrast to the WebGL renderer will be explained in the tutorials, when there is a
	// difference.
	webGLAvailable = false;
	if (Detector.webgl) {
		app.renderer = new THREE.WebGLRenderer({antialias:true});
		webGLAvailable = true;
	} else {
		app.renderer = new THREE.CanvasRenderer();
	}

	// Set the background color
	app.renderer.setClearColor(0xc262626);//(0xc8c8c8);

	// Get the size of the inner window (content area) to create a full size renderer
	canvasWidth = window.innerWidth;
	canvasHeight = window.innerHeight;

	// Set the renderers size to the content areas size
	app.renderer.setSize(canvasWidth, canvasHeight);

	// Get the DIV element from the HTML document by its ID and append the renderers DOM
	// object to it
	// document.getElementById("WebGLCanvas").removeChild();
	var children =  document.getElementById("WebGLCanvas").childElementCount;
	if (children == 0){
		document.getElementById("WebGLCanvas").appendChild(app.renderer.domElement);
	} else {
		console.log(11);
		while (document.getElementById("WebGLCanvas").firstChild) {
		document.getElementById("WebGLCanvas").removeChild(document.getElementById("WebGLCanvas").firstChild)
		}
		console.log(22);
		document.getElementById("WebGLCanvas").appendChild(app.renderer.domElement);
		console.log(33);
	}
  // ^^ it's this line that appends new ones below

	// Create the scene, in which all objects are stored
	app.scene = new THREE.Scene();

	app.camera = new THREE.PerspectiveCamera(45, canvasWidth / canvasHeight, 1, 100);
	app.camera.position.set(0, 0, 1.5);
	app.camera.lookAt(app.scene.position);
	app.scene.add(app.camera);

	if (app.zrange>1) {
		for (ch = 0; ch < app.channelCount; ++ch) {
			var textureLoader = new THREE.TextureLoader(app.manager[ch]);
			for (tstep = 0; tstep < app.trange; ++tstep) {
				for (zval = 0; zval < app.zrange; ++zval) {
					app.textureArray[ch * app.imageCount + tstep*app.zrange + zval] = textureLoader.load(app.dataset_list[app.i].path[ch].concat("t_", tstep+1,"_z_",zval+1,".png"));
					app.textureArray[ch * app.imageCount + tstep*app.zrange + zval].minFilter = THREE.LinearFilter;
				}
			}
		}
		// Set the controls for camera
		app.orbitControls();
	}else{
		for (ch = 0; ch < app.channelCount; ++ch) {
			var textureLoader = new THREE.TextureLoader(app.manager[ch]);
			for (tstep = 0; tstep < app.trange; ++tstep) {
					app.textureArray[ch * app.imageCount + tstep] = textureLoader.load(app.dataset_list[app.i].path[ch].concat(tstep+1,".png"));
					app.textureArray[ch * app.imageCount + tstep].minFilter = THREE.LinearFilter;
					console.log(app.dataset_list[app.i].path[ch].concat(tstep+1,".png"))
			}
		}
	}

	app.group = [];

	if (app.zrange>1) {
		for (ch = 0; ch < app.channelCount; ++ch) {
			for (tstep = 0; tstep < app.trange; ++tstep) {

				app.group[ch * app.imageCount +tstep] = new THREE.Object3D();
				 for (var zval = 0; zval<app.zrange; zval++) {
				 	mesh = new THREE.Mesh(new THREE.PlaneGeometry(1, app.dataset_list[app.i].resolution[1]/app.dataset_list[app.i].resolution[0]), new THREE.MeshBasicMaterial({map:app.textureArray[ch * app.imageCount + tstep*app.zrange + zval],
				 		side:THREE.DoubleSide, opacity:0.25*app.dataset_list[app.i].opacity[0], transparent:true, depthWrite:false, blending:THREE.AdditiveBlending}));
				 	mesh.position.z = 0.05*(1-2*zval/app.zrange);
				 	app.group[ch * app.imageCount +tstep].add(mesh);
				 	app.group[ch * app.imageCount +tstep].name = tstep;

				 }
			}
		}
	}else{
		for (ch = 0; ch < app.channelCount; ++ch) {
			for (tstep = 0; tstep < app.trange; ++tstep) {
				app.group[ch * app.imageCount +tstep] = new THREE.Object3D();
				mesh = new THREE.Mesh(new THREE.PlaneGeometry(1,app.dataset_list[app.i].resolution[1]/app.dataset_list[app.i].resolution[0]), new THREE.MeshBasicMaterial({map:app.textureArray[ch * app.imageCount + tstep],
					side:THREE.DoubleSide, transparent:true, depthWrite:false, blending:THREE.AdditiveBlending}));
				app.group[ch * app.imageCount +tstep].add(mesh);
				app.group[ch * app.imageCount +tstep].name = tstep;
			}
		}
		console.log("2D")

	}
	app.tcurrent = 0;
	app.chcurrent = 0;
	app.scene.add(app.group[app.chcurrent * app.imageCount +app.tcurrent]);



// Add a listener for 'keydown' events. By this listener, all key events will be
// passed to the function 'onDocumentKeyDown'. There's another event type 'keypress'.
// It will report only the visible characters like 'a', but not the function keys
// like 'cursor up'.
document.addEventListener("keydown", app.onDocumentKeyDown, false);

document.addEventListener("input", app.onSlide, false);

document.addEventListener('dblclick', app.onDblClick, false);

}

/**
* Select current texture to display in loaded texture arrays
*/
app.selectTexture = function( channel, tstep) {
	if ((app.tcurrent !== tstep)||(app.chcurrent !== channel)) {
		app.scene.remove(app.scene.getObjectByName(app.group[app.chcurrent * app.imageCount + app.tcurrent].name));
		app.scene.add(app.group[channel * app.imageCount +tstep]);
		app.tcurrent = tstep;
		app.chcurrent = channel;
	}
}

window.onkeydown = function(e) {
  return !(e.keyCode == 32);
}

/**
* This function is called, when a key is pushed down.
*/
app.onDocumentKeyDown = function(event) {
	this.currentTStep = this.currentTStep || 0;
	this.currentChannel = this.currentChannel || 0;



  // Get the key code of the pressed key
  var keyCode = event.which;
  if (keyCode == enums.keyboard.KEY_C) {	// SWITCH CHANNEL
	  if (this.currentChannel < app.channelCount - 1 && app.channelLoaded[this.currentChannel+1]) {
		  ++this.currentChannel;
	  } else {
		  this.currentChannel = 0;
	  }

	} else if(keyCode == enums.keyboard.KEY_W) {	// ROTATE UP
	  app.xRotation -= 0.1;
	} else if(keyCode == enums.keyboard.KEY_S) {	// ROTATE DOWN
	  app.xRotation += 0.1;
	} else if(keyCode == enums.keyboard.KEY_A) {	// ROTATE LEFT
	  app.yRotation -= 0.1;
	} else if(keyCode == enums.keyboard.KEY_D) {	// ROTATE RIGHT
	  app.yRotation += 0.1;
	} else if(keyCode == enums.keyboard.LEFT_ARROW) {	// NEXT IMAGE
		if (this.currentTStep > 0) {
			--this.currentTStep;
		} else {
			this.currentTStep = app.trange - 1;
		}

	} else if(keyCode == enums.keyboard.RIGHT_ARROW) {	// PREVIOUS IMAGE
		if (this.currentTStep < app.trange - 1) {
			++this.currentTStep;
		} else {
			this.currentTStep = 0;
		}
	  // Page up
	} else if(keyCode == enums.keyboard.UP_ARROW) {	// ZOOM IN
		app.zTranslation += 0.2;
	  // Page down
	} else if(keyCode == enums.keyboard.DOWN_ARROW) {	// ZOOM OUT
		app.zTranslation -= 0.2;
		  // Page up
	} else if(keyCode == enums.keyboard.KEY_Z) {	// ZOOM IN
		app.zTranslation += 0.2;
	  // Page down
	} else if(keyCode == enums.keyboard.KEY_X) {	// ZOOM OUT
		app.zTranslation -= 0.2;
	}
	else if(keyCode == enums.keyboard.KEY_R) {	// RESET VIEW
	  app.xRotation = 0.0;
	  app.yRotation = 0.0;
	  app.zTranslation = 0;
	  // planeHoriz.position.x = 0;
	  // planeHoriz.position.y = 0;
	  // planeHoriz.position.z = 0;
	  // planeVert.position.x = 0;
	  // planeVert.position.y = 0;
	  // planeVert.position.z = 0;
  }
  app.selectTexture(this.currentChannel, this.currentTStep);
}

app.onSlide = function(event){
	this.currentTStep = this.currentTStep || 0;
	this.currentChannel = this.currentChannel || 0;
	this.currentTStep = parseInt(document.getElementById("myRange").value);
	app.selectTexture(this.currentChannel, this.currentTStep);
}

app.onDblClick = function(event) {
	this.currentTStep = this.currentTStep || 0;
	this.currentChannel = this.currentChannel || 0;
	if (this.currentChannel < channelCount - 1 && channelLoaded[this.currentChannel+1]) {
		++this.currentChannel;
	} else {
		this.currentChannel = 0;
	}
	app.selectTexture(this.currentChannel, this.currentTStep);
}

app.orbitControls = function(event) {
  // add the controls
  app.controls = new THREE.OrbitControls( app.camera, app.renderer.domElement );
  console.log("setting orbit controls")
}


/**
* Animate the scene and call rendering.
*/
app.animateScene = function() {
  //directionalLight.position = camera.position;
  if (app.channelLoaded[0]) {
	  // Map the 3D scene down to the 2D screen (render the frame)

    // hide loading animation here
    var loading = document.getElementById("loading_cover")
    loading.style.opacity = 0
    loading.classList.add("hidden")


	  app.group[app.chcurrent * app.imageCount + app.tcurrent].rotation.set(app.xRotation, 0.0, app.yRotation, 'XYZ' );
	  app.group[app.chcurrent * app.imageCount + app.tcurrent].position.z = app.zTranslation;
	  app.renderScene();
  }
  else{

    // show loading animation here

    // 	document.getElementById("WebGLCanvas").innerHTML = '<div class="loadwrapper" style="position:center">\
    //           <div class="loading">\
    //               <p>loading<span id="dots">...</span></p>\
    //           </div>\
    //       </div>'
  }

// Define the function, which is called by the browser supported timer loop. If the
// browser tab is not visible, the animation is paused. So 'animateScene()' is called
// in a browser controlled loop.
requestAnimationFrame(app.animateScene);
if (app.controls != null && typeof app.controls != 'undefined') {
	app.controls.update();
}
}

/**
* Render the scene. Map the 3D world to the 2D screen.
*/
app.renderScene = function() {
	app.renderer.render(app.scene, app.camera);
}
