/** 
 * Class: IDEHTViz
 * This class contains the main IDEHTViz interface to the
 * Perceptronics Solutions' VisualizationSandbox visualization engine.
  */
var IDEHTViz = function () {
	  
	var that = this;

	this.vs = null;
	this.perspective = true;
	this.canvasName = null;

	this.lastDataTime = -1;

	this.network = null;

	this.nodeVisibilities = {};
	this.linkVisibilities = {};

	this.nodeProperties = new Array();
	this.linkProperties = new Array();

	this.currentLayout;
	this.currentLinkStyle;
	this.currentNodeStyle;

	this.setupVisualization = function(canvasElementName, data) {
	
	  that.canvasName = canvasElementName;

	  that.vs = new VisualizationSandbox();
	  //Instantiate visualization with a canvas DOM object (and no visualization setup - meaning it will start with default setup)
	  that.vs.init(
		document.getElementById(canvasElementName),
		VisualizationSetup.prototype.getDefault()
	  );

	  //Set camera position and orientation
	  var cameraSetup = new CameraSetup(0, 0, 100, 0, 0, 0, 50.0);
	  that.vs.setCameraSetup(cameraSetup);

	  that.vs.setLayoutScale(2);

	  that.vs.setPerspective(false); // Switch to 2D Mode

	  that.vs.setHoverCallback(that.hoverCallback.bind(that));

      // var networkData = {"nodes":[{"id":"Person 1", "metaData1":0.5},{"id":"Person 2", "metaData1":1.0}, {"id":"Person 3", "metaData1":0.2}],"links":[{"sourceNodeId":"Person 1","targetNodeId":"Person 2","metaData1":0.1,"metaData2":2}, {"sourceNodeId":"Person 2","targetNodeId":"Person 1","metaData1":0.25,"metaData2":0.1}, {"sourceNodeId":"Person 2","targetNodeId":"Person 3","metaData1":0.3,"metaData2":0.25}]};
	  that.makeNetwork(data);
	};

	this.hoverCallback  = function(nodeId, linkId) {
		console.log("Hovered Node: " + nodeId + " " + " Hovered Link: " + linkId);		
	};

	this.updateHiddenOnBackend  = function() {
		var tempShownNodes = new Array();
		var tempShownLinks = new Array();
		for (var nodeId in that.nodeVisibilities) {
			if (that.nodeVisibilities.hasOwnProperty(nodeId)) {
				if (that.nodeVisibilities[nodeId]) {
					tempShownNodes.push(nodeId);
				}
			}
		}
		for (var linkId in that.linkVisibilities) {
			if (that.linkVisibilities.hasOwnProperty(linkId)) {
				if (that.linkVisibilities[linkId]) {
					tempShownLinks.push(linkId);
				}
			}
		}
	};

	this.updateNodeStyle = function(style, refreshLayout) {

		for (var nodeId in that.network.nodes) {
			if (that.network.nodes.hasOwnProperty(nodeId)) {
				var color = {r: 128, g: 128, b: 128};
				if (style.nodeColors != null && style.nodeColors[nodeId] != null) {
					color = style.nodeColors[nodeId];
				}
				var transparency = 0.0;
				if (style.nodeTransparencies != null && style.nodeTransparencies[nodeId] != null) {
					transparency = style.nodeTransparencies[nodeId];
				}
				var size = 1.0;
				if (style.nodeSizes != null && style.nodeSizes[nodeId] != null) {
					size = style.nodeSizes[nodeId];
				}
				var model = null;
				if (style.nodeModels != null && style.nodeModels[nodeId] != null) {
					model = style.nodeModels[nodeId];
				}
				 var texture = null;
				if (style.nodeTextures != null && style.nodeTextures[nodeId] != null) {
					var texture = style.nodeTextures[nodeId];
				}
				var laf = new NodeLookAndFeel(
					   model,
					   [color.r, color.g, color.b],
					   [128, 128, 128],
					   texture,
					   size,
					   transparency,
					   false,
					   "Scale_Change",
					   {}
					 );
				that.vs.updateNodeLookAndFeel("Dataset0", nodeId, laf);
			}
		}
		if (refreshLayout) {
			if (that.currentLayout != null) {
				that.updateLayout(that.currentLayout);
			}
			if (that.currentLinkStyle != null) {
				that.updateLinkStyle(that.currentLinkStyle, false);
			}
		}
		that.updateVisibilities();

	};

	this.updateLinkStyle = function(style, refreshLayout) {

		for (var linkId in that.network.links) {
			if (that.network.links.hasOwnProperty(linkId)) {
				var color = {r: 128, g: 128, b: 128};
				if (style.linkColors != null && style.linkColors[linkId] != null) {
					color = style.linkColors[linkId];
				}
				var transparency = 0.0;
				if (style.linkTransparencies != null && style.linkTransparencies[linkId] != null) {
					transparency = style.linkTransparencies[linkId];
				}
				var size = 1.0;
				if (style.linkSizes != null && style.linkSizes[linkId] != null) {
					size = style.linkSizes[linkId];
				}
				var model = null;
				if (style.linkModels != null && style.linkModels[linkId] != null) {
					model = style.linkModels[linkId];
				}
				 var texture = null;
				if (style.linkTextures != null && style.linkTextures[linkId] != null) {
					var texture = style.linkTextures[linkId];
				}
				var laf = new ConnectionLookAndFeel(
						model,
						new NodeLookAndFeel(
						   "ArrowHead",
						   [color.r, color.g, color.b],
						   [128, 128, 128],
						   texture,
						   size/4.0,
						   transparency,
						   false,
						   "Scale_Change",
						   {}
						),
						texture,
						[color.r, color.g, color.b],
						[128, 128, 128],
						size,
						transparency,
						false,
						"Move_Component"
					);
				 that.vs.updateConnectionLookAndFeel("Dataset0", linkId, laf);
			}
		}
		that.updateVisibilities();

	}

	this.updateLayout = function(layout) {

		if (layout.type != "FORCE_DIRECTED") {
			 for (var nodeId in layout.xPositions) {
				that.vs.overrideNodePosition("Dataset0", nodeId, {x: layout.xPositions[nodeId], y: layout.yPositions[nodeId], z: layout.zPositions[nodeId]});
			 }
			 if (layout.xAxisLegend == null && 
				layout.yAxisLegend == null &&
				layout.zAxisLegend == null) {
			} else {
			}
		} else {
			that.vs.getLayoutManager().reset("Dataset0");
		}

	}

	this.makeNetwork = function(net) {

	  that.removeAll();
	  that.network = net;
	  that.hidingDeselected = false;
	  
	  //Setup a custom visualization style
	  var simpleVisualizationStyle = new VisualizationStyle("Simple", {
		"Force-Directed": new ForceDirectedLayout(100.0, that.vs.getLayoutManager())
	  });

	  //Make some nodes
	  var nodes0 = {};
	  for (var index = 0; index < that.network.nodes.length; index++) {
		var node = that.network.nodes[index];
		nodes0[node.id] = new Node(node.id, node.id, node.id);
		simpleVisualizationStyle.setNodeTypeLookAndFeel(
		  node.id,
		  new NodeLookAndFeel(
			"Sphere",
			[node.metaData1*255, 256-node.metaData1*255, 0],
			[230, 230, 230],
			"http://localhost:3000/components/idehtviz/data/textures/cc4.png",
			node.metaData1*5,
			0.0,
			false,
			"Scale_Change",
			{}
		  )
		);
	  } 	
		
	  //Make some connections
	  var connections0 = {};
	  var connectionMap = {};

	  var linkCount = 0;

	  for (var linkId in that.network.links) {
		if (that.network.links.hasOwnProperty(linkId)) {
		  var link = that.network.links[linkId];
		  that.linkVisibilities[linkId] = true;
		  var sourceNodeId = link.sourceNodeId;
		  var targetNodeId = link.targetNodeId;
		  connections0[linkId] = new Connection(
			linkId,
			linkId,
			sourceNodeId,
			targetNodeId,
			true,
			linkId,
			100
		  );
		  simpleVisualizationStyle.setConnectionTypeLookAndFeel(
			linkId,
			new ConnectionLookAndFeel(
			  "Cylinder",
			  new NodeLookAndFeel(
				"ArrowHead",
				[128, 128, 128],
				[128, 128, 128],
				null,
				0.5,
				0.0,
				false,
				"Scale_Change"
			  ),
			  null,
			  [128, 128, 128],
			  [128, 128, 128],
			  link.metaData1,
			  0.0,
			  false,
			  "Move_Component"
			)
		  );

		  linkCount += 1;
		}
	  }

	for (var index = 0; index < that.network.nodes.length; index++) {
		var node = that.network.nodes[index];
		that.nodeVisibilities[node.id] = true;
	}
	  
	  //Make a dataset with the nodes and connections we made and add the dataset to the visualization
	  var dataset0 = new VisualizationDataset("Dataset0", nodes0, connections0);
	  var visualizationStyles = {};
	  visualizationStyles[simpleVisualizationStyle.getId()] = simpleVisualizationStyle;
	  
	  that.updateNodePropertiesList();
	  that.updateLinkPropertiesList();

      that.vs.setHiddenNodes(that.nodeVisibilities);

	  that.vs.addDataset(dataset0, visualizationStyles);

	  that.vs.updateSelectedDataset();
	
	  that.lastClientUpdateTime = new Date().getTime();
  
	};

	this.checkNodeDisconnected = function (nodeId) {
		for (var linkId in that.network.links) {
			if (that.network.links.hasOwnProperty(linkId)) {
				var link = that.network.links[linkId];
				var fromNode = link.sourceNodeId;
				var toNode = link.targetNodeId;
				if (fromNode == nodeId || toNode == nodeId) {
					return false;
				}
			}
		}
		return false;
	};
	
	this.addNode = function(newNode, permanent) {
	  var node = new Node(newNode.id, newNode.id, newNode.id);
	  
	  that.nodeVisibilities[newNode.id] = false;
	
	  that.updateVisibilities();
	  
	  var nodeStyle = new NodeLookAndFeel(
		"Cube",
		[128, 128, 128],
		[128, 128, 128],
		null,
		2.0,
		0.0,
		false,
		"Scale_Change",
		{}
	  );
	  that.network.nodes[newNode.id] = newNode;
	  that.vs.setNodeType("Dataset0", "Simple", newNode.id, nodeStyle);
	  that.vs.addNode("Dataset0", node);
	 
	};

	this.removeNode = function(nodeId, permanent) {
	  delete that.network.nodes[nodeId];
	  that.vs.removeNode("Dataset0", nodeId);
	  delete that.nodeVisibilities[nodeId];
	  
	  that.updateVisibilities();
	  
	};

	this.addConnection = function(newLink, permanent) {
	
	  that.nodeVisibilities[newLink.sourceNodeId] = true;
	  that.nodeVisibilities[newLink.targetNodeId] = true;
	  
	  that.updateVisibilities();
	  
	  var connection = new Connection(
		newLink.id,
		newLink.name,
		newLink.sourceNodeId,
		newLink.targetNodeId,
		!newLink.directional,
		newLink.id,
		100
	  );
	  var connectionStyle = new ConnectionLookAndFeel(
		"Cylinder",
		new NodeLookAndFeel(
		  "ArrowHead",
		  [64, 64, 64],
		  [64, 64, 64],
		  null,
		  0.5,
		  0.0,
		  false,
		  "Scale_Change"
		),
		null,
		[64, 64, 64],
		[64, 64, 64],
		0.2,
		0.0,
		false,
		"Move_Component"
	  );

	  that.network.links[newLink.id] = newLink;

	  that.vs.setConnectionType("Dataset0", "Simple", connection.id, connectionStyle);
	  that.vs.addConnection("Dataset0", connection);
	  that.linkVisibilities[newLink.id] = true;
	
	};

	this.removeConnection = function(linkId, permanent) {
	  
	  var link = that.network.links[linkId];
	  
	  delete that.network.links[linkId];
	  that.vs.removeConnection("Dataset0", linkId);
	  delete that.linkVisibilities[linkId];
      that.hud.updateInfoText();
	  
	  if (that.checkNodeDisconnected(link.sourceNodeId)) {
		  that.nodeVisibilities[link.sourceNodeId] = false;
	  }
	  
	  if (that.checkNodeDisconnected(link.targetNodeId)) {
		  that.nodeVisibilities[link.targetNodeId] = false;
	  }
	  
	  that.updateVisibilities();
	  
	};

	this.removeAll = function() {
	  that.network = {};
	  that.vs.removeAllDatasets();
	  that.nodeVisibilities = {};
	  that.linkVisibilities = {};
	  that.nodeProperties = new Array();
	  that.linkProperties = new Array();
	  that.updateVisibilities();
	};

	this.getHighlighted = function() {
	  return that.vs.getIntersected();
	};

	this.getPerspective = function () {
		return that.perspective;
	};
		
	this.setPerspective = function(on) {
	  that.vs.setPerspective(on);
	};

	this.updateSize = function() {
	  that.vs.updateSize();
	};

	this.switchPerspective = function() {
	  that.perspective = !that.perspective;
	  that.setPerspective(that.perspective);
	  that.resetCamera();
	};

	this.resetCamera  = function() {
		  if (that.perspective) {
			var cameraSetup = new CameraSetup(0, -100, 100, 0, 0, 0, 1.0);
			that.vs.setCameraSetup(cameraSetup);
			that.vs.getCamera().zoom = 1;
			that.vs.getCamera().updateProjectionMatrix();
		  } else {
			var cameraSetup = new CameraSetup(0, 0, 100, 0, 0, 0, 5.0);
			that.vs.setCameraSetup(cameraSetup);
			that.vs.getCamera().zoom = 5;
			that.vs.getCamera().updateProjectionMatrix();
		  }
	};

	this.updateVisibilities = function () {
		that.vs.setHiddenNodes(that.nodeVisibilities);

		for (var nodeId in that.nodeVisibilities) {
			if (that.nodeVisibilities.hasOwnProperty(nodeId)) {
				that.vs.setNodeVisibility("Dataset0", "Dataset0_"+nodeId+"_node", that.nodeVisibilities[nodeId]);
			}
		}
		for (var linkId in that.linkVisibilities) {
			if (that.linkVisibilities.hasOwnProperty(linkId)) {
				that.vs.setConnectionVisibility("Dataset0", "Dataset0_"+linkId+"_connection", that.linkVisibilities[linkId]);
			}
		}
	};

	this.updateNodePropertiesList  = function() {
		  that.nodeProperties = new Array();
		  for (var nodeId in that.network.nodes) {
			if (that.network.nodes.hasOwnProperty(nodeId)) {
			  var node = that.network.nodes[nodeId];
			  for (var attributeId in node.attributes) {
				if (node.attributes.hasOwnProperty(attributeId)) {
					if (!that.nodeProperties.includes(attributeId)) {
						that.nodeProperties.push(attributeId);
					}
				}
			  }
			}
		  }
	};

	this.updateLinkPropertiesList  = function() {
		 that.linkProperties = new Array();
		  for (var linkId in that.network.links) {
			if (that.network.links.hasOwnProperty(linkId)) {
			  var link = that.network.links[linkId];
			  for (var attributeId in link.attributes) {
				if (link.attributes.hasOwnProperty(attributeId)) {
					if (!that.linkProperties.includes(attributeId)) {
						that.linkProperties.push(attributeId);
					}
				}
			  }
			}
		  }
	};

	this.resizeVisualization = function () {
		that.hud.resizeVisualization();
	};
	
	this.getNodeProperties = function () {
		return that.nodeProperties;
	};
	
	this.setNodeProperties = function (nodeProperties) {
		that.nodeProperties = nodeProperties;
	};
		
	this.getLinkProperties = function () {
		return that.linkProperties;
	};
	
	this.setLinkProperties = function (linkProperties) {
		that.linkProperties = linkProperties;
	};
	
	this.getNodeVisibilities = function () {
		return that.nodeVisibilities;
	};
	
	this.setNodeVisibilities = function (nodeVisibilities) {
		that.nodeVisibilities = nodeVisibilities;
	};
	
	this.getLinkVisibilities = function () {
		return that.linkVisibilities;
	};
	
	this.setLinkVisibilities = function (linkVisibilities) {
		that.linkVisibilities = linkVisibilities;
	};

	this.getHidingDisconnected = function () {
		return that.hidingDisconnected;
	};
	
	this.setHidingDisconnected = function (hidingDisconnected) {
		that.hidingDisconnected = hidingDisconnected;
	};
	
	this.getNetwork = function () {
		return that.network;
	};
	
	this.resize = function () {
		//that.hud.resizeVisualization();
	};

	this.getDisconnectedNodes = function () {
		return that.disconnectedNodes;
	};
	
	return {
		/* 
			Function: setupVisualization

			Initializes the visualization environment

			Parameters:

				canvasElementName - name of the HTML5 Canvas (DOM) element to use
				
			Returns:

				N/A
		*/
		setupVisualization : that.setupVisualization,
		
		/* 
			Function: setupHud

			Initializes the HUD components

			Parameters:

				N/A
					
			Returns:

				N/A
		*/
		setupHud : that.setupHud, 
		
		/* 
			Function: getNodeProperties

			Return list of node property names

			Parameters:

				N/A
					
			Returns:

				nodeProperties - Array of node property names
		*/
		getNodeProperties : that.getNodeProperties, 
		
		/* 
			Function: setNodeProperties

			Sets the list of node property names

			Parameters:

				nodeProperties - Array of node property names
					
			Returns:

				N/A
		*/
		setNodeProperties : that.setNodeProperties,
		
		/* 
			Function: getLinkProperties

			Return list of link property names

			Parameters:

				N/A
					
			Returns:

				linkProperties - Array of link property names
		*/
		getLinkProperties : that.getLinkProperties, 
		
		/* 
			Function: setLinkProperties

			Sets the list of link property names

			Parameters:

				linkProperties - Array of link property names
					
			Returns:

				N/A
		*/
		setLinkProperties : that.setLinkProperties, 
		
		/* 
			Function: getNodeVisibilities

			Return map of node id to node visibility flags

			Parameters:

				N/A
					
			Returns:

				nodeVisibilities - map of node id to node visibility flags
		*/
		getNodeVisibilities : that.getNodeVisibilities, 
		
		/* 
			Function: setNodeVisibilities

			Sets the map of node id to node visibility flags

			Parameters:

				nodeVisibilities - map of node id to node visibility flags
					
			Returns:

				N/A
		*/
		setNodeVisibilities : that.setNodeVisibilities, 
		
		/* 
			Function: getLinkVisibilities

			Return map of link id to link visibility flags

			Parameters:

				N/A
					
			Returns:

				linkVisibilities - map of link id to link visibility flags
		*/
		getLinkVisibilities : that.getLinkVisibilities, 
		
		/* 
			Function: setLinkVisibilities

			Sets map of link id to link visibility flags

			Parameters:

				linkVisibilities - map of link id to link visibility flags
					
			Returns:

				N/A
		*/
		setLinkVisibilities : that.setLinkVisibilities, 
		
		/* 
			Function: getHidingDisconnected

			Returns whether CyberViz should hide disconnected nodes

			Parameters:

				N/A
			
			Returns:

				hidingDisconnected - true if CyberViz should be set to hide disconnected nodes
		*/
		getHidingDisconnected : that.getHidingDisconnected, 
		
		/* 
			Function: setHidingDisconnected

			Sets whether CyberViz should hide disconnected nodes

			Parameters:

				hidingDisconnected - true if CyberViz should be set to hide disconnected nodes
					
			Returns:

				N/A
		*/
		setHidingDisconnected : that.setHidingDisconnected, 

		/* 
			Function: updateVisibilities

			Updates node/link visibilities

			Parameters:

				N/A
					
			Returns:

				N/A
		*/
		updateVisibilities : that.updateVisibilities, 

		/* 
			Function: getNetwork

			Returns the network object representing all nodes and links

			Parameters:

				N/A
			
			Returns:

				network - network object representing all nodes and links
		*/
		getNetwork : that.getNetwork, 
		
		/* 
			Function: getPerspective

			Returns whether the CyberViz is in 3D mode or not

			Parameters:

				N/A
				
			Returns:

				3d - true if CyberViz is in 3D mode
		*/
		getPerspective : that.getPerspective, 
		
		/* 
			Function: showOnMap

			Sends a message to visualization service to highlight the user highlighted node on the EWPMT map

			Parameters:

				N/A
				
			Returns:

				N/A
		*/
		showOnMap : that.showOnMap, 
		
		/* 
			Function: requestNodeStyle

			Request the node style chosen in the UI from the visualization service

			Parameters:

				N/A
				
			Returns:

				N/A
		*/
		requestNodeStyle : that.requestNodeStyle, 
		
		/* 
			Function: requestLinkStyle

			Request the link style chosen in the UI from the visualization service

			Parameters:

				N/A
				
			Returns:

				N/A
		*/
		requestLinkStyle : that.requestLinkStyle, 
		
		/* 
			Function: getPerspective

			Request the layout chosen in the UI from the visualization service
	
			Parameters:

				N/A
				
			Returns:

				N/A
		*/
		requestLayout : that.requestLayout, 
		
		/* 
			Function: getDisconnectedNodes

			Gets an array of disconnected node ids
	
			Parameters:

				N/A
				
			Returns:

				N/A
		*/
		getDisconnectedNodes : that.getDisconnectedNodes, 
		
		/* 
			Function: postMessage

			Sends a message to visualization service

			Parameters:

				message - message to be sent to the visualization service
					
			Returns:

				N/A
		*/
		postMessage : that.postMessage, 
		
		/* 
			Function: requestNetworkData

			Retrieves latest network data from visualization service

			Parameters:

				N/A
					
			Returns:

				N/A
		*/
		requestNetworkData : that.requestNetworkData, 

		/* 
			Function: addNode

			Adds a node to the network

			Parameters:

				newNode - new node to be added
				permanent - whether the node is added permanently
					
			Returns:

				N/A
		*/
		addNode : that.addNode,

		/* 
			Function: updateNode

			Updates a node and its properties

			Parameters:

				updatedNode - updated node
					
			Returns:

				N/A
		*/
		updateNode : that.updateNode,

		/* 
			Function: addConnection

			Adds a link to the network

			Parameters:

				newLink - new link to be added
				permanent - whether the link is added permanently
					
			Returns:

				N/A
		*/
		addConnection : that.addConnection,
		
		/* 
			Function: updateConnection

			Updates a connection and its properties

			Parameters:

				oldId - old link id 
				updatedLink - updated link
					
			Returns:

				N/A
		*/
		updateConnection : that.updateConnection,
		
		/* 
			Function: removeNode

			Removes a node from the network

			Parameters:

				nodeId - id of the node to be removed
				permanent - whether the node is removed permanently
					
			Returns:

				N/A
		*/
		removeNode : that.removeNode,

		/* 
			Function: removeConnection

			Removes a link From the network

			Parameters:

				linkId - id of the link to be removed
				permanent - whether the link is removed permanently
					
			Returns:

				N/A
		*/
		removeConnection : that.removeConnection,
		
		/* 
			Function: switchPerspective

			Toggles between 2D and 3D modes

			Parameters:

				N/A
					
			Returns:

				N/A
		*/
		switchPerspective : that.switchPerspective, 
		
		/* 
			Function: resize

			Resizes CyberViz to match window size

			Parameters:

				N/A
					
			Returns:
					
				N/A
		*/
		resize : that.resize, 
		
		/* 
			Function: resetCamera

			Makes camera focus the center of the visualization space

			Parameters:

				N/A
					
			Returns:
					
				N/A
		*/
		resetCamera : that.resetCamera
	}
};

// Creates the top level IDEHTViz object and adds a window resize listener to resize IDEHTViz contents
// upon completion of loading of page contents
// document.addEventListener(
// 	  "DOMContentLoaded",
// 	  function() {
// 		var that = this;
// 		that.idehtViz = new IDEHTViz();
// 		that.idehtViz.setupVisualization("idehtVizCanvas");
// 		window.addEventListener("resize", function() { // TODO: Should probably manually resize based on component size for IDEHT application
// 			setTimeout(that.idehtViz.resize.bind(that.idehtViz), 500);
// 		});
// 	  },
// 	  false
// );