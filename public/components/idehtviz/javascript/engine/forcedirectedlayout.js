/** 
 * Class: ForceDirectedLayout
 * This class represents a force-directed (spring-loaded) layout that is a wrapper of Springy-3D class found under utils folder.
  */
var ForceDirectedLayout = function (diameter, layoutManager, perspective) {

	this.diameter = diameter;
	this.layoutManager = layoutManager;
	this.datasetId;
	this.springyGraph;
	this.springyLayout;
	this.springyRenderer;
	this.springyUserNode;
	this.springyNodeArray;
	this.springyEdgeArray;

	this.nodeLocations = {};  //[nodeId] = float[3]
	this.connectionSourceLocations = {}; //[connectionId] = float[3]
	this.connectionTargetLocations = {}; //[connectionId] = float[3]

	this.perspective = perspective;
	
	var that = this;
	
	this.init = function () {
		
		if (perspective == undefined || perspective == null) {
			that.perspective = true;
		}
		
		that.id = "Force_Directed";
		that.minAxisCount = 1;
		that.maxAxisCount = 3;
		that.currentAxisCount = 3;

		that.springyNodeArray = {};
		that.springyEdgeArray = {};

		that.springyGraph = new Springy.Graph(that.perspective);

		//that.springyUserNode = that.springyGraph.newNode({label: "springy_user"});
		
		that.springyLayout = new Springy.Layout.ForceDirected(that.springyGraph,
				  400.0, // Spring stiffness
				  6400.0, // Node repulsion
				  0.5 // Damping
				);
				
		var nodeUpdateCallback = that.drawNode.bind(that);
		var edgeUpdateCallback = that.drawEdge.bind(that);
		
		that.springyRenderer = new Springy.Renderer(that.springyLayout, function clear() {}, edgeUpdateCallback, nodeUpdateCallback);

		that.springyRenderer.start();
		
	};

	this.addNode = function (nodeId) {

		if (that.nodeLocations[nodeId] == undefined || that.nodeLocations[nodeId] == null) {
			if (that.layoutManager != null) {
				that.nodeLocations[nodeId] = new THREE.Vector3(-that.diameter/2.0+Math.random()*that.diameter, -that.diameter/2.0+Math.random()*that.diameter, -that.diameter/2.0+Math.random()*that.diameter);
			}

			if (that.springyNodeArray[nodeId] == undefined || that.springyNodeArray[nodeId] == null) {
				var springyNode = that.springyGraph.newNode({label: nodeId});
				that.springyNodeArray[nodeId] = springyNode;
			}
		}
		
		that.layoutManager.updateNodePosition(that.datasetId, nodeId, that.getNodeLocation(nodeId));

	};

	this.addConnection = function (connectionId, sourceNodeId, targetNodeId, isBidirectional, weight) {

		if (that.connectionSourceLocations[connectionId] == undefined || that.connectionSourceLocations[connectionId] == null) {
			if (that.layoutManager != null) {
				that.connectionSourceLocations[connectionId] = that.nodeLocations[sourceNodeId];
				that.connectionTargetLocations[connectionId] = that.nodeLocations[targetNodeId];
			}

			if (that.springyEdgeArray[connectionId] == undefined || that.springyEdgeArray[connectionId] == null) {
				var customStiffness = (weight == undefined) ? 100 : weight;
				var springyEdge = that.springyGraph.newEdge(that.springyNodeArray[sourceNodeId], that.springyNodeArray[targetNodeId], {label: connectionId, stiffness: customStiffness});
				that.springyEdgeArray[connectionId] = springyEdge;
			}
		}				
		
		that.layoutManager.updateConnectionPosition(that.datasetId, connectionId, that.getConnectionSourceLocation(connectionId), that.getConnectionTargetLocation(connectionId));

	};

	this.removeNode = function (nodeId) {
		
		delete that.nodeLocations[nodeId];
		that.springyGraph.removeNode(that.springyNodeArray[nodeId]);
		delete that.springyNodeArray[nodeId];

	};

	this.removeConnection = function (connectionId) {

		delete that.connectionSourceLocations[connectionId];
		delete that.connectionTargetLocations[connectionId];
		that.springyGraph.removeEdge(that.springyEdgeArray[connectionId]);
		delete that.springyEdgeArray[connectionId];

	};

	this.drawNode = function (node, p) {

		that.nodeLocations[node.data.label] = new THREE.Vector3(p.x, p.y, p.z);
		if (!that.layoutManager.getPerspective()) {
			that.nodeLocations[node.data.label] = new THREE.Vector3(p.x, p.z, p.y);
		}
		if (that.layoutManager != null) {
			that.layoutManager.updateNodePosition(that.datasetId, node.data.label, that.nodeLocations[node.data.label]);
		}

	};

	this.drawEdge = function (edge, p1, p2) {

		var sourcePos = new THREE.Vector3(p1.x, p1.y, p1.z);
		var targetPos = new THREE.Vector3(p2.x, p2.y, p2.z);
		if (!that.layoutManager.getPerspective()) {
			sourcePos = new THREE.Vector3(p1.x, p1.z, p1.y);
			targetPos = new THREE.Vector3(p2.x, p2.z, p2.y);
		}
		that.setConnectionSourceLocation(edge.data.label, sourcePos);
		that.setConnectionTargetLocation(edge.data.label, targetPos);
		if (that.layoutManager != null) {
			that.layoutManager.updateConnectionPosition(that.datasetId, edge.data.label, sourcePos, targetPos);
		}

	};

	this.setNodeLocation = function (nodeId, nodePosition) {
	
		that.springyGraph.nodes.forEach(function(e) {
			if (e.data.label == nodeId) {
				that.nodeLocations[nodeId] = nodePosition;
				var point = that.springyLayout.point(e);
				point.m = 1000000;
				point.p.x = nodePosition.x;
				point.p.y = nodePosition.y;
				point.p.z = nodePosition.z;
				if (!that.layoutManager.getPerspective()) {
					point.p.y = nodePosition.z;
					point.p.z = nodePosition.y;
				}
			}
		});

		that.springyRenderer.start();

	};

	this.getNodeLocation = function (nodeId) {

		return that.nodeLocations[nodeId];

	};

	this.getConnectionSourceLocation = function (connectionId) {

		return that.connectionSourceLocations[connectionId];

	};

	this.setConnectionSourceLocation = function (connectionId, sourcePos) {

		that.connectionSourceLocations[connectionId] = sourcePos;

	};

	this.getConnectionTargetLocation = function (connectionId) {

		return that.connectionTargetLocations[connectionId];

	};

	this.setConnectionTargetLocation = function (connectionId, targetPos) {

		that.connectionTargetLocations[connectionId] = targetPos;

	};

	this.setLayoutManager = function (layoutManager) {
		that.layoutManager = layoutManager;
	};
	
	this.getDatasetId = function (datasetId) {
		return that.datasetId;
	};

	this.setDatasetId = function (datasetId) {
		that.datasetId = datasetId;
	};

	this.getDiameter = function () {
		return that.diameter;
	};

	this.setDiameter = function (diameter) {
		that.diameter = diameter;
	};
	
	this.clear = function () {
		
		that.nodeLocations = {};  //[nodeId] = float[3]
		that.connectionSourceLocations = {}; //[connectionId] = float[3]
		that.connectionTargetLocations = {}; //[connectionId] = float[3]

		that.springyNodeArray = {};
		that.springyEdgeArray = {};

		that.springyGraph = null;

		that.springyGraph = new Springy.Graph(that.perspective);

		//that.springyUserNode = that.springyGraph.newNode({label: "springy_user"});

		that.springyLayout = new Springy.Layout.ForceDirected(that.springyGraph,
				  400.0, // Spring stiffness
				  6400.0, // Node repulsion
				  0.5 // Damping
				);
				
		var nodeUpdateCallback = that.drawNode.bind(that);
		var edgeUpdateCallback = that.drawEdge.bind(that);
		
		that.springyRenderer.stop();
		that.springyRenderer = new Springy.Renderer(that.springyLayout, function clear() {}, edgeUpdateCallback, nodeUpdateCallback);

		that.springyRenderer.start();
		
	};

	this.reset = function () {
		for (var nodeId in that.nodeLocations) {
			that.layoutManager.updateNodePosition(that.datasetId, nodeId, that.nodeLocations[nodeId]);
		}
		for (var connectionId in that.connectionSourceNodeIds) {
			that.layoutManager.updateConnectionPosition(that.datasetId, connectionId, that.connectionSourceLocations[connectionId], that.connectionTargetLocations[connectionId]);
		}
		that.springyGraph.nodes.forEach(function(e) {
			var point = that.springyLayout.point(e);
			point.m = 10;
		});
		that.springyRenderer.start();
	};

	this.setPaused = function(paused) {
		that.paused = paused;
		if (paused) {
			that.springyRenderer.stop();
		} else {
			that.springyRenderer.start();
		}
	};

	this.setPerspective = function (pers) {
		that.perspective = pers;
		that.springyGraph.setPerspective(pers);
	};

	this.init();
	
	return {
		
		clone : that.clone,
		init : that.init,
		clear : that.clear,
		reset : that.reset,

		getId : that.getId,
		setId : that.setId,
		getDatasetId : that.getDatasetId,
		setDatasetId : that.setDatasetId,
		getMinAxisCount : that.getMinAxisCount,
		getMaxAxisCount : that.getMaxAxisCount,
		
		getCurrentAxisCount : that.getCurrentAxisCount,
		setCurrentAxisCount : that.setCurrentAxisCount,
		getDiameter : that.getDiameter,
		setDiameter : that.setDiameter,
		setLayoutManager : that.setLayoutManager,
		
		addNode : that.addNode,
		addConnection : that.addConnection,
		removeNode : that.removeNode,
		removeConnection : that.removeConnection,
		setNodeLocation : that.setNodeLocation,
		getNodeLocation : that.getNodeLocation,
		getConnectionSourceLocation : that.getConnectionSourceLocation,
		setConnectionSourceLocation : that.setConnectionSourceLocation,
		getConnectionTargetLocation : that.getConnectionTargetLocation,
		setConnectionTargetLocation : that.setConnectionTargetLocation,
		
		drawNode : that.drawNode,
		drawEdge : that.drawEdge,
		
		setLayoutManager : that.setLayoutManager, 
		
		setPerspective : that.setPerspective, 
		
		setPaused : that.setPaused,
		getPaused : that.getPaused

	};
		
};

//ForceDirectedLayout.prototype = new Layout();