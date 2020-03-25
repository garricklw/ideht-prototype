/** 
 * Class: CallbackHandler
 * This class represents a callback handler to be implemented by VisualizationSandbox wrappers
  */
var CallbackHandler = function () {

};

CallbackHandler.prototype = {
	
	//	Function: sandboxStateChanged
	// all arguments of type String {"Loading", "Rendering", "Ready"}
	sandboxStateChanged : function (oldState, newState) {},
	//	Function: visualizationSetupChanged
	//all arguments of type bool 
	visualizationSetupChanged : function (lightsChanged, backgroundObjectsChanged, hudSetupChanged, dataSetupChanged) {},
	//	Function: dataChanged
	//all arguments of type String[]
	dataChanged : function (addedNodeIds, removedNodeIds, addedConnectionIds, removedConnectionIds) {},
	//	Function: hidingChanged
	//all arguments of type String[]
	hidingChanged : function (hiddenNodeIds, hiddenConnectionIds, unhiddenNodeIds, unhiddenConnectionIds) {},
	//	Function: selectionChanged
	//all arguments of type String[]
	selectionChanged : function (selectedNodeIds, deselectedNodeIds, selectedConnectionIds, deselectedConnectionIds) {},
	//	Function: highlightingChanged
	//all arguments of type String[]
	highlightingChanged : function (highlightedNodeIds, dehighlightedNodeIds, highlightedConnectionIds, dehighlightedConnectionIds) {}

};