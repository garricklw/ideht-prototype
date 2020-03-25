/** 
 * Class: UserDefinedLayout
 * This class represents a layout that specifies locations for nodes based on user or other algorithms beyond Random and Force-Directed layouts
  */
var UserDefinedLayout = function (diameter, layoutManager) {

	this.diameter = diameter;
	this.layoutManager = layoutManager;
	this.datasetId;

	this.nodeArray;
	this.edgeArray;
	
	this.nodeLocations = {};  //[nodeId] = float[3]
	this.connectionSourceLocations = {}; //[connectionId] = float[3]
	this.connectionTargetLocations = {}; //[connectionId] = float[3]

	var that = this;

	this.init = function () {

		that.nodeArray = {};
		that.edgeArray = {};
		that.layoutManager = layoutManager;
		that.minAxisCount = 1;
		that.maxAxisCount = 3;
		that.currentAxisCount = 3;
		that.diameter = diameter;

		that.nodeLocations = {};  //[nodeId] = float[3]
		that.connectionSourceLocations = {}; //[connectionId] = float[3]
		that.connectionTargetLocations = {}; //[connectionId] = float[3]

	};

	this.addNode = function (nodeId) {

		if (that.layoutManager != null) {
			if (that.nodeLocations[nodeId] == undefined || that.nodeLocations[nodeId] == null) {
				that.setNodeLocation(nodeId, [0.0, 0.0, 0.0]);
			} else {
				that.layoutManager.updateNodePosition(that.datasetId, nodeId, that.nodeLocations[nodeId]);
			}
		}

	};

	this.addConnection = function (connectionId, sourceNodeId, targetNodeId, isBidirectional) {

		that.setConnectionSourceLocation(connectionId, that.nodeLocations[sourceNodeId]);
		that.setConnectionTargetLocation(connectionId, that.nodeLocations[targetNodeId]);

		that.edgeArray[connectionId] = {id: connectionId, source: sourceNodeId, target: targetNodeId, birdirectional: isBidirectional};
		
		if (that.layoutManager != null) {
			that.layoutManager.updateConnectionPosition(that.datasetId, connectionId, that.nodeLocations[sourceNodeId], that.nodeLocations[targetNodeId]);
		}

		// if (isBidirectional) {
			// this.springyGraph.newEdge(this.springyNodeArray[targetNodeId], this.springyNodeArray[sourceNodeId], {label: connectionId});
		// }

	};

	that.removeNode = function (nodeId) {

		delete that.nodeArray.nodeId;

	};

	this.removeConnection = function (connectionId) {

		delete that.edgeArray.connectionId;

	};

	this.setNodeLocation = function (nodeId, nodePosition) {

		that.nodeLocations[nodeId] = nodePosition;
		if (that.layoutManager != null) {
			that.layoutManager.updateNodePosition(that.datasetId, nodeId, nodePosition);
		}
		
	};

	this.clear = function () {

		that.init();

	};
	
	this.reset = function () {

	};
	
	this.setLayoutManager = function (layoutManager) {
		that.layoutManager = layoutManager;
	};

	this.init();

	return {
	
		clone : this.clone,
		init : this.init,
		clear : this.clear,
		reset : this.reset,

		getId : this.getId,
		setId : this.setId,
		getDatasetId : this.getDatasetId,
		setDatasetId : this.setDatasetId,
		getMinAxisCount : this.getMinAxisCount,
		getMaxAxisCount : this.getMaxAxisCount,
		
		getCurrentAxisCount : this.getCurrentAxisCount,
		setCurrentAxisCount : this.setCurrentAxisCount,
		getDiameter : this.getDiameter,
		setDiameter : this.setDiameter,
		setLayoutManager : this.setLayoutManager,
		
		addNode : this.addNode,
		addConnection : this.addConnection,
		removeNode : this.removeNode,
		removeConnection : this.removeConnection,
		setNodeLocation : this.setNodeLocation,
		getNodeLocation : this.getNodeLocation,
		getConnectionSourceLocation : this.getConnectionSourceLocation,
		setConnectionSourceLocation : this.setConnectionSourceLocation,
		getConnectionTargetLocation : this.getConnectionTargetLocation,
		setConnectionTargetLocation : this.setConnectionTargetLocation,
				
		setLayoutManager : this.setLayoutManager
		
	};
		
};

//UserDefinedLayout.prototype = new Layout();
