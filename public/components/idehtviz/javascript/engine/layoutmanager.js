/** 
 * Class: LayoutManager
 * This class represents VisualizationSandbox layout manager
  */
var LayoutManager = function (visualizationSandbox, diameter) {

	this.visualizationSandbox = visualizationSandbox;

	this.datasetLayouts; //[datasetId] = Layout;

	this.diameter = diameter;
			
	this.paused = false;
		
	this.datasetLayouts = {}; //[datasetId] = Layout;

	var that = this;
	
	this.getDatasetLayout = function (datasetId) {
		return that.datasetLayouts[datasetId];
	};

	this.setDatasetLayout = function (datasetId, layout) {
	
		/*
		if (that.datasetLayouts[datasetId] != undefined && that.datasetLayouts[datasetId] != null) {
			that.datasetLayouts[datasetId].clear();
			that.datasetLayouts[datasetId].setLayoutManager(null);
		}
		*/
			
		layout.setDatasetId(datasetId);
		layout.setLayoutManager(that);
		layout.setDiameter(that.diameter);
//		layout.reset();
		that.datasetLayouts[datasetId] = layout;

	};

	this.addNode = function (datasetId, nodeId, forceAddition) {

		if (that.datasetLayouts[datasetId] != undefined && that.datasetLayouts[datasetId] != null) {
			var layout = that.datasetLayouts[datasetId];
			if (layout != undefined && layout != null) {
				layout.addNode(nodeId);
			}
		}

	};

	this.addConnection = function (datasetId, connectionId, sourceNodeId, targetNodeId, isBidirectional, weight, forceAddition) {

		if (that.datasetLayouts[datasetId] != undefined && that.datasetLayouts[datasetId] != null) {
			var layout = that.datasetLayouts[datasetId];
			if (layout != undefined && layout != null) {
				layout.addConnection(connectionId, sourceNodeId, targetNodeId, isBidirectional, weight);
			}
		}

	};

	this.removeNode = function (datasetId, nodeId) {

		if (that.datasetLayouts[datasetId] != undefined && that.datasetLayouts[datasetId] != null) {
			var layout = that.datasetLayouts[datasetId];
			if (layout != undefined && layout != null) {
				layout.removeNode(nodeId);
			}
		}

	};

	this.removeConnection = function (datasetId, connectionId) {

		if (that.datasetLayouts[datasetId] != undefined && that.datasetLayouts[datasetId] != null) {
			var layout = that.datasetLayouts[datasetId];
			if (layout != undefined && layout != null) {
				layout.removeConnection(connectionId);
			}
		}

	};

	this.updateNodePosition = function(datasetId, nodeId, nodePosition) {

		that.visualizationSandbox.updateNodePosition(datasetId, nodeId, nodePosition);

	};

	this.updateConnectionPosition = function(datasetId, connectionId, sourcePos, targetPos) {

		that.visualizationSandbox.updateConnectionPosition(datasetId, connectionId, sourcePos, targetPos);

	};

	this.getNodeLocation = function (datasetId, nodeId) {

		if (that.datasetLayouts[datasetId] != undefined && that.datasetLayouts[datasetId] != null) {
			var layout = that.datasetLayouts[datasetId];
			return layout.getNodeLocation(nodeId);
		} else {
			return [0.0, 0.0, 0.0];
		}
		
	};

	this.setNodeLocation = function (datasetId, nodeId, nodePosition) {

		if (that.datasetLayouts[datasetId] != undefined && that.datasetLayouts[datasetId] != null) {
			var layout = that.datasetLayouts[datasetId];
			layout.setNodeLocation(nodeId, nodePosition);
		}

	};

	this.getConnectionSourceLocation = function (datasetId, connectionId) {

		if (that.datasetLayouts[datasetId] != undefined && that.datasetLayouts[datasetId] != null) {
			var layout = that.datasetLayouts[datasetId];
			return layout.getConnectionSourceLocation(connectionId);
		} else {
			return [0.0, 0.0, 0.0];
		}

	};

	this.setConnectionSourceLocation = function (datasetId, connectionId, sourcePos) {

		if (that.datasetLayouts[datasetId] != undefined && that.datasetLayouts[datasetId] != null) {
			var layout = that.datasetLayouts[datasetId];
			layout.setConnectionSourceLocation(connectionId, sourcePos);
		}

	};

	this.getConnectionTargetLocation = function (datasetId, connectionId) {

		if (that.datasetLayouts[datasetId] != undefined && that.datasetLayouts[datasetId] != null) {
			var layout = that.datasetLayouts[datasetId];
			return layout.getConnectionTargetLocation(connectionId);
		} else {
			return [0.0, 0.0, 0.0];
		}

	};

	this.setConnectionTargetLocation = function (datasetId, connectionId, targetPos) {

		if (that.datasetLayouts[datasetId] != undefined && that.datasetLayouts[datasetId] != null) {
			var layout = that.datasetLayouts[datasetId];
			layout.setConnectionTargetLocation(connectionId, targetPos);
		}

	};
	
	this.getPerspective = function () {
		return that.visualizationSandbox.getPerspective();
	};

	this.reset = function (datasetId) {
			that.datasetLayouts[datasetId].reset();
	};
	
	return {
	
		setDatasetLayout : that.setDatasetLayout,
		getDatasetLayout : that.getDatasetLayout,
		addNode : that.addNode,
		addConnection : that.addConnection,
		removeNode : that.removeNode,
		removeConnection : that.removeConnection,
		updateNodePosition : that.updateNodePosition,
		updateConnectionPosition : that.updateConnectionPosition,
		
		setNodeLocation : that.setNodeLocation,
		getNodeLocation : that.getNodeLocation,
		getConnectionSourceLocation : that.getConnectionSourceLocation,
		setConnectionSourceLocation : that.setConnectionSourceLocation,
		getConnectionTargetLocation : that.getConnectionTargetLocation,
		setConnectionTargetLocation : that.setConnectionTargetLocation,
		getPerspective : that.getPerspective,
		reset : that.reset
		
	};
		
};

