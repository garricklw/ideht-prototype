/** 
 * Class: RandomLayout
 * This class represents a random layout
  */
var RandomLayout = function (diameter, layoutManager) {
	
	this.diameter = diameter;
	this.layoutManager = layoutManager;
	this.datasetId;

	this.nodeLocations = {};  //[nodeId] = float[3]
	this.connectionSourceNodeIds = {}; //[connectionId] = nodeId
	this.connectionSourceLocations = {}; //[connectionId] = float[3]
	this.connectionTargetNodeIds = {}; //[connectionId] = nodeId
	this.connectionTargetLocations = {}; //[connectionId] = float[3]
	
	var that = this;
	
	this.init = function () {

		that.nodeLocations = {};  //[nodeId] = float[3]
		that.connectionSourceNodeIds = {}; //[connectionId] = nodeId
		that.connectionSourceLocations = {}; //[connectionId] = float[3]
		that.connectionTargetNodeIds = {}; //[connectionId] = nodeId
		that.connectionTargetLocations = {}; //[connectionId] = float[3]

		that.layoutManager = layoutManager;
		that.id = "Random";
		that.minAxisCount = 1;
		that.maxAxisCount = 3;
		that.currentAxisCount = 3;
		that.diameter = diameter;

	};

	this.addNode = function (nodeId) {
		
		if (that.nodeLocations[nodeId] == undefined || that.nodeLocations[nodeId] == null) {
			that.setNodeLocation(nodeId, new THREE.Vector3(-that.diameter/2.0+Math.random()*that.diameter, -that.diameter/2.0+Math.random()*that.diameter, -that.diameter/2.0+Math.random()*that.diameter));
		}
		that.layoutManager.updateNodePosition(that.datasetId, nodeId, that.getNodeLocation(nodeId));

	};

	this.addConnection = function (connectionId, sourceNodeId, targetNodeId, isBidirectional, weight) {

		if (that.connectionSourceLocations[connectionId] == undefined || that.connectionSourceLocations[connectionId] == null) {
			that.connectionSourceNodeIds[connectionId] = sourceNodeId;
			that.connectionTargetNodeIds[connectionId] = targetNodeId;
			if (that.nodeLocations[sourceNodeId] != undefined && that.nodeLocations[sourceNodeId] != null) {
				that.connectionSourceLocations[connectionId] = that.nodeLocations[sourceNodeId];
			} else {
				that.connectionSourceLocations[connectionId] = 0.0;
			}
			if (that.nodeLocations[targetNodeId] != undefined && that.nodeLocations[targetNodeId] != null) {
				that.connectionTargetLocations[connectionId] = that.nodeLocations[targetNodeId];
			} else {
				that.connectionTargetLocations[connectionId] = 0.0;
			}
		}			
		
		that.layoutManager.updateConnectionPosition(that.datasetId, connectionId, that.getConnectionSourceLocation(connectionId), that.getConnectionTargetLocation(connectionId));
		
	};

	this.removeNode = function (nodeId) {
		
		delete that.nodeLocations.nodeId;

	};

	this.removeConnection = function (connectionId) {

		delete that.connectionSourceNodeIds.connectionId;
		delete that.connectionTargetNodeIds.connectionId;
		delete that.connectionSourceLocations.connectionId;
		delete that.connectionTargetLocations.connectionId;

	};

	this.getNodeLocation = function (nodeId) {

		return that.nodeLocations[nodeId];

	};

	this.setNodeLocation = function (nodeId, nodePosition) {
		
		var connectionsToUpdate = {};
		that.nodeLocations[nodeId] = nodePosition;
		that.layoutManager.updateNodePosition(that.datasetId, nodeId, nodePosition);

		for (var connectionId in that.connectionSourceNodeIds) {
			if (that.connectionSourceNodeIds[connectionId] == nodeId) {
				that.setConnectionSourceLocation(connectionId, that.nodeLocations[nodeId]);
				connectionsToUpdate[connectionId] = 1;
			}
		}
		for (var connectionId in that.connectionTargetNodeIds) {
			if (that.connectionTargetNodeIds[connectionId] == nodeId) {
				that.setConnectionTargetLocation(connectionId, that.nodeLocations[nodeId]);
				connectionsToUpdate[connectionId] = 1;
			}
		}
		
		for (var connectionId in connectionsToUpdate) {
			that.layoutManager.updateConnectionPosition(that.datasetId, connectionId, that.getConnectionSourceLocation(connectionId), that.getConnectionTargetLocation(connectionId));
		}
		
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
		that.connectionSourceNodeIds = {}; //[connectionId] = nodeId
		that.connectionSourceLocations = {}; //[connectionId] = float[3]
		that.connectionTargetNodeIds = {}; //[connectionId] = nodeId
		that.connectionTargetLocations = {}; //[connectionId] = float[3]

		that.layoutManager = layoutManager;
		that.id = "Random";
		that.minAxisCount = 1;
		that.maxAxisCount = 3;
		that.currentAxisCount = 3;
		that.diameter = diameter;
		
	};

	this.reset = function () {
		for (var nodeId in that.nodeLocations) {
			that.nodeLocations[nodeId] = new THREE.Vector3(-that.diameter/2.0+Math.random()*that.diameter, -that.diameter/2.0+Math.random()*that.diameter, -that.diameter/2.0+Math.random()*that.diameter);
			that.layoutManager.updateNodePosition(that.datasetId, nodeId, that.nodeLocations[nodeId]);
		}
		for (var connectionId in that.connectionSourceNodeIds) {
			that.connectionSourceLocations[connectionId] = that.nodeLocations[that.connectionSourceNodeIds[connectionId]];
			that.connectionTargetLocations[connectionId] = that.nodeLocations[that.connectionTargetNodeIds[connectionId]];
			that.layoutManager.updateConnectionPosition(that.datasetId, connectionId, that.connectionSourceLocations[connectionId], that.connectionTargetLocations[connectionId]);
		}
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
		
		setLayoutManager : that.setLayoutManager		
		
	};
		
};

//RandomLayout.prototype = new Layout();