/** 
 * Class: VisualizationSandbox
 * This class is the top-level visualization environment object
  */
var VisualizationSandbox = function() {

	this.canvas = null; //Canvas

	this.selectionChangeCallback; 
	
	this.renderer = null; //THREE.WebGLRenderer
	this.scene = null; //THREE.Scene
	this.camera = null; //THREE.PerspectiveCamera
	this.controls = null;

	this.transformControls = null;
	
	this.shortcutsEnabled = true;
	
	this.projector = null;
	this.raycaster = null;
	this.mouse = null;
	this.INTERSECTED = null;

	this.typeRepository = null;
	this.modelRepository = null;
	this.animationManager = null;
	this.layoutManager = null;
		
	this.editing = false; //bool
	this.mouseDownObject =  null;

	this.cameraSetup = null; //CameraSetup
	this.visualizationSetups = {}; //VisualizationSetup

	this.visualizationStyles = {}; //[datasetId] = VisualizationStyle
	this.datasets = {}; //[datasetId] = VisualizationDataset

	this.callbackHandlers = {}; //CallbackHandler[]

	this.nodesBeingRendered = null;
	this.connectionsBeingRendered = null;
	this.backgroundObjectsBeingRendered = null;

	this.nodesBeingAdded = null;
	this.connectionsBeingAdded = null;
	this.backgroundObjectsBeingAdded = null;
	
	this.pendingDatasetId = null;
	this.pendingConnections = {};

	this.selectables = null;

	this.datasetVSObjects = {}; //[datasetId] = VSObject
	this.backgroundVSObjects = {}; //[objectId] = VSObject
	
	this.layoutScale = 2.0;
	
	this.perspective = false;

	this.selectedVisualizationSetup = null;
	this.selectedDataset = null;
	this.selectedVisualizationStyle = null;
	this.selectedLayout = null;
	
	this.lastContext = null;

	this.currentShowShadow = false;
	
	this.layoutPending = false;
	
	this.selectedNodes = {};
	this.selectedConnections = {};
	this.selectedNodePositions = {};
	
	this.drawingConnection = false;
	this.connectionDrawnCallback = null;
	this.sourceNode = null;
	this.targetNode = null;

	this.controlDown = false;
	
	this.tempConnection;
	
	this.areaSelect = false;
	this.selectionCube = null;
	
	this.selectionTransformControls = null;
	
	this.lastMouseDownX = null;
	this.lastMouseDownY = null;
	
	this.contrastColor = 0xFFFFFF;
	this.contrastColorRGB = new Array(255, 255, 255);
	this.backgroundColorRGB = new Array(0, 0, 0);
	
	this.followingCamera = false;
	
	this.showNodes = true;
	this.showConnections = true;
	this.labelProperty = true;
	this.jammedAssetIds = new Array();
	this.jammedIcons = new Array();
		
	this.hiddenNodeIds = {};
	
	this.hoverCallback;
	
	var that = this;
	
	this.init = function(canvas, visualizationSetup, selectionChangeCallback) {

		that.canvas = canvas;
		var canv_width = that.canvas.offsetWidth;
		var canv_height = that.canvas.offsetHeight;
		
		that.selectionChangeCallback = selectionChangeCallback;
		
		that.nodesBeingAdded = false;
		that.connectionsBeingAdded = false;
		that.backgroundObjectsBeingAdded = false;

		that.nodesBeingRendered = new Array();
		that.connectionsBeingRendered = new Array();
		that.backgroundObjectsBeingRendered = new Array();

		that.selectables = new Array();

		that.editing = false; //bool

		if (window.WebGLRenderingContext) {
			that.renderer = new THREE.WebGLRenderer({
				canvas : that.canvas,
				alpha : true,
				antialias : true
			});
		} else {
			that.renderer = new THREE.CanvasRenderer({
				canvas : that.canvas,
				alpha : true
			});
		}
				
		that.scene = new THREE.Scene();

		// that.octree = new THREE.Octree({
			// radius: 25, // optional, default = 1, octree will grow and shrink as needed
			// undeferred: false, // optional, default = false, octree will defer insertion until you call octree.update();
			// depthMax: Infinity, // optional, default = Infinity, infinite depth
			// objectsThreshold: 8, // optional, default = 8
			// overlapPct: 0.15, // optional, default = 0.15 (15%), that helps sort objects that overlap nodes
			// scene: that.scene // optional, pass scene as parameter only if you wish to visualize octree
		// } );
			
		that.typeRepository = new TypeRepository();
		that.modelRepository = new ModelRepository(that);
		
		that.animationManager = new AnimationManager(that.scene, true);
		that.layoutManager = new LayoutManager(that, 50.0);

		that.animationManager.makeAnimationGroup("SelectionAnimations", false);
			
		that.camera = new THREE.CombinedCamera(that.getWidth()/2.0, that.getHeight()/2.0, 70, 1, 5000, -500, 5000 );
		that.camera.up.set( 0, 0, 1 );

		//that.camera = new THREE.PerspectiveCamera(45, that.getWidth() / that.getHeight(), 1, 1000);
		//that.camera = new THREE.OrthographicCamera(that.getWidth()/-2.0, that.getWidth()/2.0, that.getHeight()/-2.0, that.getHeight()/2.0, 0, 1000);

		that.projector = new THREE.Projector();
		that.raycaster = new THREE.Raycaster();
		that.mouse = new THREE.Vector2();

		that.renderer.setSize(canv_width, canv_height);

		that.renderer.shadowMapEnabled = true;
		that.renderer.shadowMapType = THREE.PCFSoftShadowMap; //THREE.BasicShadowMap | THREE.PCFShadowMap | THREE.PCFSoftShadowMap

		that.renderer.shadowMapSoft = false;
		that.renderer.shadowCameraNear = 0;
		that.renderer.shadowCameraFar = that.camera.far;
		that.renderer.shadowCameraFov = 50;

		that.renderer.shadowMapBias = 0.001;
		that.renderer.shadowMapDarkness = 1.0;

		//that.renderer.domElement.addEventListener( 'mousewheel', that.mouseWheel.bind(that), false );
		//that.renderer.domElement.addEventListener( 'DOMMouseScroll', that.mouseWheel.bind(that), false ); // firefox

		that.cameraSetup = new CameraSetup(0, 0, 0, 0, 0, 0, 1.0); //CameraSetup

		//that.reflectionCamera = new THREE.CubeCamera(0.1, 5000, 1024);
		//that.reflectionCamera.renderTarget.minFilter = THREE.LinearMipMapLinearFilter;

		//that.scene.add(that.reflectionCamera);

		that.controls = new THREE.OrbitControls(that.camera, that.canvas);
		
		that.transformControls = null;//new THREE.TransformControls( that.camera, that.renderer.domElement );

//		that.transformControls.addEventListener("change", that.render.bind(that));

//		that.scene.add(that.transformControls);

		that.updateSize.call(that, canv_width, canv_height);

		//that.canvas.addEventListener('resize', that.updateSize.bind(that));

		//that.canvas.addEventListener('contextmenu', that.showContextMenu.bind(that), false);
		
		that.canvas.addEventListener('mouseup', that.onMouseUp.bind(that), false);
		
		that.canvas.addEventListener('mousedown', that.onMouseDown.bind(that), false);
		
		that.canvas.addEventListener('mousemove', that.onDocumentMouseMove.bind(that), false);

		that.canvas.addEventListener('mousewheel', that.onMouseWheel.bind(that), false);

		window.addEventListener('keypress', that.onKeyPress.bind(that), false);

		window.addEventListener('keydown', that.onKeyDown.bind(that), false);

		window.addEventListener('keyup', that.onKeyUp.bind(that), false);
	
		that.makeLine(new THREE.Vector3(0.0, 0.0, 0.0), new THREE.Vector3(0.0, 0.0, 5.0));

		if (visualizationSetup != undefined && visualizationSetup != null) {
			that.addVisualizationSetup(visualizationSetup);
		} else {
			that.addVisualizationSetup(VisualizationSetup.prototype.getDefault());
		}

		that.setPerspective(that.perspective);

		that.render.call(that);
				
	};
	
	this.setFollowCamera = function (on) {
	
		if (on && !that.followingCamera) {
			that.updateOrientations();
			that.controls.addEventListener( 'change', that.updateOrientations);
		} else if (!on) {
			that.controls.removeEventListener( 'change', that.updateOrientations);
			for (var key in that.datasetVSObjects[that.selectedDataset]) {
				var vsObj = that.datasetVSObjects[that.selectedDataset][key];
				if (!vsObj.getIsConnection()) {
					vsObj.getVisualizationObject().rotation.set(0.0, 0.0, 0.0);
					vsObj.getHighlightingObject().rotation.set(0.0, 0.0, 0.0);
					vsObj.getSelectionObject().rotation.set(0.0, 0.0, 0.0);
				}
			}
		}
		that.followingCamera = on;
		
	};
	
	this.updateOrientations = function () {
	
		for (var key in that.datasetVSObjects[that.selectedDataset]) {
			var vsObj = that.datasetVSObjects[that.selectedDataset][key];
			if (!vsObj.getIsConnection()) {
				//vsObj.getVisualizationObject().lookAt(that.camera.position);
				vsObj.getVisualizationObject().rotation.set(that.camera.rotation.x, that.camera.rotation.y, that.camera.rotation.z);
				vsObj.getHighlightingObject().rotation.set(that.camera.rotation.x, that.camera.rotation.y, that.camera.rotation.z);
				vsObj.getSelectionObject().rotation.set(that.camera.rotation.x, that.camera.rotation.y, that.camera.rotation.z);
			}
		}
	
	};
	
	this.makeLine = function (sourcePosition, targetPosition) {
	
		var geometry = new THREE.Geometry();
		geometry.vertices.push(new THREE.Vector3(0.0, -0.5, 0.0));
		geometry.vertices.push(new THREE.Vector3(0.0, 0.5, 0.0));
		var material = new THREE.LineBasicMaterial({color: that.contrastColor, linewidth: 1.0,  fog: true});
		//var material = new THREE.MeshLambertMaterial({ color: 0x030303, wireframe : useWireframe});

		var HALF_PI = Math.PI * .5;
		var distance = sourcePosition.distanceTo(targetPosition);
		
		that.tempConnection = new THREE.Line(geometry, material);

		that.tempConnection.position = new THREE.Vector3((sourcePosition.x+targetPosition.x)/2.0, (sourcePosition.y+targetPosition.y)/2.0, (sourcePosition.z+targetPosition.z)/2.0);
		
		var matrix = new THREE.Matrix4();
		var up = new THREE.Vector3( 0, 1, 0 );
		var axis = new THREE.Vector3( );

		var tangent = new THREE.Vector3(targetPosition.x - sourcePosition.x, targetPosition.y - sourcePosition.y, targetPosition.z - sourcePosition.z);
		tangent = tangent.normalize();
		axis.crossVectors( up, tangent ).normalize();
		var radians = Math.acos( up.dot( tangent ) );
		that.tempConnection.quaternion.setFromAxisAngle( axis, radians );

		var matrix = new THREE.Matrix4();
		var up = new THREE.Vector3(0, 1, 0);
		var axis = new THREE.Vector3();

		var tempSourcePosition = new THREE.Vector3(sourcePosition.x*that.layoutScale, sourcePosition.y*that.layoutScale, sourcePosition.z*that.layoutScale);
		var tempTargetPosition = new THREE.Vector3(targetPosition.x*that.layoutScale, targetPosition.y*that.layoutScale, targetPosition.z*that.layoutScale);

		var distance = tempSourcePosition.distanceTo(tempTargetPosition);
		
		var tangent = new THREE.Vector3(tempTargetPosition.x - tempSourcePosition.x, tempTargetPosition.y - tempSourcePosition.y, tempTargetPosition.z - tempSourcePosition.z);
		tangent = tangent.normalize();
		axis.crossVectors(up, tangent).normalize();
		var radians = Math.acos(up.dot(tangent));
		var newScale = new THREE.Vector3(0.5, ((distance > 0) ? distance : 0.0001), 0.5);
		that.tempConnection.scale.set(newScale.x, newScale.y, newScale.z);

		that.tempConnection.position = new THREE.Vector3((tempSourcePosition.x + tempTargetPosition.x)/2.0, (tempSourcePosition.y + tempTargetPosition.y)/2.0, (tempSourcePosition.z + tempTargetPosition.z)/2.0);
		that.tempConnection.quaternion.setFromAxisAngle(axis, radians);
		
	};
	
	this.updateLine = function () {
		
		var matrix = new THREE.Matrix4();
		var up = new THREE.Vector3(0, 1, 0);
		var axis = new THREE.Vector3();

		var sourcePosition = that.datasetVSObjects[that.selectedDataset][that.selectedDataset+"_"+that.sourceNode+"_node"].getVisualizationObject().position;
		var targetPosition = that.datasetVSObjects[that.selectedDataset][that.selectedDataset+"_"+that.targetNode+"_node"].getVisualizationObject().position;
		
		var tempSourcePosition = new THREE.Vector3(sourcePosition.x, sourcePosition.y, sourcePosition.z);
		var tempTargetPosition = new THREE.Vector3(targetPosition.x, targetPosition.y, targetPosition.z);

		var distance = tempSourcePosition.distanceTo(tempTargetPosition);
		
		var tangent = new THREE.Vector3(tempTargetPosition.x - tempSourcePosition.x, tempTargetPosition.y - tempSourcePosition.y, tempTargetPosition.z - tempSourcePosition.z);
		tangent = tangent.normalize();
		axis.crossVectors(up, tangent).normalize();
		var radians = Math.acos(up.dot(tangent));
		var newScale = new THREE.Vector3(0.5, ((distance > 0) ? distance : 0.0001), 0.5);
		that.tempConnection.scale.set(newScale.x, newScale.y, newScale.z);

		that.tempConnection.position = new THREE.Vector3((tempSourcePosition.x + tempTargetPosition.x)/2.0, (tempSourcePosition.y + tempTargetPosition.y)/2.0, (tempSourcePosition.z + tempTargetPosition.z)/2.0);
		that.tempConnection.quaternion.setFromAxisAngle(axis, radians);
		
	};
	
	this.deleteDataset = function () {

		that.removeDataset(that.selectedDataset);
		
	};

	this.deleteAllNodesAndConnections = function () {
		
		if (that.selectedDataset != undefined && that.selectedDataset != null) {
			for (var nodeName in that.datasets[that.selectedDataset].getNodes()) {
				that.removeNode(that.selectedDataset, nodeName);
			}
			for (var connectionName in that.datasets[that.selectedDataset].getConnections()) {
				that.removeConnection(that.selectedDataset, connectionName);
			}
			//that.setFeedbackMessage("All nodes and connections in the dataset has been deleted!");
		} else {
			//that.setFeedbackMessage("<font color=\"#ff0000\"><b>No dataset selected!</b></font>");
		}

	};

	this.updateNodeLookAndFeel = function (datasetId, nodeName, nodeLookAndFeel) {
	
		if (nodeName != null && (nodeName in that.datasets[datasetId].getNodes())) {

			that.removeNodeFromScene(datasetId, datasetId + "_" + nodeName + "_node");

			that.visualizationStyles[datasetId]["Simple"].setNodeTypeLookAndFeel(nodeName, nodeLookAndFeel);
				
			that.generateNodeObject(datasetId, nodeName + "_node", that.datasets[datasetId].getNode(nodeName), true, true);

		}
		
	};
	
	this.updateConnectionLookAndFeel = function (datasetId, connectionName, connectionLookAndFeel) {
	
		if (connectionName != null && (connectionName in that.datasets[datasetId].getConnections())) {
			
			that.visualizationStyles[datasetId]["Simple"].setConnectionTypeLookAndFeel(connectionName, connectionLookAndFeel);

			if (that.datasetVSObjects[datasetId][datasetId + "_" + connectionName + "_connection"] != undefined && that.datasetVSObjects[datasetId][datasetId + "_" + connectionName + "_connection"] != null) {
				that.removeConnectionFromScene(datasetId, datasetId + "_" + connectionName + "_connection");
			}
			
			that.pendingDatasetId = that.selectedDataset;
			that.pendingConnections[connectionName] = that.datasets[datasetId].getConnection(connectionName);
			
			if (that.nodesBeingRendered.length == 0) {
				that.addPendingConnections();
			}

		}
		
	};

	this.updateSelectedDataset = function (evt) {
	
		//that.setFeedbackMessage("Updating selected dataset...");

		if (that.selectedDataset != null) {
			that.removeDatasetFromScene(that.selectedDataset);
		}
			
		//that.clearScene(true, false, false);
		that.selectedDataset = null; 

		for(var datasetId in that.datasets) {
			that.selectedDataset = datasetId;
			break;
		}
		
		for(var selectedVisualizationStyleId in that.visualizationStyles[that.selectedDataset]) {
			that.selectedVisualizationStyle = that.visualizationStyles[that.selectedDataset][selectedVisualizationStyleId];
			break;
		}
		
		for (var layoutOption in that.selectedVisualizationStyle.getLayouts()) {
			that.selectedLayout = that.selectedVisualizationStyle.getLayouts()[layoutOption];
			break;
		}
			
		that.layoutManager.setDatasetLayout(that.selectedDataset, that.selectedLayout);

		that.addSelectedDatasetToScene();
					
		that.updateSelectedLayout();
		
		//that.setFeedbackMessage("Updated selected dataset!");
		
	};

	var zoom = 1.0;
	this.mouseWheel = function ( event ) {
		if (!that.perspective) {

			event.preventDefault();
			event.stopPropagation();

			var delta = 0;

			if ( event.wheelDelta ) { // WebKit / Opera / Explorer 9
				delta = event.wheelDelta / 40;
			} else if ( event.detail ) { // Firefox
				delta = - event.detail / 3;
			}
			
			var width = that.camera.right / zoom;
			var height = that.camera.top / zoom;

			zoom -= delta * 0.1;
					
			that.camera.left = -zoom*width;
			that.camera.right = zoom*width;
			that.camera.top = zoom*height;
			that.camera.bottom = -zoom*height;
						
			that.camera.updateProjectionMatrix();

		}
	};

	this.updateSelectedLayout = function () {

		if (that.pendingDatasetId == null) {

			if (that.selectedDataset != null) {
				var dataset = that.datasets[that.selectedDataset];
								
				for (var nodeId in dataset.getNodes()) {
					if (that.hiddenNodeIds.hasOwnProperty(nodeId) && that.hiddenNodeIds[nodeId] == true) {
						that.layoutManager.addNode(that.selectedDataset, that.selectedDataset+"_"+nodeId+"_node", true);
					}
				}
				
				for (var connectionId in dataset.getConnections()) {
					var connection = dataset.getConnections()[connectionId];
					that.layoutManager.addConnection(that.selectedDataset, that.selectedDataset+"_"+connectionId+"_connection", that.selectedDataset+"_"+connection.getSourceId()+"_node", that.selectedDataset+"_"+connection.getTargetId()+"_node", true, connection.getWeight(), true);
				}
			}
			
			that.layoutPending = false;

		}	else {
			that.layoutPending = true;
		}

	};

	this.updateSize = function(width, height) {

		that.setWidth(width);
		that.setHeight(height);
		
		that.camera.cameraO.left = width/-32.0;
		that.camera.cameraO.right = width/32.0;
		that.camera.cameraO.top = height/32.0;
		that.camera.cameraO.bottom = height/-32.0;
		
		that.camera.cameraP.aspect = width/height;
		that.camera.updateProjectionMatrix();

		that.renderer.setSize(width, height);
		
	};

	this.render = function() {

		that.controls.update();
		
		if (that.transformControls != null) {
			that.transformControls.update();
		}
		
		that.checkIntersections.call(that);

		that.animate();
			
		that.renderer.render(that.scene, that.camera);

		requestAnimationFrame(that.render.bind(that));

	};
	
	this.animate = function () {
		that.animationManager.update();
	};

	this.getCanvas = function() {
		return that.canvas;
	};

	this.setCanvas = function(canvas) {
		that.canvas = canvas;
	};

	this.getWidth = function() {
		return that.canvas.width;
	};

	this.setWidth = function(width) {
		that.canvas.width = width;
		that.canvas.style.width = width + "px";
	};

	this.getHeight = function() {
		return that.canvas.height;
	};

	this.setHeight = function(height) {
		that.canvas.height = height;
		that.canvas.style.height = height + "px";
	};

	this.getAvailableNodeTypes = function() {
		return that.typeRepository.getNodeTypes();
	};

	this.getAvailableConnectionTypes = function() {
		return that.typeRepository.getConnectionTypes();
	};

	this.getAvailableLayouts = function() {
		return that.typeRepository.getLayoutTypes();
	};

	this.getVisualizationSetups = function() {
		return that.visualizationSetups;
	};

	this.addVisualizationSetup = function(visualizationSetup) {

		that.visualizationSetups[visualizationSetup.getId()] = visualizationSetup;

		if (that.selectedVisualizationSetup == undefined || that.selectedVisualizationSetup == null) {
		
			that.setVisualizationSetup(visualizationSetup.getId());
			
		}
		
	};

	this.removeVisualizationSetup = function(visualizationSetupId) {

		if (that.selectedVisualizationSetup.getId() == visualizationSetupId) {
		
			that.clearScene(false, true, true);

		}

		delete that.visualizationSetups[visualizationSetup.getId()];
		
	};

	this.setVisualizationSetup = function(visualizationSetupId) {

		that.clearScene(false, true, true);
	
		that.selectedVisualizationSetup = that.visualizationSetups[visualizationSetupId];
		
		that.renderer.setClearColor(FormattingUtils.prototype.convertRGBAColorToHex(that.selectedVisualizationSetup.getBackgroundColor()), that.selectedVisualizationSetup.getBackgroundColor()[3]);

		that.scene.fog = new THREE.FogExp2(0xffffff, that.selectedVisualizationSetup.getFogIntensity());
		
		var lightsToAdd = that.selectedVisualizationSetup.getLights();
		for (var lightId in lightsToAdd) {
			var lightToAdd = lightsToAdd[lightId];
			if (lightToAdd.getLightType() === "ambient") {
				var ambientLight = new THREE.AmbientLight(FormattingUtils.prototype.convertRGBAColorToHex(lightToAdd.getColor()));
				ambientLight.name = lightToAdd.getId();
				that.addLightToScene(ambientLight);
			} else if (lightToAdd.getLightType() === "directional") {
				var directionalLight = new THREE.DirectionalLight(FormattingUtils.prototype.convertRGBAColorToHex(lightToAdd.getColor()), 
	lightToAdd.getIntensity());
				directionalLight.intensity = lightToAdd.getIntensity();
				directionalLight.castShadow =  that.selectedVisualizationSetup.getShowShadows();
				directionalLight.shadowDarkness = 0.75;
				directionalLight.shadowMapWidth = 1024;
				directionalLight.shadowMapHeight = 1024;
				// directionalLight.shadowCameraVisible = true;
				directionalLight.position.set(lightToAdd.getX(), lightToAdd.getY(), lightToAdd.getZ());
				directionalLight.rotation.set(lightToAdd.getYaw(), lightToAdd.getPitch(), lightToAdd.getRoll());
				directionalLight.name = lightToAdd.getId();
				that.addLightToScene(directionalLight);
			} if (lightToAdd.getLightType() === "spot") {
				var spotLight = new THREE.SpotLight(FormattingUtils.prototype.convertRGBAColorToHex(lightToAdd.getColor()), lightToAdd.
	getIntensity());
				spotLight.intensity = lightToAdd.getIntensity();
				spotLight.castShadow =  that.selectedVisualizationSetup.getShowShadows();
				spotLight.shadowDarkness = 0.75;
				spotLight.shadowMapWidth = 1024;
				spotLight.shadowMapHeight = 1024;
				//	spotLight.shadowCameraVisible = true;
				spotLight.position.set(lightToAdd.getX(), lightToAdd.getY(), lightToAdd.getZ());
				spotLight.rotation.set(lightToAdd.getYaw(), lightToAdd.getPitch(), lightToAdd.getRoll());
				spotLight.name = lightToAdd.getId();
				that.addLightToScene(spotLight);
			} if (lightToAdd.getLightType() === "point") {
				var pointLight = new THREE.PointLight(FormattingUtils.prototype.convertRGBAColorToHex(lightToAdd.getColor()), lightToAdd.
	getIntensity());
				pointLight.intensity = lightToAdd.getIntensity();
				pointLight.position.set(lightToAdd.getX(), lightToAdd.getY(), lightToAdd.getZ());
				pointLight.name = lightToAdd.getId();
				that.addLightToScene(pointLight);
			} else if (lightToAdd.getLightType() === "mobile") {
				that.mobilelight = new THREE.SpotLight(0xffffff, 1.0);
				that.mobilelight.castShadow =  that.selectedVisualizationSetup.getShowShadows();
				that.mobilelight.shadowDarkness = 0;
				that.mobilelight.shadowDarkness = 0.75;
				that.mobilelight.shadowMapWidth = 1024;
				that.mobilelight.shadowMapHeight = 1024;
				that.mobilelight.target.position.set(0, 0, 0);
				that.mobilelightangle = Math.PI / 2;
				that.mobilelight.name = lightToAdd.getId();
				that.addLightToScene(that.mobilelight);			
			}
		}

		var backgroundObjectsToAdd = that.selectedVisualizationSetup.getBackgroundObjects();
		for (var backgroundObjectId in backgroundObjectsToAdd) {
			that.generateBackgroundObject(backgroundObjectId, backgroundObjectsToAdd[backgroundObjectId], false, that.selectedVisualizationSetup.
			getShowShadows());
		}
		
		if (that.currentShowShadow != that.selectedVisualizationSetup.getShowShadows()) {
			that.updateSelectedDataset();
		}
		
		that.currentShowShadow = that.selectedVisualizationSetup.getShowShadows();
		
		var backgroundColor = that.selectedVisualizationSetup.getBackgroundColor();
				
		for (var i = 0; i < 3; i++) {
			that.contrastColorRGB[i] = backgroundColor[i]+128;
			if (that.contrastColorRGB[i] > 255) {
				that.contrastColorRGB[i] -= 255;
			}
			if (Math.abs(that.contrastColorRGB[i] - backgroundColor[i]) < Math.abs(255-backgroundColor[i]-backgroundColor[i])) {
				that.contrastColorRGB[i] = 255-backgroundColor[i];
			}
		}

		that.contrastColor = that.contrastColorRGB[2] + that.contrastColorRGB[1]*256 + that.contrastColorRGB[0]*256*256;
		that.backgroundColorRGB = new Array(backgroundColor[0], backgroundColor[1], backgroundColor[2]);
		
		that.modelRepository.resetColor();

		that.tempConnection.material = new THREE.LineBasicMaterial({color: that.contrastColor, linewidth: 5.0,  fog: true});

		//	that.flashlight = new THREE.SpotLight(0xffffff, 1.0);
		//	that.flashlight.castShadow = true;
		//	that.flashlight.shadowDarkness = 0.75;
		//	that.camera.add(that.flashlight);
		//	that.scene.add(that.camera);
		//	that.flashlight.target.position.set(0, 0, -1);
		
	};

	this.generateBackgroundObject = function(visId, node, castShadow, receiveShadow) {

		that.backgroundObjectsBeingRendered.push(visId+"_background_object");

		var that2 = this;

		var lookAndFeel = null;

		var callback = that.addBackgroundObjectToScene.bind(that2);
		
		var datasetVisualizationStyle = that.selectedVisualizationStyle;
		if (datasetVisualizationStyle == undefined || datasetVisualizationStyle == null) {
			datasetVisualizationStyle = VisualizationStyle.getDefault();
		}

		lookAndFeel = datasetVisualizationStyle.getNodeLookAndFeel(node.getId(), node.getNodeType()); 

		if (that.typeRepository.getNodeTypes()[node.getNodeType()] != null) {
			var lookAndFeel = that.typeRepository.getNodeTypes()[node.getNodeType()].getDefaultLookAndFeel();
		}
		
		if (lookAndFeel == undefined || lookAndFeel == null) {
			lookAndFeel = that.typeRepository.getNodeTypes()["Cube"].getDefaultLookAndFeel();
		}

		that.modelRepository.getNodeModel("VisualizationSetup", visId+"_background_object", node.getName(), lookAndFeel, castShadow, receiveShadow, callback);

	};

	this.generateNodeObject = function(datasetId, visId, node, castShadow, receiveShadow) {

		that.nodesBeingRendered.push(visId);

		var lookAndFeel = null;
		
		var datasetVisualizationStyle = that.selectedVisualizationStyle;
		if (datasetVisualizationStyle == undefined || datasetVisualizationStyle == null) {
			datasetVisualizationStyle = VisualizationStyle.getDefault();
		}

		lookAndFeel = datasetVisualizationStyle.getNodeLookAndFeel(node.getId(), node.getNodeType()); 

		if (lookAndFeel == undefined || lookAndFeel == null) {
			if (that.typeRepository.getNodeTypes()[node.getNodeType()] != undefined || that.typeRepository.getNodeTypes()[node.getNodeType()] != null) {
				lookAndFeel = that.typeRepository.getNodeTypes()[node.getNodeType()].getDefaultLookAndFeel();
			}
		}
		
		if (lookAndFeel == undefined || lookAndFeel == null) {
			lookAndFeel = that.typeRepository.getNodeTypes()["Cube"].getDefaultLookAndFeel();
		}
		
		var that2 = this;
		var callback = that.addNodeVSObject.bind(that2);
		
		that.modelRepository.getNodeModel(datasetId, visId, node.getName(), lookAndFeel, castShadow, receiveShadow, callback);

	};

	this.generateConnectionObject = function(datasetId, visId, connection, sourcePosition, targetPosition, castShadow,
	 receiveShadow) {

		that.connectionsBeingRendered.push(visId);

		var that2 = this;
		var connectionCallback = that.addConnectionVSObject.bind(that2);
		
		var lookAndFeel = null;
		
		var datasetVisualizationStyle = that.selectedVisualizationStyle;
		if (datasetVisualizationStyle == undefined || datasetVisualizationStyle == null) {
			datasetVisualizationStyle = VisualizationStyle.getDefault();
		}

		lookAndFeel = datasetVisualizationStyle.getConnectionLookAndFeel(connection.getId(), connection.getConnectionType()); 
		
		if (lookAndFeel == undefined || lookAndFeel == null) {
			if (that.typeRepository.getConnectionTypes()[connection.getConnectionType()] != undefined || that.typeRepository.getConnectionTypes()[connection.getConnectionType()] != null) {
				lookAndFeel = that.typeRepository.getConnectionTypes()[connection.getConnectionType()].getDefaultLookAndFeel();
			}
		}
		
		if (lookAndFeel == undefined || lookAndFeel == null) {
			lookAndFeel = that.typeRepository.getConnectionTypes()["Thick"].getDefaultLookAndFeel();
		}

		that.modelRepository.getConnectionModel(datasetId, visId, connection.getName(), connection.getSourceId(), connection.getTargetId(), 
	lookAndFeel, sourcePosition, targetPosition, castShadow, receiveShadow, connectionCallback);

	};

	this.addNodeVSObject = function(vsObj, selectionAnimation) {

		var newNodeId  = vsObj.getId().substring(vsObj.getId().indexOf("_")+1);
		newNodeId = newNodeId.substring(0, newNodeId.lastIndexOf("_"));

		if (that.datasets[that.selectedDataset].getNode(newNodeId) != null) {

			that.datasetVSObjects[vsObj.getDatasetId()][vsObj.getId()] = vsObj;
			
			vsObj.applyPosition(new THREE.Vector3(0.0, 0.0, 0.0));

			vsObj.applyLayoutScale(that.layoutScale);

			if (that.selectedVisualizationSetup.getShowNodeLabels() == 1) {
				vsObj.getLabelSprite().visible =  true;
			} else {
				vsObj.getLabelSprite().visible =  false;
			}
		
			var animation = that.animationManager.getOptions()[selectionAnimation].clone();
			animation.setId(vsObj.getId() + "_SelectionAnimation");
			animation.setInitialValue(new THREE.Vector3(vsObj.getScaleMultiplier().x, vsObj.getScaleMultiplier().y, vsObj.getScaleMultiplier().z));
			animation.setFinalValue(new THREE.Vector3(vsObj.getScaleMultiplier().x*2.0, vsObj.getScaleMultiplier().y*2.0, vsObj.getScaleMultiplier().z*2.0));
			animation.setObjectId(vsObj.getId());
			that.animationManager.getAnimationGroup("SelectionAnimations").addAnimation(vsObj.getId(), animation);
			
			vsObj.setVisibility(that.showNodes, that.selectedVisualizationSetup.getShowNodeLabels());

			if (that.hiddenNodeIds.hasOwnProperty(newNodeId) && that.hiddenNodeIds[newNodeId] == true) {
				that.addNodeToScene(vsObj.getDatasetId(), vsObj.getId());
			}
			
			that.nodesBeingRendered.splice(that.nodesBeingRendered.indexOf(vsObj.getId()), 1);
			
			if (that.nodesBeingRendered.length == 0 && that.pendingDatasetId != null && !that.nodesBeingAdded) {
				that.addPendingConnections();
			} else if (!that.nodesBeingAdded && !that.connectionsBeingAdded && that.nodesBeingRendered.length == 0 && that.connectionsBeingRendered.length == 0) {
				that.pendingDatasetId = null;
				
				if (that.layoutPending) {
					that.updateSelectedLayout();
				}	
			}
			
		}
		
	};

	this.addConnectionVSObject = function(vsObj, selectionAnimation) {

		var newConnId  = vsObj.getId().substring(vsObj.getId().indexOf("_")+1);
		newConnId = newConnId.substring(0, newConnId.lastIndexOf("_"));

		if (that.datasets[that.selectedDataset].getConnection(newConnId) != null) {
		
			that.datasetVSObjects[vsObj.getDatasetId()][vsObj.getId()] = vsObj;
			
			vsObj.applyLayoutScale(that.layoutScale);

			if (that.selectedVisualizationSetup.getShowConnectionLabels() == 1) {
				vsObj.getLabelSprite().visible =  true;
			} else {
				vsObj.getLabelSprite().visible =  false;
			}
		
			vsObj.setVisibility(that.showConnections, that.selectedVisualizationSetup.getShowConnectionLabels());

			that.addConnectionToScene(vsObj.getDatasetId(), vsObj.getId());
			
			that.connectionsBeingRendered.splice(that.connectionsBeingRendered.indexOf(vsObj.getId()), 1);
			
			if (!that.nodesBeingAdded && !that.connectionsBeingAdded && that.nodesBeingRendered.length == 0 && that.connectionsBeingRendered.length == 0) {
				that.pendingDatasetId = null;
				
				if (that.layoutPending) {
					that.updateSelectedLayout();
				}	
			}
		}
		
	};
	
	this.addNodeToScene = function(datasetId, nodeId) {

		var vsObj = that.datasetVSObjects[datasetId][nodeId];
		var simpleId = nodeId.replace(datasetId+"_", "").replace("_node", "");
				
		that.scene.add(vsObj.getVisualizationObject());
		that.scene.add(vsObj.getSelectionObject());
		that.scene.add(vsObj.getHighlightingObject());
		that.scene.add(vsObj.getLabelSprite());

		that.layoutManager.addNode(vsObj.getDatasetId(), vsObj.getId());

		that.setHighlighted(vsObj, false);
		
		that.selectables.push(vsObj.getSelectionObject());
		
	};

	this.addConnectionToScene = function(datasetId, connectionId) {

		var vsObj = that.datasetVSObjects[datasetId][connectionId];
		
		var newConnId  = connectionId.substring(connectionId.indexOf("_")+1);
		newConnId = newConnId.substring(0, newConnId.lastIndexOf("_"));

		that.scene.add(vsObj.getVisualizationObject());
		that.scene.add(vsObj.getSelectionObject());
		that.scene.add(vsObj.getHighlightingObject());
		//that.scene.add(vsObj.getLabelSprite());

		if (vsObj.getFirstComponentObject() != null) {
			that.scene.add(vsObj.getFirstComponentObject());
		}

		if (vsObj.getSecondComponentObject() != null && that.datasets[datasetId].getConnection(newConnId) != null && that.datasets[datasetId].getConnection(newConnId).getBidirectional() == "TRUE") {
			that.scene.add(vsObj.getSecondComponentObject());
		}

		var connection = that.datasets[datasetId].getConnection(newConnId);
		that.layoutManager.addConnection(vsObj.getDatasetId(), connectionId, vsObj.getDatasetId() + "_" + vsObj.getSourceId() + "_node", vsObj.getDatasetId() + "_" + vsObj.getTargetId() + "_node", true,  that.datasets[datasetId].getConnection(newConnId).getWeight());

	};

	this.removeNodeFromScene = function(datasetId, nodeId) {

		var vsObj	= null;
		if (that.datasetVSObjects[datasetId] != undefined && that.datasetVSObjects[datasetId] != null) {
			vsObj = that.datasetVSObjects[datasetId][nodeId];
		}

		if (vsObj != undefined &&  vsObj != null) {
			delete that.datasetVSObjects[datasetId].nodeVisId;

			that.layoutManager.removeNode(datasetId, nodeId);

			that.scene.remove(vsObj.getSelectionObject());
			that.scene.remove(vsObj.getLabelSprite());
			that.scene.remove(vsObj.getHighlightingObject());
			that.scene.remove(vsObj.getVisualizationObject());
			
			if (that.selectables.indexOf(vsObj.getSelectionObject()) != -1) {
				that.selectables.splice(that.selectables.indexOf(vsObj.getSelectionObject()), 1);
			}
		}
				
	};

	this.removeConnectionFromScene = function(datasetId, connectionId) {

		var vsObj = null;
		if (that.datasetVSObjects[datasetId] != undefined && that.datasetVSObjects[datasetId] != null) {
			vsObj = that.datasetVSObjects[datasetId][connectionId];
		}
		
		if (vsObj != undefined &&  vsObj != null) {	
			delete that.datasetVSObjects[datasetId].connectionVisId;

			that.layoutManager.removeConnection(datasetId, connectionId);

			if (vsObj.getFirstComponentObject() != null) {
				that.scene.remove(vsObj.getFirstComponentObject());
			}
			if (vsObj.getSecondComponentObject() != null) {
				that.scene.remove(vsObj.getSecondComponentObject());
			}
			
			that.scene.remove(vsObj.getSelectionObject());
			that.scene.remove(vsObj.getLabelSprite());
			that.scene.remove(vsObj.getHighlightingObject());
			that.scene.remove(vsObj.getVisualizationObject());

			that.selectables.splice(that.selectables.indexOf(vsObj.getSelectionObject()), 1);
		}

	};

	this.addLightToScene = function(obj) {

		that.scene.add(obj);

	};

	this.addBackgroundObjectToScene = function(vsObj, selectionAnimation) {

		if (vsObj.type === "MirrorSurface") {
			vsObj.getVisualizationObject().material = new THREE.MeshBasicMaterial({
				color : 0xffffff,
				envMap : that.reflectionCamera.renderTarget
			});
			vsObj.applyPosition(new THREE.Vector3(0.0, 0.0, 249.9));
		}

		vsObj.setVisibility(true, false);	
		
		that.backgroundVSObjects[vsObj.getId()] = vsObj;
		that.scene.add(vsObj.getVisualizationObject());

		that.backgroundObjectsBeingRendered.splice(that.backgroundObjectsBeingRendered.indexOf(vsObj.getId()), 1);

	};

	this.removeNode = function(datasetId, nodeId) {

		if (that.datasets[datasetId].getNode(nodeId) != null) {
			that.datasets[datasetId].removeNode(nodeId);
			
			if (that.selectedNodes[nodeId] != undefined && that.selectedNodes[nodeId] != null) {
				delete that.selectedNodes.nodeId;
			}

			/*
			var connections = that.datasets[datasetId].getConnections();
			for (var connectionId in connections) {
				var connection = connections[connectionId];
				if (connection.getSourceId() == nodeId || connection.getTargetId() == nodeId) {
					that.removeConnection(datasetId, connection.getId());
				}
			}
			*/
			
			var nodeVisId = datasetId + "_" + nodeId + "_node";
			if (that.datasetVSObjects[datasetId][nodeVisId] != null) {
				that.removeNodeFromScene(datasetId, nodeVisId);
			}
		}
		
	};

	this.removeConnection = function(datasetId, connectionId) {

		that.datasets[datasetId].removeConnection(connectionId);

		if (that.selectedConnections[connectionId] != undefined && that.selectedConnections[connectionId] != null) {
			delete that.selectedConnections.connectionId;
		}

		var connectionVisId = datasetId + "_" + connectionId + "_connection";
		
		that.removeConnectionFromScene(datasetId, connectionVisId);
		
	};

	this.removeLightFromScene = function(visId, obj) {
		that.removeFromScene(visId);
	};

	this.removeBackgroundObjectFromScene = function(visId, obj) {
		that.removeFromScene(visId);
	};

	this.removeFromScene = function(objectId) {

		var objectToRemove = that.scene.getObjectByName(objectId);

		if (objectToRemove != undefined && objectToRemove != null) {
			that.scene.remove(objectToRemove);
		}

	};

	this.getFromScene = function(visId) {

		var obj = that.scene.getObjectByName(visId);
		
		if (obj == undefined || obj == null) {
			return null;
		} else {
			return obj;
		}

	};

	this.clearScene = function(clearDatasets, clearLights, clearBackgroundObjects) {

		if (clearDatasets) {
			for (var datasetId in that.datasets) {
				that.removeDatasetFromScene(datasetId);
			}
		}

		if (that.selectedVisualizationSetup != undefined && that.selectedVisualizationSetup != null) {
			if (clearLights) {
				var lightsToRemove = that.selectedVisualizationSetup.getLights();
				for (var lightId in lightsToRemove) {
					that.removeLightFromScene(lightId);
				}
			}

			if (clearBackgroundObjects) {
				var backgroundObjectsToRemove = that.selectedVisualizationSetup.getBackgroundObjects();
				for (var backgroundObjectId in backgroundObjectsToRemove) {
					that.removeBackgroundObjectFromScene("VisualizationSetup_"+backgroundObjectId+"_background_object");
				}
			}
		}

	};

	this.getDatasets = function() {
		return that.datasets;
	};

	this.setDatasets = function(datasets) {

		that.clearScene(true, false, false);
		for (var datasetId in datasets) {
			that.addDataset(datasets[datasetId]);
		}

	};

	this.getPerspective = function () {
		return that.perspective;
	};
	
	this.setPerspective = function (on) {
		that.setTransformEnabled(that.INTERSECTED, false);
		if (on) {
			that.perspective = true;
			//that.camera.zoom = 1.0;
			that.camera.toPerspective();
			//that.camera = new THREE.PerspectiveCamera(45, that.getWidth() / that.getHeight(), 1, 1000);
			//that.camera.updateProjectionMatrix();
			//that.controls = new THREE.OrbitControls(that.camera, that.canvas);
			that.controls.noRotate = true;
			that.controls.zoom = false;
			that.setCameraSetup(new CameraSetup(0, -100, 100, 0, 0, 0, 1.0));
		} else {
			that.perspective = false;
			//that.camera.zoom = 5.0;
			that.camera.toOrthographic();
			//that.camera = new THREE.OrthographicCamera(that.getWidth()/-32.0, that.getWidth()/32.0, that.getHeight()/32.0, that.getHeight()/-32.0, 1, 1000);
			//that.camera.updateProjectionMatrix();
			//that.controls = new THREE.OrbitControls(that.camera, that.canvas);
			that.controls.noRotate = true;
			that.controls.zoom = false;
			that.controls.panSpeed = 0.0001;
			that.setCameraSetup(new CameraSetup(0, 100, 0, 0, 0, 0, 1.0));
		}
		if (that.selectedDataset != null) {
			that.layoutManager.setDatasetLayout(that.selectedDataset, new ForceDirectedLayout(100, that.layoutManager, that.perspective));
			that.updateSelectedLayout();
		}
	};

	this.addVisualizationStyle = function (datasetId, visualizationStyle) {
		
		if (that.visualizationStyles[datasetId] == undefined || that.visualizationStyles[datasetId] == null) {
			that.visualizationStyles[datasetId] = {};
		}
		that.visualizationStyles[datasetId][visualizationStyle.getId()] = visualizationStyle;
		
	};
	
	this.addDataset = function(dataset, visualizationStyles) {
		
		that.datasets[dataset.getId()] = dataset;
			
		if (visualizationStyles != undefined && visualizationStyles != null) {
			that.visualizationStyles[dataset.getId()] = visualizationStyles;
		} else {
			var styles = {};
			styles[VisualizationStyle.prototype.getDefault().getId()] = VisualizationStyle.prototype.getDefault();
			that.visualizationStyles[dataset.getId()] = styles;
		}
		
		// var layout = that.visualizationStyles[dataset.getId()].getLayout();
		// if (layout == undefined || layout == null) {
			// that.layoutManager.setDatasetLayout(dataset.getId(), "Random");
		// } else {
			// that.layoutManager.setDatasetLayout(dataset.getId(), layout);
		// }
				
	};

	this.addSelectedDatasetToScene = function () {

		that.pendingDatasetId = that.selectedDataset;
		
		var dataset = that.datasets[that.selectedDataset];

		that.datasetVSObjects[that.selectedDataset] = {};
		
		var nodes = dataset.getNodes();
		var connections = dataset.getConnections();

		for (var key in connections) {
			var connection = connections[key];
			that.pendingConnections[connection.getId()] = connection;
		}

		that.nodesBeingAdded = true;
		for (var key in nodes) {
			var node = nodes[key];
			that.generateNodeObject(dataset.getId(), node.getId() + "_node", node, true, true);
		}
		that.nodesBeingAdded = false;

		if (that.nodesBeingRendered.length == 0) {
			that.addPendingConnections();
		}

		if (!that.nodesBeingAdded && !that.connectionsBeingAdded && that.nodesBeingRendered.length == 0 && that.connectionsBeingRendered.length == 0) {
			that.pendingDatasetId = null;
			if (that.layoutPending) {
				that.updateSelectedLayout();
			}	
		}

	};

	this.addPendingConnections = function () {

		that.connectionsBeingAdded = true;
		for (var key in that.pendingConnections) {
			var connection = that.pendingConnections[key];
			delete that.pendingConnections[key];
			var fromNode = that.datasetVSObjects[that.selectedDataset][that.selectedDataset + "_" + connection.getSourceId() + "_node"].getVisualizationObject();
			var toNode = that.datasetVSObjects[that.selectedDataset][that.selectedDataset + "_" + connection.getTargetId() + "_node"].getVisualizationObject();
			if (fromNode != null && toNode != null) {
				that.generateConnectionObject(that.pendingDatasetId, connection.getId() + "_connection", connection, fromNode.position, toNode.position, true, true);
			} else {
				console.log("Problem generating connection!");
			}
		}
		that.connectionsBeingAdded = false;
		
		if (!that.nodesBeingAdded && !that.connectionsBeingAdded && that.nodesBeingRendered.length == 0 && that.connectionsBeingRendered.length == 0) {
			that.pendingDatasetId = null;

			if (that.layoutPending) {
				that.updateSelectedLayout();
			}	
		}
		
	};

	this.removeDataset = function(datasetId) {

		if (that.selectedDataset == datasetId) {
			that.selectedDataset = null;
		}
		if (datasetId in that.datasets) {
			that.removeDatasetFromScene(datasetId);
			delete that.datasets[datasetId];
		}

	};
	
	this.removeAllDatasets = function() {
		
		that.INTERSECTED = null;
		that.selectables = new Array();
	
		that.setTransformEnabled(that.INTERSECTED, false);
		
		that.selectedNodes = {};
		that.selectedConnections = {};
		that.hiddenNodeIds = {};
		
		for ( datasetId in that.datasets) {
			that.removeDataset(datasetId);
		}
		
	};

	this.removeDatasetFromScene = function(datasetId) {

		if (datasetId in that.datasets) {
			var datasetToRemove = that.datasets[datasetId];
			var nodesToRemove = datasetToRemove.getNodes();
			var connectionsToRemove = datasetToRemove.getConnections();

			for (var nodeId in nodesToRemove) {
				that.removeNodeFromScene(datasetToRemove.getId(), datasetToRemove.getId() + "_" + nodeId + "_node");
			}
			for (var connectionId in connectionsToRemove) {
				that.removeConnectionFromScene(datasetToRemove.getId(), datasetToRemove.getId() + "_" + connectionId + "_connection");
			}
		}

	};

	this.getCamera = function () {
			return that.camera;
	};
	
	this.getCameraSetup = function() {
		return that.cameraSetup;
	};

	this.setCameraSetup = function(cameraSetup) {
		
		if (cameraSetup != null) {
			that.cameraSetup = cameraSetup;
		}
		
		if (that.cameraSetup == null) {
			that.cameraSetup = new CameraSetup(0, 0, 0, 0, 0, 0, 1.0);
		}

		try {
			that.controls.center.x= 0;
			that.controls.center.y= 0;
			that.controls.center.z= 0;
		} catch (err) {}
		
		try {
			that.camera.position.set(that.cameraSetup.getX(), that.cameraSetup.getY(), that.cameraSetup.getZ());
		} catch (err) {}
		
		try {
			that.camera.lookAt(new THREE.Vector3(that.cameraSetup.getTargetX(), that.cameraSetup.getTargetY(), that.cameraSetup.getTargetZ()));
		} catch (err) {}

		if (that.perspective) {
			that.camera.rotation.y = -Math.PI/2.0;	
		}
		
		that.camera.zoom = cameraSetup.getZoom();
		that.camera.updateProjectionMatrix();
		
	};

	this.getEditing = function() {
		return that.editing;
	};

	this.setEditing = function(editing) {

		that.editing = editing;
		//TODO: Lock down user interaction or visualizationSetup/dataset/look-and-feel changes, etc. as needed

	};

	this.getHighlightedNodes = function() {

	};

	this.setHighlightedNodes = function(highlightedNodeIds) {

	};

	this.highlightNode = function(highlightedNodeId) {

	};

	this.dehighlightNode = function(dehighlightedNodeId) {

	};

	this.getHighlightedConnections = function() {

	};

	this.setHighlightedConnections = function(highlightedConnectionIds) {

	};

	this.highlightConnection = function(highlightedConnectionId) {

	};

	this.dehighlightConnection = function(dehighlightedConnectionId) {

	};

	this.setNodeVisibility = function(datasetId, nodeId, visible) {

		var newNodeId  = nodeId.substring(nodeId.indexOf("_")+1);
		newNodeId = newNodeId.substring(0, newNodeId.lastIndexOf("_"));
		
		var datasetObj = that.datasetVSObjects[datasetId][nodeId];
		if (datasetObj != null) {
			if (that.setShowNodes && visible) {
				datasetObj.setVisibility(visible, that.selectedVisualizationSetup.getShowNodeLabels(), true, true);
				that.addNodeToScene(datasetObj.getDatasetId(), datasetObj.getId());
			} else {
				datasetObj.setVisibility(visible, false, false);
				that.removeNodeFromScene(datasetObj.getDatasetId(), datasetObj.getId());
			}
		}				

	};

	this.setConnectionVisibility = function(datasetId, connectionId, visible) {

		var datasetObj = that.datasetVSObjects[datasetId][connectionId];
		if (datasetObj != null) {
			if (that.setShowConnections && visible) {
				datasetObj.setVisibility(visible, that.selectedVisualizationSetup.getShowConnectionLabels(), true);
				if (that.selectables.indexOf(datasetObj.getSelectionObject()) == -1) {
					that.selectables.push(datasetObj.getSelectionObject());
				}
			} else {
				datasetObj.setVisibility(visible, false, false);
				that.selectables.splice(that.selectables.indexOf(datasetObj.getSelectionObject()), 1);
			}
		}		
	};

	this.addCallbackHandler = function(callbackHandler) {

	};

	this.removeCallbackHandler = function(callbackHandlerId) {

	};

	this.pauseAnimations = function() {

	};

	this.resumeAnimations = function() {

	};

	this.getAnimationState = function() {

	};

	this.setOffscreenRendering = function(enableOffscreenRendering) {

	};
	
	this.onDocumentMouseMove = function(event) {

//		event.preventDefault();

        var rect = that.canvas.getBoundingClientRect();
		
		that.mouse.x = ((event.clientX - rect.left)/ (that.canvas.width/window.devicePixelRatio)) * 2 - 1;
		that.mouse.y = -((event.clientY - rect.top) / (that.canvas.height/window.devicePixelRatio)) * 2 + 1;
		
		if (that.areaSelect && that.lastMouseDownX != null) {
			
			if (that.perspective) {
				var sizeMultiplier = 50.0;
				that.selectionCube.scale.x = Math.abs(that.mouse.x-that.lastMouseDownX)*2.0*sizeMultiplier;
				that.selectionCube.scale.y = Math.abs(that.mouse.y-that.lastMouseDownY)*2.0*sizeMultiplier;
				that.selectionCube.scale.z = Math.sqrt(Math.pow(that.selectionCube.scale.x, 2.0)+Math.pow(that.selectionCube.scale.y, 2.0));
				var vector = new THREE.Vector3((that.mouse.x+that.lastMouseDownX)/2.0*sizeMultiplier, (that.mouse.y+that.lastMouseDownY)/2.0*sizeMultiplier, 0);
				that.projector.unprojectVector(vector, that.camera);
				that.selectionCube.position = vector;			
				that.selectionCube.rotation.x = that.camera.rotation.x;
				that.selectionCube.rotation.y = that.camera.rotation.y;
				that.selectionCube.rotation.z = that.camera.rotation.z;
				that.selectionCube.translateZ(-1.0*that.selectionCube.scale.z-Math.sqrt(sizeMultiplier));
				that.selectionTransformControls.update();
			} else {
				var vector = new THREE.Vector3(that.mouse.x, that.mouse.y, -1);
				that.projector.unprojectVector(vector, that.camera);
				vector.z = 0;
				var vector2 = new THREE.Vector3(that.lastMouseDownX, that.lastMouseDownY, -1);
				that.projector.unprojectVector(vector2, that.camera);
				vector2.z = 0;
				
				var width = Math.abs(vector.x-vector2.x);
				var height = Math.abs(vector.y-vector2.y);
				var diagonal = 20.0;
				
				var centerX = (vector.x+vector2.x)/2.0;
				//var centerY = diagonal;
				var centerZ = (vector.y+vector2.y)/2.0;
				
				//that.selectionCube.lookAt(that.camera);
				that.selectionCube.scale.x = width;
				that.selectionCube.scale.y = height;
				that.selectionCube.scale.z = diagonal;
				that.selectionCube.position = new THREE.Vector3(centerX, centerY, centerZ);
				that.selectionTransformControls.update();
			}
			
		}
				
	};

	this.onMouseUp = function(event) {

//		event.preventDefault();
		
		if (that.INTERSECTED != undefined && that.INTERSECTED != null) {
		
			if (that.detectLeftButton(event)) {
				if (that.INTERSECTED.getId() === that.mouseDownObjectName) {
					if (that.lastMouseDownX == that.mouse.x && that.lastMouseDownY == that.mouse.y) {
							that.toggleSelected();		
					}
					//that.toggleAnimation();
				}
			} else if (that.detectRightButton(event)) {

				// if (that.INTERSECTED.id === that.mouseDownObjectName) {
					// if (that.INTERSECTED.getIsConnection()) {
						// that.removeConnection(that.INTERSECTED.datasetId, that.INTERSECTED.id);
					// } else {
						// that.removeNode(that.INTERSECTED.datasetId, that.INTERSECTED.id);
					// }
					// that.INTERSECTED = null;
				// } 
							
			}

		} else if (that.detectRightButton(event)) {

		}

		that.lastMouseDownX = null;
		that.lastMouseDownY = null;

		that.mouseDownObjectName = null;
			
	};

	this.toggleSelected = function () {
	
		if (!that.drawingConnection && that.selectionCube == null) {
			if (!that.controlDown) {
				
				var multipleSelectedCheck = false;
				if (!that.INTERSECTED.getSelected() || (Object.keys(that.selectedNodes).length+Object.keys(that.selectedConnections).length) > 1) {
					multipleSelectedCheck = true;
				}
				
				that.clearSelectedNodes();
				that.clearSelectedConnections();

				if (!that.INTERSECTED.getIsConnection()) {
					if (multipleSelectedCheck) {
						that.setNodeSelected(that.INTERSECTED.getId(), true);
						that.setTransformEnabled(that.INTERSECTED, true);
					} else {
						that.setNodeSelected(that.INTERSECTED.getId(), false);
						that.attachTransformRandomly();
					}
				} else {
					if (multipleSelectedCheck) {
						that.setConnectionSelected(that.INTERSECTED.getId(), true);
						that.attachTransformRandomly();
					} else {
						that.setConnectionSelected(that.INTERSECTED.getId(), false);
						that.attachTransformRandomly();
					}
				}

			} else {
			
				if (that.INTERSECTED.getSelected()) {
					if (!that.INTERSECTED.getIsConnection()) {
						that.setNodeSelected(that.INTERSECTED.getId(), false);
						that.attachTransformRandomly();
					} else {
						that.setConnectionSelected(that.INTERSECTED.getId(), false);
						that.attachTransformRandomly();
					}
				} else {
					if (!that.INTERSECTED.getIsConnection()) {
						that.setNodeSelected(that.INTERSECTED.getId(), true);
						that.setTransformEnabled(that.INTERSECTED, true);
					} else {
						that.setConnectionSelected(that.INTERSECTED.getId(), true);
						that.attachTransformRandomly();
					}
				}

			}			
			
			if (that.selectionChangeCallback != undefined || that.selectionChangeCallback != null) {
				that.selectionChangeCallback.call(that);
			}
		} else if (that.drawingConnection && that.selectionCube == null) {
			if (!that.INTERSECTED.getIsConnection()) {

				if (that.sourceNode == null) {
					var cleanId = that.INTERSECTED.getId().substring(that.INTERSECTED.getId().indexOf("_")+1);
					cleanId = cleanId.substring(0, cleanId.lastIndexOf("_"));
					that.sourceNode = cleanId;
					that.targetNode = cleanId;
					that.updateLine();
					that.scene.add(that.tempConnection);
				} else {
					var cleanId = that.INTERSECTED.getId().substring(that.INTERSECTED.getId().indexOf("_")+1);
					cleanId = cleanId.substring(0, cleanId.lastIndexOf("_"));
					if (that.sourceNode != cleanId) {
						that.connectionDrawnCallback(that.sourceNode, cleanId);
						that.sourceNode = null;
						that.targetNode = null;
						that.scene.remove(that.tempConnection);
					} else {
						that.sourceNode = null;
						that.targetNode = null;
						that.scene.remove(that.tempConnection);
					}
				}
				
			}
		}
	};
	
	this.attachTransformRandomly  = function () {
			
		var check = false;
		for (var selectedNodeId in that.selectedNodes) {
			that.setTransformEnabled(that.datasetVSObjects[that.selectedDataset][selectedNodeId], true);
			check = true;
			break;
		}
		
		if (!check) {
			that.setTransformEnabled(that.INTERSECTED, false);
		} 
	
	}
	
	this.setNodeSelected = function (nodeId, selected) {
		
		var node = that.datasetVSObjects[that.selectedDataset][nodeId];
		
		if (node != undefined && node != null) {
			if (selected) {
				node.setSelected(true, that.contrastColor);
				that.selectedNodes[node.getId()] = 1;
			} else {
				node.setSelected(false, that.contrastColor);
				delete that.selectedNodes[node.getId()];
			}
		}	
		
	};
	
	this.setConnectionSelected = function (connectionId, selected) {
	
		var connection = that.datasetVSObjects[that.selectedDataset][connectionId];
		
		if (selected) {
			connection.setSelected(true, that.contrastColor);
			that.selectedConnections[connection.getId()] = 1;
		} else {
			connection.setSelected(false, that.contrastColor);
			delete that.selectedConnections[connection.getId()];
		}
	
	};
	
	this.getSelectedNodes = function() {
		var returnNodes = {};
		Object.keys(that.selectedNodes).forEach(function(key,index) {
			var cleanId = key.substring(key.indexOf("_")+1);
			cleanId = cleanId.substring(0, cleanId.lastIndexOf("_"));
			returnNodes[cleanId] = 1.0;
		});
		return returnNodes;
	};
	
	this.getSelectedConnections = function() {
		var returnConnections = {};
		Object.keys(that.selectedConnections).forEach(function(key,index) {
			var cleanId = key.substring(key.indexOf("_")+1);
			cleanId = cleanId.substring(0, cleanId.lastIndexOf("_"));
			returnConnections[cleanId] = 1.0;
		});
		return returnConnections;
	};
	
	this.setSelectedNodes = function(nodeIds) {
		that.setTransformEnabled(that.INTERSECTED, false);
		that.selectedNodeLocations = {};
		that.clearSelectedNodes();
		for (var i = 0; i < nodeIds.length; i++) {
			that.setNodeSelected(that.selectedDataset+"_"+nodeIds[i]+"_node", true);
		}
	};
	
	this.setSelectedConnections = function(connectionIds) {
		that.clearSelectedConnections();
		for (var i = 0; i < connectionIds.length; i++) {
			that.setConnectionSelected(that.selectedDataset+"_"+connectionIds[i]+"_connection", true);
		}
	};
	
	this.clearSelectedNodes = function () {
		that.setTransformEnabled(that.INTERSECTED, false);
		Object.keys(that.datasetVSObjects[that.selectedDataset]).forEach(function(key,index) {
			if (!that.datasetVSObjects[that.selectedDataset][key].getIsConnection()) {
				that.setNodeSelected(key, false);
			}
		});
		that.selectedNodeLocations = {};
	};
	
	this.clearSelectedConnections = function () {
		Object.keys(that.datasetVSObjects[that.selectedDataset]).forEach(function(key,index) {
			if (that.datasetVSObjects[that.selectedDataset][key].getIsConnection()) {
				that.setConnectionSelected(key, false);
			}
		});
	};
	
	this.toggleAnimation = function () {

		var animation = that.animationManager.getAnimationGroup("SelectionAnimations").getAnimation(that.INTERSECTED.getId() + 
	"_SelectionAnimation");
		if (animation != undefined && animation != null) {
			if (animation.paused) {
				animation.resume();
			} else {
				animation.pause();
				animation.reset();
			}
		}

	};

	this.setNodeAnimation = function (nodeId, on) {
		
		var animation = that.animationManager.getAnimationGroup("SelectionAnimations").getAnimation(that.selectedDataset + "_" + nodeId + "_node" +
	"_SelectionAnimation");
		if (animation != undefined && animation != null) {
			if (on) {
				animation.resume();
			} else {
				animation.pause();
				animation.reset();
			}
		}

	};
	
	this.onMouseDown = function(event) {

//		event.preventDefault();
			
		that.lastMouseDownX = that.mouse.x;
		that.lastMouseDownY = that.mouse.y;
			
		if (that.areaSelect && that.selectionCube == null) {
		
			var geometry = new THREE.BoxGeometry(1.0, 1.0, 1.0);
			//var material = new THREE.MeshPhongMaterial({ ambient: 0xff0000, color: 0xff0000, specular: 0x555555, shininess: 5, shading: THREE.FlatShading });
			var material  = new THREE.MeshBasicMaterial( { color: that.contrastColor, wireframe: true } );
			// material.transparent = true;
			// material.opacity = 0.2;
			
			that.selectionCube = new THREE.Mesh(geometry, material);
			that.selectionCube.scale.x = 20.0;
			that.selectionCube.scale.y = 20.0;
			that.selectionCube.scale.z = 20.0;
			that.selectionCube.rotation.x = that.camera.rotation.x;
			that.selectionCube.rotation.y = that.camera.rotation.y;
			that.selectionCube.rotation.z = that.camera.rotation.z;

			that.scene.add(that.selectionCube);

			if (that.perspective) {
				var vector = new THREE.Vector3(that.mouse.x*50.0, that.mouse.y*50, -1);
				that.projector.unprojectVector(vector, that.camera);
				that.selectionCube.position = vector;
				that.selectionCube.translateZ(-50.0);
				//that.selectionCube.lookAt(that.camera);
			} else {
				var vector = new THREE.Vector3(that.mouse.x, that.mouse.y, -1);
				that.projector.unprojectVector(vector, that.camera);
				vector.z = -0.5;
				that.selectionCube.position = vector;
				//that.selectionCube.lookAt(that.camera);
			}
			
			that.selectionTransformControls = new THREE.TransformControls(that, that.camera, that.renderer.domElement, that.mouse, that.perspective, true);
			that.selectionTransformControls.setSpace("local");
			that.scene.add(that.selectionTransformControls);
			that.selectionTransformControls.attach(that.selectionCube);
			that.selectionTransformControls.update();

		} else {
			
			if (that.INTERSECTED != undefined && that.INTERSECTED != null) {
					
				that.lastContext = that.INTERSECTED;
			
				if (that.detectLeftButton(event)) {
					that.mouseDownObjectName = that.INTERSECTED.getId();
				} else {
					that.mouseDownObjectName = that.INTERSECTED.getId();
				}
			} else {
				if (!that.detectLeftButton(event)) {
					that.lastContext = null;
					that.setSelectedNodes(new Array());
					that.setTransformEnabled(that.INTERSECTED, false);
				} 
			}

		}			
		
	};

	this.saveSelectedNodeLocations = function () {
	
		that.selectedNodePositions = {};
		for (var selectedNodeId in that.selectedNodes) {
			that.selectedNodePositions[selectedNodeId] = new THREE.Vector3(that.datasetVSObjects[that.selectedDataset][selectedNodeId].position.x, that.datasetVSObjects[that.selectedDataset][selectedNodeId].position.y, that.datasetVSObjects[that.selectedDataset][selectedNodeId].position.z);
		}		
		
	};
	
	this.clearSelectedNodeLocations = function () {
		
		that.selectedNodePositions = {};
		
	};
	
	this.setTransformEnabled = function(obj, enabled) {
	
		if (enabled) {
		//	that.layoutManager.getDatasetLayout(that.selectedDataset).setPaused(true);
			//this.setCanRotate(false);
			if (that.transformControls != null) {
				that.scene.remove(that.transformControls);
			}

			if (that.transformControls != undefined && that.transformControls != null) {
				that.transformControls.detach();
				that.transformControls = null;
			}
			that.transformControls = new THREE.TransformControls(that, that.camera, that.renderer.domElement, that.mouse, that.perspective, false );
			that.transformControls.setSize(0.5);
			that.scene.add(that.transformControls);
			that.transformControls.attach(obj.getVisualizationObject());
		} else {
		//	that.layoutManager.getDatasetLayout(that.selectedDataset).setPaused(false);
			//this.setCanRotate(true);
			if (that.transformControls != undefined && that.transformControls != null) {
				that.transformControls.detach();
				that.scene.remove(that.transformControls);
				that.transformControls = null;
			}
		}
		 
	};
	
	this.onMouseWheel = function(event) {

		event.preventDefault();
	
		if (that.perspective == false) {
		
			var delta = 0;

			if ( event.wheelDelta !== undefined ) {
				// WebKit / Opera / Explorer 9
				delta = event.wheelDelta;
			} else if ( event.detail !== undefined ) {
				// Firefox
				delta = - event.detail;
			}

			if (delta > 0) {
				that.camera.zoom = Math.max( 0, Math.min( Infinity, this.camera.zoom / 0.95 ) );
			} else {
				that.camera.zoom = Math.max( 0, Math.min( Infinity, this.camera.zoom * 0.95 ) );
			}
			
			that.camera.updateProjectionMatrix();
			
		}
		
	};

	this.setShortcutsEnabled = function(enabled) {
		that.shortcutsEnabled = enabled;
	};
	
	this.onKeyDown = function(event) {
		
		var keyCode = null;
		
		if (event.which == null) {
			keyCode= event.keyCode;    // old IE
		}
		else if (event.which != 0) {
			keyCode= event.which;	  // All others
		}
		else {
			keyCode = null;
		}

		if (keyCode == 17) {
			that.controlDown = true;
		} else if (keyCode == 16) {
			this.setCanRotate(false);
			if (!that.areaSelect) {
				if (that.selectionCube != null) {
					that.selectionTransformControls.detach();
					that.scene.remove(that.selectionTransformControls);
					that.scene.remove(that.selectionCube);
					that.updateAreaSelection();
					that.selectionCube = null;
				}
			}
			that.areaSelect = true;
		} /*else if (keyCode == 83) {
			if (that.selectionTransformControls.getMode() == "translate") {
				that.selectionTransformControls.setMode("scale");
			} else {
				that.selectionTransformControls.setMode("translate");
			}
		}*/

	};
		
	this.updateAreaSelection = function () {
	
		var scale = that.selectionCube.scale.clone().multiplyScalar(0.5);
		var min = that.selectionCube.position.clone().sub(scale);
		var max = that.selectionCube.position.clone().add(scale);
		
		var boundary = new THREE.Box3(min, max);
		
		var cumulative = that.controlDown;
		
		if (!cumulative) {
			that.clearSelectedNodes();
			that.clearSelectedConnections();
		}
		
		for (var objId in that.datasetVSObjects[that.selectedDataset]) {
			var obj = that.datasetVSObjects[that.selectedDataset][objId];
			
			if (obj.getIsConnection()) {
				var point = obj.sourcePosition.clone();
				point = point.add(obj.targetPosition);
				point = point.multiplyScalar(0.5*that.layoutScale);
				if (boundary.containsPoint(point)) {
					if (!cumulative) {
						that.setConnectionSelected(objId, true);
					} else {
						if (obj.getSelected()) {
							that.setConnectionSelected(objId, false);
						} else {
							that.setConnectionSelected(objId, true);
						}
					}
				} 
			} else {
				var point = obj.position.clone().multiplyScalar(that.layoutScale);
				if (boundary.containsPoint(point)) {
					if (!cumulative) {
						that.setNodeSelected(objId, true);
					} else {
						if (obj.getSelected()) {
							that.setNodeSelected(objId, false);
						} else {
							that.setNodeSelected(objId, true);
						}					
					}
				}
			}
			
		}
		
		that.attachTransformRandomly();
		if (that.selectionChangeCallback != undefined || that.selectionChangeCallback != null) {
			that.selectionChangeCallback.call(that);
		}
		if (document.getElementById("searchBox").value.length > 0 && !document.getElementById("searchBox").value.includes("MODIFIED")) {
			if (that.controlDown) {
				document.getElementById("searchBox").value = "MODIFIED "+document.getElementById("searchBox").value;
				document.getElementById("advancedSearchText").innerHTML = "MODIFIED";
			} else {
				document.getElementById("searchBox").value = "";//"MODIFIED "+document.getElementById("searchBox").value;
				document.getElementById("advancedSearchText").innerHTML = "";//"MODIFIED";
			}
		}
		if (!that.controlDown) {
			document.getElementById("searchBox").value = "";//"MODIFIED "+document.getElementById("searchBox").value;
			document.getElementById("advancedSearchText").innerHTML = "";//"MODIFIED";
		}
	};
		
	this.onKeyUp = function(event) {
			
		var keyCode = null;
		
		if (event.which == null) {
			keyCode= event.keyCode;    // old IE
		}
		else if (event.which != 0) {
			keyCode= event.which;	  // All others
		}
		else {
			keyCode = null;
		}

		if (keyCode == 17) {
			that.controlDown = false;
		} else  if (keyCode == 16) {
			this.setCanRotate(true);
			that.areaSelect = false;
		}
		
	};
	
	
	this.onKeyPress = function(event) {

		//event.preventDefault();
		
		var character = null;
		
		if (event.which == null) {
			character= String.fromCharCode(event.keyCode);    // old IE
		}
		else if (event.which != 0 && event.charCode != 0) {
			character= String.fromCharCode(event.which);	  // All others
		}
		else {
			character = null;
		}
		
		/*
		if (that.shortcutsEnabled && character != null) {
			if (character == '-' || character == '-') {
				if (that.layoutScale > 1.0) {
					that.setLayoutScale.call(that, that.layoutScale-1.0);
				}
			} else if (character == '=' || character == '+') {
				that.setLayoutScale.call(that, that.layoutScale+1.0);
			} 

		 }
		 */
	};

	this.detectLeftButton = function(evt) {

		evt = evt || window.event;
		var button = evt.which || evt.button;
		return button == 1;

	};

	this.detectRightButton = function(evt) {

		evt = evt || window.event;
		var button = evt.which || evt.button;
		return button == 3;

	};

	this.enableTransformOnIntersected = function () {

		var obj = that.INTERSECTED.getVisualizationObject();
		//obj.material.opacity = 0.5;
		//that.transformControls.attach(obj);

	};

	this.disableTransformOnIntersected = function () {

		var obj = that.INTERSECTED.getVisualizationObject();
		//obj.material.opacity = 1.0;
		//that.transformControls.attach(obj);

	};

	this.setCanRotate = function (on) {
		if (that.controls != undefined && that.controls != null) {
			if (!on) {
				if (that.perspective == true) {
					that.controls.noRotate = false;
				}
			} else {
				if (that.perspective == true) {
					that.controls.noRotate = true;
				}
			}
		}
	};
	
	this.getCanRotate = function () {
		
	};
	
	this.getIntersected = function () {
		if (that.INTERSECTED != null) {
			var cleanId = that.INTERSECTED.id.substring(that.INTERSECTED.id.indexOf("_")+1);
			cleanId = cleanId.substring(0, cleanId.lastIndexOf("_"));
			return cleanId;
		} else {
			return null;
		}
	};
	
	this.checkIntersections = function() {

		var intersects = null;
		
		var rect = that.canvas.getB

		var tempSelectables = new Array();
		for (var i = 0; i < that.selectables.length; i++) {
			var tempObj = that.datasetVSObjects[that.selectables[i].datasetId][that.selectables[i].name];
			if (tempObj.getVisibility()) {
				tempSelectables.push(that.selectables[i]);
			}
		}
			
		if (that.perspective) {

			var vector = new THREE.Vector3(that.mouse.x, that.mouse.y, 1);
			that.projector.unprojectVector(vector, that.camera);

			that.raycaster.set(that.camera.position, vector.sub(that.camera.position).normalize());

			intersects = that.raycaster.intersectObjects(tempSelectables);
			
		} else {
		
			var dir = new THREE.Vector3();

			var vector = new THREE.Vector3(that.mouse.x, that.mouse.y, 1);
			
			vector.set( ( that.mouse.x ) , ( that.mouse.y ), -1); // z = - 1 important!

			that.projector.unprojectVector(vector, that.camera);

			dir.set( 0, 0, -1 ).transformDirection( that.camera.matrixWorld );

			that.raycaster.set( vector, dir );

			intersects = that.raycaster.intersectObjects(tempSelectables);
		}
		
		if (intersects.length > 0) {
					
			var latestIntersected = that.datasetVSObjects[intersects[0].object.datasetId][intersects[0].object.name];
			if (that.INTERSECTED != latestIntersected) {

				if (that.INTERSECTED) {
					that.setHighlighted(that.INTERSECTED, false);
					//that.disableTransformOnIntersected();
				}

				that.INTERSECTED = latestIntersected;

				that.setHighlighted(that.INTERSECTED, true);
				if (that.hoverCallback != undefined && that.hoverCallback != null) {
					if (that.INTERSECTED.id.includes("_node")) {
						var cleanId = that.INTERSECTED.id.substring(that.INTERSECTED.id.indexOf("_")+1);
						cleanId = cleanId.substring(0, cleanId.lastIndexOf("_"));
						that.hoverCallback(cleanId, null);
					} else {
						var cleanId = that.INTERSECTED.id.substring(that.INTERSECTED.id.indexOf("_")+1);
						cleanId = cleanId.substring(0, cleanId.lastIndexOf("_"));
						that.hoverCallback(null, cleanId);
					}
				}
				//that.enableTransformOnIntersected();
			}
				
		} else {

			if (that.INTERSECTED != null) {
				that.setHighlighted(that.INTERSECTED, false);
				if (that.hoverCallback != undefined && that.hoverCallback != null) {
					that.hoverCallback(null, null);
				}
				//that.disableTransformOnIntersected();
			}

			that.INTERSECTED = null;

		}

	};

	this.setHighlighted = function (vsObj, on) {
	
		if (!on) {
			vsObj.setHighlighted(false, that.contrastColor);
			if ((vsObj.getIsConnection() && (that.selectedVisualizationSetup.getShowConnectionLabels() == 1 || that.selectedVisualizationSetup.getShowConnectionLabels() == 2)) || (!vsObj.getIsConnection() && (that.selectedVisualizationSetup.getShowNodeLabels() == 1 || that.selectedVisualizationSetup.getShowNodeLabels() == 2))) {
				that.removeFromScene(vsObj.getLabelSprite().name);
				if ((vsObj.getIsConnection() && (that.selectedVisualizationSetup.getShowConnectionLabels() == 1)) || (!vsObj.getIsConnection() && (that.selectedVisualizationSetup.getShowNodeLabels() == 1))) {
					vsObj.updateLabel(that.modelRepository, [that.backgroundColorRGB[0], that.backgroundColorRGB[1], that.backgroundColorRGB[2], 0.0], [vsObj.labelColor[0], vsObj.labelColor[1], vsObj.labelColor[2], 1.0], true, that.layoutScale);
				} else {
					vsObj.updateLabel(that.modelRepository, [that.backgroundColorRGB[0], that.backgroundColorRGB[1], that.backgroundColorRGB[2], 0.0], [vsObj.labelColor[0], vsObj.labelColor[1], vsObj.labelColor[2], 1.0], false, that.layoutScale);
				}
				that.scene.add(vsObj.getLabelSprite());
			} else {
				vsObj.updateLabel(that.modelRepository, [that.backgroundColorRGB[0], that.backgroundColorRGB[1], that.backgroundColorRGB[2], 0.0], [vsObj.labelColor[0], vsObj.labelColor[1], vsObj.labelColor[2], 1.0], false, that.layoutScale);
			}
		} else {
			vsObj.setHighlighted(true, that.contrastColor);
			if ((vsObj.getIsConnection() && (that.selectedVisualizationSetup.getShowConnectionLabels() == 1 || that.selectedVisualizationSetup.getShowConnectionLabels() == 2)) || (!vsObj.getIsConnection() && (that.selectedVisualizationSetup.getShowNodeLabels() == 1 || that.selectedVisualizationSetup.getShowNodeLabels() == 2))) {
				that.removeFromScene(vsObj.getLabelSprite().name);
				vsObj.updateLabel(that.modelRepository, [that.contrastColorRGB[0], that.contrastColorRGB[1], that.contrastColorRGB[2], 1.0], [vsObj.labelColor[0], vsObj.labelColor[1], vsObj.labelColor[2], 1.0], true, that.layoutScale);
				that.scene.add(vsObj.getLabelSprite());
			} else {
				vsObj.updateLabel(that.modelRepository, [that.contrastColorRGB[0], that.contrastColorRGB[1], that.contrastColorRGB[2], 0.0], [vsObj.labelColor[0], vsObj.labelColor[1], vsObj.labelColor[2], 1.0], false, that.layoutScale);
			}
			if (!that.INTERSECTED.getIsConnection() && that.drawingConnection && that.sourceNode != null) {
				var cleanId = that.INTERSECTED.getId().substring(that.INTERSECTED.getId().indexOf("_")+1);
				cleanId = cleanId.substring(0, cleanId.lastIndexOf("_"));
				that.targetNode = cleanId;
				that.updateLine();
			}
		}
	
	};

	this.setLayoutScale = function (layoutScale) {

		if (layoutScale > 0.0) {
		
			that.layoutScale = layoutScale;
			
			for (var datasetId in that.datasetVSObjects) {
				for (var objectId in that.datasetVSObjects[datasetId]) {
					var obj = that.datasetVSObjects[datasetId][objectId];
					that.datasetVSObjects[datasetId][objectId].applyLayoutScale(that.layoutScale);
					// if ((obj.getIsConnection() && that.selectedVisualizationSetup.getShowConnectionLabels()) || (!obj.getIsConnection() && that.selectedVisualizationSetup.getShowNodeLabels())) {
					// 	that.removeFromScene(obj.getLabelSprite().name);
					// 	obj.updateLabel(that.modelRepository, [that.backgroundColorRGB[0], that.backgroundColorRGB[1], that.backgroundColorRGB[2], 0.0], [obj.labelColor[0], obj.labelColor[1], obj.labelColor[2], 1.0], obj.getLabelSprite().visible, that.layoutScale);
					// 	if (that.scene.getObjectByName(obj.getVisualizationObject().name) != undefined) {
					// 		that.scene.add(obj.getLabelSprite());
					// 	}
					// }
				}
			}
		
		}
		
	};

	this.transformUpdated  = function (position) {
	
		position = position.multiplyScalar(1.0/that.layoutScale);
		for (var selectedNodeId in that.selectedNodes) {
			var tempPos = that.selectedNodePositions[selectedNodeId].clone();
			if (!that.perscpective) {
				tempPos.add(new THREE.Vector3(position.x, 0.0, position.z));
			} else {
				tempPos.add(position);
			}
			that.setNodePosition(that.selectedDataset, selectedNodeId, tempPos);
		}
	
	};
	
	this.setNodePosition  = function (datasetId, nodeId, position) {
		
		that.layoutManager.getDatasetLayout(datasetId).setNodeLocation(nodeId, position);
		
	};
	
	this.setBackgroundObjectPosition  = function (objectId, position) {
		
		var objectToMove = that.scene.getObjectByName(objectId);
		objectToMove.position = position;
		
	};
	
	this.overrideNodePosition  = function (datasetId, nodeId, position) {
		
		that.layoutManager.getDatasetLayout(datasetId).setNodeLocation(datasetId+"_"+nodeId+"_node", position);
		
	};

	this.getNodePosition  = function (datasetId, nodeId) {
	
		that.layoutManager.getDatasetLayout(datasetId).getNodeLocation(nodeId);
		
	};
	
	this.getLayout  = function (datasetId) {
	
		var layout = {};
		for (var nodeId in that.datasets[datasetId].getNodes()) {
			layout[nodeId] = that.layoutManager.getDatasetLayout(datasetId).getNodeLocation(datasetId + "_" + nodeId + "_node");
		}
		return layout;
		
	};

	this.setLayout  = function (datasetId, layoutType, maxRadius, layout) {
	
		for (var layoutId in layouts) {
			if (layouts[layoutId] instanceof ForceDirectedLayout) {
				layouts[layoutId].setPaused(true);
			}
		}
		
		var layouts = {};
		if (layoutType == "ForceDirected") {
			layouts[layoutType] = new ForceDirectedLayout(maxRadius, that.layoutManager, that.perspective);
			that.selectedVisualizationStyle.setLayouts(layouts);
		} else if (layoutType == "Random") {
			layouts[layoutType] = new RandomLayout(maxRadius, that.layoutManager);
			that.selectedVisualizationStyle.setLayouts(layouts);
		}
	
		for (var layoutOption in that.selectedVisualizationStyle.getLayouts()) {
			that.selectedLayout = that.selectedVisualizationStyle.getLayouts()[layoutOption];
			break;
		}
		
		that.layoutManager.setDatasetLayout(that.selectedDataset, that.selectedLayout);

		that.updateSelectedLayout();
		
		for (var nodeId in layout) {
			that.setNodePosition(datasetId, datasetId+"_"+nodeId+"_node", new THREE.Vector3(layout[nodeId][0], layout[nodeId][1], layout[nodeId][2]));
		}
	
	};
	
	this.updateNodePosition = function (datasetId, nodeId, nodePosition) {
	
		if (datasetId != undefined) {
			if (that.datasetVSObjects[datasetId][nodeId] != undefined && that.datasetVSObjects[datasetId][nodeId] != null) {
				if (!that.perspective) {
					that.datasetVSObjects[datasetId][nodeId].applyPosition(new THREE.Vector3(nodePosition.x, 0.0, nodePosition.y));
				} else {
					that.datasetVSObjects[datasetId][nodeId].applyPosition(nodePosition);
				}
				if (that.drawingConnection) {
					if (that.selectedDataset+"_"+that.sourceNode+"_node" == nodeId || that.selectedDataset+"_"+that.targetNode+"_node" == nodeId) {
						that.updateLine();
					}
				}
			}
		}
		
	};

	this.updateConnectionPosition = function (datasetId, connectionId, sourcePos, targetPos) {

		if (that.datasetVSObjects[datasetId][connectionId] != undefined && that.datasetVSObjects[datasetId][connectionId] != null) {
			var cleanConnectionId = connectionId.replace(datasetId+"_", "").replace("_connection", "");
			var connection = that.datasets[datasetId].getConnection(cleanConnectionId);
			var sourceId = connection.getSourceId();
			var targetId = connection.getTargetId();
			var X = targetPos.x-sourcePos.x;
			var Y = targetPos.y-sourcePos.y;
			var distance = 0.25;
			var newVec = new THREE.Vector3();
			newVec.x = X*Math.cos(Math.PI/2.0)-Y*Math.sin(Math.PI/2.0);
			newVec.y = X*Math.sin(Math.PI/2.0)+Y*Math.cos(Math.PI/2.0);
			newVec.z = 0.0;
			newVec.normalize();
			newVec.multiplyScalar(distance);
			sourcePos.add(newVec);
			targetPos.add(newVec);
			if (!that.perspective) {
				that.datasetVSObjects[datasetId][connectionId].applyPosition(new THREE.Vector3(sourcePos.x, 0.0, sourcePos.y), new THREE.Vector3(targetPos.x, 0.0, targetPos.y));			
			} else {
				that.datasetVSObjects[datasetId][connectionId].applyPosition(sourcePos, targetPos);			
			}
		} 
		
	};

	this.getLayoutScale = function () {
		return that.layoutScale;
	};
	
	this.getLayoutManager = function () {
		return that.layoutManager;
	};
	
	this.setDrawingConnection = function (on) {

		if (that.drawingConnection && that.sourceNode != null) {
				that.scene.remove(that.tempConnection);
		}
		that.sourceNode = null;
		that.targetNode = null;
		that.drawingConnection = on;
	
	};
		
	this.registerConnectionDrawnCallback = function (callback) {
		
		that.connectionDrawnCallback = callback;
		
	};

	this.setNodeType = function (datasetId, visualizationStyleId, nodeTypeId, nodeLookAndFeel) {
		
		that.visualizationStyles[datasetId][visualizationStyleId].setNodeTypeLookAndFeel(nodeTypeId, nodeLookAndFeel);
		
		if (that.selectedDataset != null && that.selectedVisualizationStyle != null) {
			if (that.selectedDataset == datasetId && that.selectedVisualizationStyle.getId() == visualizationStyleId) {
				for (var nodeId in that.datasets[datasetId].getNodes()) {
					if (that.datasets[datasetId].getNode(nodeId) != null) {
						if (that.datasets[datasetId].getNode(nodeId).getNodeType() == nodeTypeId) {
							that.updateNodeLookAndFeel(datasetId, nodeId, nodeLookAndFeel);
						}
					}
				}
			}
		}
		
	};
	
	this.removeNodeType = function (datasetId, visualizationStyleId, nodeTypeId) {
		
		that.visualizationStyles[datasetId][visualizationStyleId].removeNodeTypeLookAndFeel(nodeTypeId);
		
	};
	
	this.addNode = function (datasetId, node) {
		
		var check = that.nodesBeingAdded;
		
		that.nodesBeingAdded = true;

		that.datasets[datasetId].addNode(node);
		
		that.generateNodeObject(datasetId, node.id + "_node", node, true, true);

		that.nodesBeingAdded = check;
		
	};
	
	this.setConnectionType = function (datasetId, visualizationStyleId, connectionTypeId, connectionLookAndFeel) {
		
		that.visualizationStyles[datasetId][visualizationStyleId].setConnectionTypeLookAndFeel(connectionTypeId, connectionLookAndFeel);
		
		if (that.selectedDataset != null && that.selectedVisualizationStyle != null) {
			if (that.selectedDataset == datasetId && that.selectedVisualizationStyle.getId() == visualizationStyleId) {
				for (var connectionId in that.datasets[datasetId].getConnections()) {
					if (that.datasets[datasetId].getConnection(connectionId).getConnectionType() == connectionTypeId) {
						that.updateConnectionLookAndFeel(datasetId, connectionId, connectionLookAndFeel);
					}
				}
			}
		}

	};
	
	this.removeConnectionType = function (datasetId, visualizationStyleId, connectionTypeId) {
		
		that.visualizationStyles[datasetId][visualizationStyleId].removeConnectionTypeLookAndFeel(connectionTypeId);
		
	};
	
	this.addConnection = function (datasetId, connection) {
		
		var check = that.connectionsBeingAdded;

		that.connectionsBeingAdded = true;
		
		that.datasets[datasetId].addConnection(connection);
		
		if (that.selectedDataset == datasetId) {
			that.pendingDatasetId = that.selectedDataset;
			that.pendingConnections[connection.id] = connection;
						
			if (that.nodesBeingRendered.length == 0) {
				that.addPendingConnections();
			}
		}
		
		that.connectionsBeingAdded = check;

	};
	
	this.resetLayout = function (datasetId) {
	
		that.layoutManager.getDatasetLayout(datasetId).reset();
		
	};
	
	this.getCurrentVisualizationSetup = function () {
		return that.selectedVisualizationSetup;
	};
	
	this.overrideNodeLookAndFeel = function (datasetId, nodeId, color) {
	
		if (nodeId != null && (nodeId in that.datasets[datasetId].getNodes())) {
			that.datasetVSObjects[datasetId][datasetId+"_"+nodeId+"_node"].visualizationObject.material.ambient = new THREE.Color(color[0], color[1], color[2]);
			that.datasetVSObjects[datasetId][datasetId+"_"+nodeId+"_node"].visualizationObject.material.color = new THREE.Color(color[0], color[1], color[2]);
			that.datasetVSObjects[datasetId][datasetId+"_"+nodeId+"_node"].visualizationObject.material.opacity = 1.0;
			that.datasetVSObjects[datasetId][datasetId+"_"+nodeId+"_node"].visualizationObject.material.needsUpdate = true;
		}

	};
	
	this.overrideConnectionLookAndFeel = function (datasetId, connectionId, color) {
	
		if (connectionId != null && (connectionId in that.datasets[datasetId].getConnections())) {
			that.datasetVSObjects[datasetId][datasetId+"_"+connectionId+"_connection"].visualizationObject.material.ambient = new THREE.Color(color[0], color[1], color[2]);
			that.datasetVSObjects[datasetId][datasetId+"_"+connectionId+"_connection"].visualizationObject.material.color = new THREE.Color(color[0], color[1], color[2]);
			that.datasetVSObjects[datasetId][datasetId+"_"+connectionId+"_connection"].visualizationObject.material.opacity = 1.0;
			that.datasetVSObjects[datasetId][datasetId+"_"+connectionId+"_connection"].visualizationObject.material.needsUpdate = true;
			
			that.datasetVSObjects[datasetId][datasetId+"_"+connectionId+"_connection"].firstComponentObject.material.ambient = new THREE.Color(color[0], color[1], color[2]);
			that.datasetVSObjects[datasetId][datasetId+"_"+connectionId+"_connection"].firstComponentObject.material.color = new THREE.Color(color[0], color[1], color[2]);
			that.datasetVSObjects[datasetId][datasetId+"_"+connectionId+"_connection"].firstComponentObject.material.opacity = 1.0;
			that.datasetVSObjects[datasetId][datasetId+"_"+connectionId+"_connection"].firstComponentObject.material.needsUpdate = true;

			that.datasetVSObjects[datasetId][datasetId+"_"+connectionId+"_connection"].secondComponentObject.material.ambient = new THREE.Color(color[0], color[1], color[2]);
			that.datasetVSObjects[datasetId][datasetId+"_"+connectionId+"_connection"].secondComponentObject.material.color = new THREE.Color(color[0], color[1], color[2]);
			that.datasetVSObjects[datasetId][datasetId+"_"+connectionId+"_connection"].secondComponentObject.material.opacity = 1.0;
			that.datasetVSObjects[datasetId][datasetId+"_"+connectionId+"_connection"].secondComponentObject.material.needsUpdate = true;
		}		
		
	};
	
	this.updateBackgroundColor = function (color) {
		that.renderer.setClearColor(color, 1);
	};
	
	this.updateHighlightColor = function (datasetId, color) {
		that.contrastColor = color;
		that.contrastColorRGB = FormattingUtils.prototype.convertHexColorToRGBA(color);
		var datasetObjs = that.datasetVSObjects[datasetId];
		for (var objId in datasetObjs) {
			var datasetObj = that.datasetVSObjects[datasetId][objId];
			if (datasetObj.getHighlighted()) {
				datasetObj.setHighlighted(true, that.contrastColor);
			} else {
				datasetObj.setHighlighted(false, that.contrastColor);
			}
		}
	};
	
	this.setShowLabels = function (datasetId, show) {
		if (show) {
			that.selectedVisualizationSetup.setShowNodeLabels(1);
		} else {
			that.selectedVisualizationSetup.setShowNodeLabels(0);
		}
		that.selectedVisualizationSetup.setShowConnectionLabels(0);
		var datasetObjs = that.datasetVSObjects[datasetId];
		for (var objId in datasetObjs) {
			var datasetObj = that.datasetVSObjects[datasetId][objId];
			if (!datasetObj.getIsConnection()) {
				datasetObj.setVisibility(datasetObj.getVisibility(), show, true);
			} else {
				datasetObj.setVisibility(datasetObj.getVisibility(), false, true);
			}
			that.setHighlighted(datasetObj, datasetObj.getHighlighted());
		}
	};
	
	this.setShowNodes = function (datasetId, show) {
		that.setShowNodes = show;
		var datasetObjs = that.datasetVSObjects[datasetId];
		for (var objId in datasetObjs) {
			var datasetObj = that.datasetVSObjects[datasetId][objId];
			if (!datasetObj.getIsConnection()) {
				datasetObj.setVisibility(show, that.selectedVisualizationSetup.getShowNodeLabels(), true);
			} 
		}
	};
	
	this.setShowConnections = function (datasetId, show) {
		that.setShowConnections = show;
		var datasetObjs = that.datasetVSObjects[datasetId];
		for (var objId in datasetObjs) {
			var datasetObj = that.datasetVSObjects[datasetId][objId];
			if (datasetObj.getIsConnection()) {
				datasetObj.setVisibility(show, that.selectedVisualizationSetup.getShowConnectionLabels(), true);
			} 
		}
	};
	
	this.updateLabels = function (datasetId, network, labelProperty) {
				
		var datasetObjs = that.datasetVSObjects[datasetId];
		for (var objId in datasetObjs) {
			var nodeId = objId.replace(datasetId+"_", "").replace("_node", "");
			
			var datasetObj = that.datasetVSObjects[datasetId][objId];
			if (!datasetObj.getIsConnection()) {
				if (datasetObj) {
					if (labelProperty == "Id") {
						datasetObj.setLabelText(nodeId);
					} else {
						if (network.nodes[nodeId].attributes.hasOwnProperty(labelProperty)) {
							datasetObj.setLabelText(network.nodes[nodeId].attributes[labelProperty]);	
						} else {
							datasetObj.setLabelText("N/A");	
						}
					}
					that.setHighlighted(datasetObj, datasetObj.getHighlighted());
					datasetObj.setVisibility(datasetObj.getVisibility(), (datasetObj.getVisibility()&&that.selectedVisualizationSetup.getShowNodeLabels()));
				}
			} 
		}
	};
		
	this.setHiddenNodes = function (hiddenNodeIds) {
		that.hiddenNodeIds = hiddenNodeIds;
	};
	
	this.focusNode = function (datasetId, nodeId) {
		var nodeVsObj = that.datasetVSObjects[datasetId][datasetId+"_"+nodeId+"_node"];
		var position = nodeVsObj.getVisualizationObject().position;
		if (nodeVsObj != null) {
			try {
				that.controls.center.x= position.x;
				that.controls.center.y= position.y;
				that.controls.center.z= position.z;
			} catch (err) {}
			try {
				that.camera.position.set(position.x, position.y+10, position.z);
			} catch (err) {}
			try {
				that.camera.lookAt(new THREE.Vector3(position.x, position.y, position.z));
			} catch (err) {}
			if (that.perspective) {
				that.camera.zoom = 1.0;
			} else {
				that.camera.zoom = 25.0;
			}

			that.camera.updateProjectionMatrix();
		}
	};
	
	this.removeBackgroundObject = function (objectName) {
		that.removeFromScene(objectName);
	};
	
	this.setHoverCallback = function (callback) {
		that.hoverCallback = callback;
	};
	
	return {		
	
		/* 
			Function: init

			Initializes Visualization Sandbox

			Parameters:

				canvas - HTML5 Canvas (DOM) element to use
				visualizationSetup - an initial VisualizationSetup object defining visualization environment 
											  (lights, background color, background objects, etc.) (optional)

			Returns:

				N/A
			  
			See Also:

				<VisualizationSetup>
		*/
		init : that.init,
		
		/* 
			Function: addVisualizationSetup

			Adds a visualization setup after initialization

			Parameters:

				visualizationSetup - VisualizationSetup object defining visualization environment 
											  (lights, background color, background objects, etc.)

			Returns:

				N/A
				
			See Also:

				<VisualizationSetup>
		*/
		addVisualizationSetup : that.addVisualizationSetup,
		
		/* 
			Function: setVisualizationSetup

			Select visualization setup with given id

			Parameters:

				visualizationSetupId - VisualizationSetup id

			Returns:

				N/A
				
			See Also:

				N/A
		*/
		setVisualizationSetup : that.setVisualizationSetup,
		
		/* 
			Function: getCurrentVisualizationSetup

			Gets selected visualization setup

			Parameters:

				N/A

			Returns:

				visualizationSetup - selected visualization setup 
				
			See Also:

				N/A
		*/
		getCurrentVisualizationSetup : that.getCurrentVisualizationSetup,

		/* 
			Function: updateBackgroundColor

			Updates background color

			Parameters:

				color - Background color to use
				
			Returns:

				N/A
			  
			See Also:

				N/A
		*/
		updateBackgroundColor : that.updateBackgroundColor,
		
		/* 
			Function: updateHighlightColor

			Updates highlight color

			Parameters:

				color - Highlight color to use
				
			Returns:

				N/A
			  
			See Also:

				N/A
		*/
		updateHighlightColor : that.updateHighlightColor,
		
		/* 
			Function: getCamera

			Returns camera object

			Parameters:

				N/A

			Returns:

				camera - Camera object
				
			See Also:

				N/A
		*/
		getCamera : that.getCamera, 
		
		/* 
			Function: generateBackgroundObject

			Generates a background object

			Parameters:

				visId - id for the background object
				node - node information that characterizes the background object
				castShadow - whether the background object should cast shadow on other objects
				receiveShadow - whether other objects should cast shadow on the background object
				
			Returns:

				N/A
				
			See Also:

				N/A
		*/
		generateBackgroundObject : that.generateBackgroundObject, 
		
		/* 
			Function: removeBackgroundObject

			Removes a background object

			Parameters:

				objectName - id for the background object
				
			Returns:

				N/A
				
			See Also:

				N/A
		*/
		removeBackgroundObject : that.removeBackgroundObject,
		
		/* 
			Function: setBackgroundObjectPosition

			Removes a background object

			Parameters:

				objectName - id for the background object
				position - position for the background object
				
			Returns:

				N/A
				
			See Also:

				N/A
		*/
		setBackgroundObjectPosition : that.setBackgroundObjectPosition,
			
		/* 
			Function: setCameraSetup

			Sets camera position and orientation

			Parameters:

				cameraSetup - a CameraSetup object that defines camera position and orientation

			Returns:

				N/A
				
			See Also:

				<CameraSetup>
		*/
		setCameraSetup : that.setCameraSetup,
		
		/* 
			Function: addDataset

			Adds a new dataset

			Parameters:

				dataset - a CameraSetup object that defines camera 
				visualizationStyles - a map of VisualizationStyle objects that define node and connection, 
											  as well as node type and connection type look-and-feel
			Returns:

				N/A
			
			See Also:

				<Dataset>, <VisualizationStyle>
		*/
		addDataset : that.addDataset, 
		
		/* 
			Function: removeAllDatasets

			Removes all datasets

			Parameters:

				N/A
				
			Returns:

				N/A
		*/
		removeAllDatasets : that.removeAllDatasets,

		/* 
			Function: updateSelectedDataset

			Select the dataset identified by the dataset selection box in HUD

			Parameters:

				N/A
			
			Returns:

				N/A
		*/
		updateSelectedDataset : that.updateSelectedDataset, 
		
		/* 
			Function: setLayoutScale

			Sets current scale of layout

			Parameters:

				layoutScale - a scale multiplier used for layouting (node positioning)
			
			Returns:

				N/A
		*/
		setLayoutScale : that.setLayoutScale, 	
		
		/* 
			Function: getLayoutScale

			Returns current scale of layout

			Parameters:

				N/A
			
			Returns:

				layoutScale - a scale multiplier used for layouting (node positioning)
		*/
		getLayoutScale : that.getLayoutScale, 
		
		/* 
			Function: setShortcutsEnabled

			Set whether keyboard shortcuts should be enabled

			Parameters:

				N/A
			
			Returns:

				N/A
		*/
		setShortcutsEnabled : that.setShortcutsEnabled,

		/* 
			Function: setPerspective

			Turns on or off the 3D perspective view (on by default)

			Parameters:

				on/off
			
			Returns:

				N/A
		*/		
		setPerspective : that.setPerspective, 
		
		/* 
			Function: getPerspective

			Returns whether the 3D perspective view is on

			Parameters:

				N/A
			
			Returns:

				on/off - whether the perspective view is on
		*/		
		getPerspective : that.getPerspective, 

		/* 
			Function: getLayoutManager

			Return layout managing object 
			
			Parameters:

				N/A
			
			Returns:

				layoutManager - layout managing object
		*/		
		getLayoutManager : that.getLayoutManager, 
				
		/* 
			Function: getIntersected

			Returns the name of the node or connection that is last highlighted by mouse-over
			
			Parameters:

				N/A
			
			Returns:

				objectName - name of node or connection that is last highlighted
		*/		
		getIntersected : that.getIntersected, 
		
		/* 
			Function: updateSize

			Updates the size of the WebGL context based on canvas size
			
			Parameters:

				N/A
			
			Returns:

				N/A
		*/		
		updateSize : that.updateSize, 
		
		/* 
			Function: setNodeAnimation

			Turns on or off the node selection animation
			
			Parameters:

				nodeId - id of the node for which the animation is being set
				on - true turns on animation, false turns it off
			
			Returns:

				N/A
		*/		
		setNodeAnimation : that.setNodeAnimation, 
		
		/* 
			Function: getIntersected
	
			Returns id of the intersected object
			
			Parameters:
	
				N/A
			
			Returns:
	
				id of intersected object
		*/		
		getIntersected : that.getIntersected, 
		
		/* 
			Function: getSelectedNodes
	
			Returns an array of ids of the selected nodes
			
			Parameters:
	
				N/A
			
			Returns:
	
				map of ids of selected nodes to 1.0
		*/		
		getSelectedNodes : that.getSelectedNodes, 
		
		/* 
			Function: getSelectedConnections
	
			Returns an array of ids of the selected connections
			
			Parameters:
	
				N/A
			
			Returns:
	
				map of ids of selected connections to 1.0
		*/		
		getSelectedConnections : that.getSelectedConnections, 
		
		/* 
			Function: setSelectedNodes
	
			Sets which nodes are selected
			
			Parameters:
	
				array of ids of nodes to be selected
			
			Returns:
	
				N/A
		*/		
		setSelectedNodes : that.setSelectedNodes, 
		
		/* 
			Function: setSelectedConnections
	
			Sets which connections are selected
			
			Parameters:
	
				array of ids of connections to be selected
			
			Returns:
	
				N/A
		*/		
		setSelectedConnections : that.setSelectedConnections, 
		
		/* 
			Function: transformUpdated
	
			Callback to handle position transform updates
			
			Parameters:
	
				position shift
			
			Returns:
	
				N/A
		*/		
		transformUpdated : that.transformUpdated, 
		
		
		/* 
			Function: saveSelectedNodeLocations
	
			Takes a snapshot of selected node positions
			
			Parameters:
	
				N/A
			
			Returns:
	
				N/A
		*/		
		saveSelectedNodeLocations : that.saveSelectedNodeLocations, 
		
		/* 
			Function: clearSelectedNodeLocations
	
			Clears snapshot of selected node positions
			
			Parameters:
	
				N/A
			
			Returns:
	
				N/A
		*/		
		clearSelectedNodeLocations : that.clearSelectedNodeLocations, 
		
		/* 
			Function: setDrawingConnection
	
			Turns on/off connection drawing mode
			
			Parameters:
	
				on/off
			
			Returns:
	
				N/A
		*/		
		setDrawingConnection : that.setDrawingConnection, 
		
		/* 
			Function: registerConnectionDrawnCallback
	
			Registers a callback function to be called when user draws a connection
			
			Parameters:
	
				callback function
			
			Returns:
	
				N/A
		*/		
		registerConnectionDrawnCallback : that.registerConnectionDrawnCallback, 
		
		/* 
			Function: setCanRotate
	
			Sets whether camera is allowed to rotate
			
			Parameters:
		
				on
	
			Returns:
	
				N/A
		*/		
		setCanRotate : that.setCanRotate, 
				
		/* 
			Function: setNodeType
	
			Sets a new node type and corresponding node look-and-feel to a visualization style of a dataset
			
			Parameters:
	
				dataset id
				visualization style id
				node type name
				node look-and-feel
			
			Returns:
	
				N/A
		*/		
		setNodeType : that.setNodeType, 
		
		/* 
			Function: removeNodeType
	
			Removes a new node type and corresponding node look-and-feel from a visualization style of a dataset
			
			Parameters:
	
				dataset id
				visualization style id
				node type name
			
			Returns:
	
				N/A
		*/		
		removeNodeType : that.removeNodeType, 
		
		/* 
			Function: addNode
	
			Adds a new node to a dataset
			
			Parameters:
	
				dataset id
				node
			
			Returns:
	
				N/A
		*/		
		addNode : that.addNode, 
		
				/* 
			Function: removeNode

			Remove a node from a dataset
			
			Parameters:

				datasetId - dataset id
				nodeId - node id
			
			Returns:

				N/A
		*/		
		removeNode : that.removeNode, 
		
		/* 
			Function: setConnectionType
	
			Sets a new connection type and corresponding connection look-and-feel to a visualization style of a dataset
			
			Parameters:
	
				dataset id
				visualization style id
				connection type name
				connection look-and-feel
			
			Returns:
	
				N/A
		*/		
		setConnectionType : that.setConnectionType, 
		
		/* 
			Function: removeConnectionType
	
			Removes a new connection type and corresponding connection look-and-feel from a visualization style of a dataset
			
			Parameters:
	
				dataset id
				visualization style id
				connection type name
			
			Returns:
	
				N/A
		*/		
		removeConnectionType : that.removeConnectionType, 
		
		/* 
			Function: addConnection
	
			Adds a new connection to a dataset
			
			Parameters:
	
				dataset id
				connection
			
			Returns:
	
				N/A
		*/		
		addConnection : that.addConnection, 

		/* 
			Function: removeConnection

			Remove a node from a dataset
			
			Parameters:

				datasetId - dataset id
				connectionId - connection id
			
			Returns:

				N/A
		*/		
		removeConnection : that.removeConnection, 
		
		/* 
			Function: setNodePosition

			Sets position of a node in a dataset
			
			Parameters:

				datasetId - dataset id
				nodeId - node id
				position - node position (array of size 3)
			
			Returns:

				N/A
		*/		
		setNodePosition : that.setNodePosition, 
		
		/* 
			Function: overrideNodePosition

			Overrides position of a node in a dataset (pinning)
			
			Parameters:

				datasetId - dataset id
				nodeId - node id
				position - node position (array of size 3)
			
			Returns:

				N/A
		*/		
		overrideNodePosition : that.overrideNodePosition, 

		/* 
			Function: setLayout

			Sets layout for a dataset
			
			Parameters:

				datasetId - dataset id
				layoutType - layout type string
				layout - [nodeId] = array of size 3
			
			Returns:

				N/A
		*/		
		setLayout : that.setLayout, 
		
		/* 
			Function: getLayout

			Gets layout for a dataset
			
			Parameters:

				datasetId - dataset id
			
			Returns:

				layout - [nodeId] = array of size 3
		*/		
		getLayout : that.getLayout, 
		
		/* 
			Function: resetLayout

			Resets layout for a dataset
			
			Parameters:

				datasetId - dataset id

			Returns:

				N/A
		*/		
		resetLayout : that.resetLayout, 
		
		/* 
			Function: setFollowCamera

			Sets whether objects should face camera position
			
			Parameters:

				on - true to turn on following, false to turn it off

			Returns:

				N/A
		*/		
		setFollowCamera : that.setFollowCamera, 
		
		/* 
			Function: overrideNodeLookAndFeel

			Updates node's look and feel
			
			Parameters:

				datasetId - id of the dataset node belongs to
				nodeName - name of the node
				color - new color

			Returns:

				N/A
		*/		
		overrideNodeLookAndFeel : that.overrideNodeLookAndFeel, 
		
		/* 
			Function: overrideConnectionLookAndFeel

			Updates connection's look and feel
			
			Parameters:

				datasetId - id of the dataset connection belongs to
				connectionName - name of the connection
				color - new color

			Returns:

				N/A
		*/		
		overrideConnectionLookAndFeel : that.overrideConnectionLookAndFeel,

		/* 
				Function: setShowLabels

				Sets whether to show or hide labels

				Parameters:

					show - true to show labels
					
				Returns:

					N/A
			*/
		setShowLabels : that.setShowLabels,
			
		/* 
				Function: setShowNodes

				Sets whether to show or hide nodes

				Parameters:

					show - true to show nodes
					
				Returns:

					N/A
			*/
		setShowNodes : that.setShowNodes,

		/* 
				Function: setShowConnections

				Sets whether to show or hide connections

				Parameters:

					show - true to show connections
					
				Returns:

					N/A
			*/
		setShowConnections : that.setShowConnections,	
		
		/* 
			Function: updateLabels

			Update label text to use the given property

			Parameters:

				labelProperty - node property used for label text

			Returns:

				N/A
			  
			See Also:

				N/A
		*/
		updateLabels : that.updateLabels,
		
		/* 
			Function: setNodeVisibility

			Set node visibility

			Parameters:

				datasetId - id of the dataset node belongs to
				nodeId - id of the node
				visible - whether the node should be visible or not

			Returns:

				N/A
			  
			See Also:

				N/A
		*/
		setNodeVisibility : that.setNodeVisibility,
		
		/* 
			Function: setConnectionVisibility

			Set connection visibility

			Parameters:

				datasetId - id of the dataset connection belongs to
				connectionId - id of the connection
				visible - whether the connection should be visible or not

			Returns:

				N/A
			  
			See Also:

				N/A
		*/
		setConnectionVisibility : that.setConnectionVisibility,

		/* 
			Function: setHiddenNodes

			Set nodes that should be hidden

			Parameters:

				hiddenNodeIds - ids of nodes to hide

			Returns:

				N/A
			  
			See Also:

				N/A
		*/
		setHiddenNodes : that.setHiddenNodes, 
		
		/* 
			Function: setJammedAssetIds

			Set nodes and links that are jammed

			Parameters:

				datasetId - id of the dataset
				jammedAssetsIds - ids of nodes that are jammed

			Returns:

				N/A
			  
			See Also:

				N/A
		*/
		setJammedAssetIds : that.setJammedAssetIds,

		/* 
			Function: focusNode

			Focus camera on a node

			Parameters:

				datasetId - id of the dataset
				nodeId - id of the node to be focused

			Returns:

				N/A
			  
			See Also:

				N/A
		*/
		focusNode : that.focusNode,
		
		/* 
			Function: setHoverCallback

			Set the callback function to be called when node/link being hovered on changes

			Parameters:

				callback - callback function to be called on hover change

			Returns:

				N/A
			  
			See Also:

				N/A
		*/
		setHoverCallback : that.setHoverCallback, 
		
		/* 
			Function: updateNodeLookAndFeel

			Update given node's look-and-feel

			Parameters:

				datasetId - ID of the dataset,
				nodeName - name/id of the node, 
				nodeLookAndFeel - new look-and-feel

			Returns:

				N/A
			  
			See Also:

				N/A
		*/
		updateNodeLookAndFeel : that.updateNodeLookAndFeel, 
		
		/* 
			Function: updateConnectionLookAndFeel

			Update given connection's look-and-feel

			Parameters:

				datasetId - ID of the dataset,
				connectionName - name/id of the connection,
				connectionLookAndFeel - new look-and-feel

			Returns:

				N/A
			  
			See Also:

				N/A
		*/
		updateConnectionLookAndFeel : that.updateConnectionLookAndFeel
	}
	
};