var Layout = function (id, minAxisCount, maxAxisCount, currentAxisCount, diameter) {

	this.paused = false;
		
	this.id = id; //String

	this.datasetId = null;
		
	this.layoutManager = null;
		
	this.minAxisCount = minAxisCount; //int

	this.maxAxisCount = maxAxisCount; //int
		
	this.currentAxisCount = currentAxisCount; //int
		
	this.diameter = diameter;
		
	this.nodeLocations = {}; //[nodeId] = float[3]
		
	this.connectionSourceLocations = {}; //[connectionId] = float[3]

	this.connectionTargetLocations = {}; //[connectionId] = float[3]

	var that = this;
	
	this.setPaused = function(paused) {
		that.paused = paused;
	};
	
	this.getPaused = function() {
		return that.paused;
	};
		
	this.clone = function () {
		return new Layout(that.id, that.minAxisCount, that.maxAxisCount, that.currentAxisCount);
	};

	this.init = function () {

	};

	this.getId = function () {
		return that.id;
	};

	this.setId = function (id) {
		that.id = id;
	};

	this.getDatasetId = function (datasetId) {
		return that.datasetId;
	};

	this.setDatasetId = function (datasetId) {
		that.datasetId = datasetId;
	};

	this.getMinAxisCount = function () {
		return that.minAxisCount;
	};

	this.getMaxAxisCount = function () {
		return that.maxAxisCount;
	};

	this.getCurrentAxisCount = function () {
		return that.currentAxisCount;
	};

	this.setCurrentAxisCount = function (axisCount) {
		that.currentAxisCount = axisCount;
	};

	this.getDiameter = function () {
		return that.diameter;
	};

	this.setDiameter = function (diameter) {
		that.diameter = diameter;
	};

	this.setLayoutManager = function (layoutManager) {
		that.layoutManager = layoutManager;
	};
	
	this.addNode = function (nodeId) {


	};

	this.addConnection = function (connectionId, sourceNodeId, targetNodeId, isBidirectional) {


	};

	this.removeNode = function (connectionId) {


	};

	this.removeConnection = function (connectionId) {


	};

	this.setNodeLocation = function (nodeId, nodePosition) {

		that.nodeLocations[nodeId] = nodePosition;

	};

	this.getNodeLocation = function (nodeId) {

		return that.nodeLocations[nodeId];

	};

	this.getConnectionSourceLocation = function (connectionId) {

		return that.connectionSourceLocations[connectionId];

	};

	this.setConnectionSourceLocation = function (connectionId, sourcePos) {

		return that.connectionSourceLocations[connectionId];

	};

	this.getConnectionTargetLocation = function (connectionId) {

		return that.connectionTargetLocations[connectionId];

	};

	this.setConnectionTargetLocation = function (connectionId, targetPos) {

		return that.connectionTargetLocations[connectionId];

	};

	this.clear = function () {

	};
	
	this.reset = function () {

	};
	
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
		setPaused : that.setPaused,
		getPaused : that.getPaused

	};
		
};