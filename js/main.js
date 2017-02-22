			
			var scene = new THREE.Scene();
			var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
			var renderer = new THREE.WebGLRenderer();

			renderer.setSize( window.innerWidth/2, window.innerHeight/2 );
			renderer.setClearColor(0xc8c8c8);
			document.body.appendChild( renderer.domElement );

			// (width, height, depth)
			var geometry = new THREE.BoxGeometry( 5, 5, 5 );

  			var loader = new THREE.TextureLoader();
  			  loader.load("24.png", function(texture){
    			var material = new THREE.MeshLambertMaterial({map: texture});
    			cube= new THREE.Mesh(geometry, material);
    			scene.add(cube);
  			});

			//var material = new THREE.MeshLambertMaterial( { color: 0xf6546a } );
			//var cube = new THREE.Mesh( geometry, material );
			//scene.add( cube );

			// (color, intensity)
			var light = new THREE.PointLight(0xffffff, 1.2);
			// (x, y, z) 
			light.position.set(0, 0, 6);
			scene.add(light);

			camera.position.z = 10;

			var render = function render() {
				requestAnimationFrame( render );
				cube.rotation.x += 0.01;
				cube.rotation.y += 0.01;
				renderer.render( scene, camera );
			}
			render();