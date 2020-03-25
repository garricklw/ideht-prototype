/** 
 * Class: VisualizationDataset
 * This class represents a network dataset that can be visualized in VisualizationSandbox
  */
var VisualizationDataset = (function() {

	this.id; //String

	this.nodes; //[nodeId] = Node		
  
	this.connections; //[connectionId] = Connection

	this.clusters; //[hierarchyLevel][clusterId] = Array(nodeId);
	
	this.getId = function () {
		return this.id;
	};

	this.setId = function (id) {
		this.id = id;
	};

	this.getNodes = function () {
		return this.nodes;
	};

	this.setNodes = function (nodes) {
		this.nodes = nodes;
	};

	this.addNode = function (node) {
		this.nodes[node.getId()] = node;
	};

	this.getNode = function (nodeId) {
		if (nodeId in this.nodes)
		{
			return this.nodes[nodeId];
		} else {
			return null;
		}
	};

	this.removeNode = function (nodeId) {
		delete this.nodes[nodeId];
	};

	this.getConnections = function () {
		return this.connections;
	};

	this.setConnections = function (connections) {
		this.connections = connections;
	};

	this.addConnection = function (connection) {
		this.connections[connection.getId()] = connection;
	};

	this.getConnection = function (connectionId) {
		if (connectionId in this.connections)
		{
			return this.connections[connectionId];
		} else {
			return null;
		}
	};

	this.removeConnection = function (connectionId) {
		delete this.connections[connectionId];
	};

	this.getClusters = function () {
		return this.clusters;
	};

	this.setClusters = function (clusters) {
		this.clusters = clusters;
	};

	VisualizationDataset = function (id, nodes, connections) {
	
		this.id = id; //String
		
		if (nodes != undefined && nodes != null) {
			this.nodes = nodes; //[nodeId] = Node		
		} else {
			this.nodes = {};
		}
	  
		if (connections != undefined && connections != null) {
			this.connections = connections; //[connectionId] = Connection
		} else {
			this.connections = {};
		}

		this.clusters = {};
		
	};

	VisualizationDataset.prototype = {
	
		/* 
			Function: VisualizationDataset

			VisualizationDataset constructor

			Parameters:

				id - a unique dataset ID string
				nodes - a map of Node objects
				connections - a map of Connection objects

			Returns:

				N/A
			  
			See Also:

				<Node>, <Connection>
		*/
		constructor : VisualizationDataset,

		/* 
			Function: getId

			Returns dataset ID string

			Parameters:

				N/A
				
			Returns:

				id - a unique string dataset ID
		*/
		getId : this.getId,
		
		/* 
			Function: setId

			Sets dataset ID string

			Parameters:

				id - a unique string dataset ID
				
			Returns:

				N/A
		*/
		setId : this.setId,

		/* 
			Function: getNodes

			Returns map of nodes in dataset

			Parameters:

				N/A
				
			Returns:

				nodes - map of nodes in dataset
		*/		
		getNodes : this.getNodes,
		
		/* 
			Function: setNodes

			Sets the map of nodes in dataset

			Parameters:

				nodes - map of nodes to set in dataset
				
			Returns:

				N/A
				
			See Also:

				<Node>
		*/
		setNodes : this.setNodes,
		
		/* 
			Function: addNode

			Adds a node to the dataset

			Parameters:

				node - Node object to add
				
			Returns:

				N/A
				
			See Also:

				<Node>
		*/
		addNode : this.addNode,
		
		/* 
			Function: getNode

			Returns the node object with specified ID

			Parameters:

				nodeId - string ID of the node to return
				
			Returns:

				node - node with the nodeId, null if a node with nodeId doesn't exist in this dataset
				
			See Also:

				<Node>
		*/
		getNode : this.getNode,
		
		/* 
			Function: removeNode

			Removes a node with specified ID

			Parameters:

				nodeId - string ID of the node to remove from dataset
				
			Returns:

				N/A
		*/
		removeNode : this.removeNode,
		
		/* 
			Function: getConnections

			Returns map of connections in dataset

			Parameters:

				N/A
				
			Returns:

				connections - map of connections in dataset
			
			See Also:

				<Connection>
		*/		
		getConnections : this.getConnections,
		
		/* 
			Function: setConnections

			Sets the map of connections in dataset

			Parameters:

				connections - map of connections to set in dataset
				
			Returns:

				N/A
				
			See Also:

				<Connection>
		*/
		setConnections : this.setConnections,
		
		/* 
			Function: addConnection

			Adds a connection to the dataset

			Parameters:

				connection - Connection object to add
				
			Returns:

				N/A
				
			See Also:

				<Connection>
		*/
		addConnection : this.addConnection,
		
		/* 
			Function: getConnection

			Returns the connection object with specified ID

			Parameters:

				connectionId - string ID of the connection to return
				
			Returns:

				connection - connection with the connectionId, null if a connection with connectionId doesn't exist in this dataset
				
			See Also:

				<Connection>
		*/
		getConnection : this.getConnection,
		
		/* 
			Function: removeConnection

			Removes the connection object with specified ID

			Parameters:

				connectionId - string ID of the connection to remove
				
			Returns:

				N/A
				
			See Also:

				<Connection>
		*/
		removeConnection : this.removeConnection,
		
		getClusters : this.getClusters,
		setClusters : this.setClusters,
		
	};
	
	return VisualizationDataset;
	
}());

/** 
 * Class: Node
 * This class represents a network node that comprises a VisualizationDataset
  */
var Node = (function () {

	this.id; //String

	this.name; //String

	this.nodeType; //String

	this.getId = function () {
		return this.id;
	};

	this.setId = function (id) {
		this.id = id;
	};

	this.getName = function () {
		return this.name;
	};

	this.setName = function (name) {
		this.name = name;
	};

	this.getNodeType = function () {
		return this.nodeType;
	};

	this.setNodeType = function (nodeType) {
		this.nodeType = nodeType;
	};

	this.getClusterMembership = function () {
		return this.clusterMembership;
	};

	this.setClusterMembership = function (clusterMembership) {
		this.clusterMembership = clusterMembership;
	};

	Node = function (id, name, nodeType) {
	
		this.id = id; //String

		this.name = name; //String

		this.nodeType = nodeType; //String

	};

	Node.prototype = {
	
		/* 
			Function: Node

			Node constructor

			Parameters:

				id - a unique node ID string
				name - a descriptive name string for node
				nodeType - a NodeType object to use as node type

			Returns:

				N/A
			  
			See Also:

				<NodeType>
		*/
		constructor : Node,
		
		/* 
			Function: getId

			Returns node ID string

			Parameters:

				N/A
				
			Returns:

				id - a unique string node ID
		*/
		getId : this.getId,
		
		/* 
			Function: setId

			Sets node ID string

			Parameters:

				id - a unique string node ID
				
			Returns:

				N/A
		*/
		setId : this.setId,
		
		/* 
			Function: getName

			Returns descriptive node name string

			Parameters:

				N/A
				
			Returns:

				name - descriptive node name string
		*/
		getName : this.getName,
		
		/* 
			Function: setName

			Sets descriptive node name string

			Parameters:

				name - descriptive node name string
				
			Returns:

				N/A
		*/
		setName : this.setName,
		
		/* 
			Function: getNodeType

			Returns node type

			Parameters:

				N/A
				
			Returns:

				nodeType - a NodeType object to use as node type
			
			See Also:

				<NodeType>
		*/
		getNodeType : this.getNodeType,
		
		/* 
			Function: setNodeType

			Sets  node type

			Parameters:

				nodeType - a NodeType object to use as node type
				
			Returns:

				N/A

			See Also:

				<NodeType>
		*/
		setNodeType : this.setNodeType,
		
		getClusterMembership : this.getClusterMembership,
		setClusterMembership : this.setClusterMembership,
		
	}
	
	return Node;
	
}());

/** 
 * Class: NodeType
 * This class represents a network node type
  */
var NodeType = (function () {

	this.name; //String

	this.defaultLookAndFeel; //NodeLookAndFeel

	this.getName = function () {
		return this.name;
	};

	this.setName = function (name) {
		this.name = name;
	};

	this.getDefaultLookAndFeel = function () {
		return this.defaultLookAndFeel;
	};

	this.setDefaultLookAndFeel = function (defaultLookAndFeel) {
		this.defaultLookAndFeel = defaultLookAndFeel;
	};

	NodeType = function (name, defaultLookAndFeel) {
	
		this.name = name;

		this.defaultLookAndFeel = defaultLookAndFeel;

	};

	NodeType.prototype = {

		/* 
			Function: NodeType

			Node type constructor

			Parameters:

				name - a unique name string for node type
				defaultLookAndFeel - the default NodeLookAndFeel object to use as node type's look-and-feel

			Returns:

				N/A
			  
			See Also:

				<NodeLookAndFeel>
		*/
		constructor: NodeType,

		/* 
			Function: getName

			Returns unique node type name string

			Parameters:

				N/A
				
			Returns:

				name - unique node type name string
		*/
		getName : this.getName,
		
		/* 
			Function: setName

			Sets unique node type name string

			Parameters:

				name - unique node type name string
				
			Returns:

				N/A
		*/
		setName : this.setName,
		
		/* 
			Function: getDefaultLookAndFeel

			Returns default node type look-and-feel

			Parameters:

				N/A
				
			Returns:

				defaultLookAndFeel - the default NodeLookAndFeel object to use as node type's look-and-feel
				
			See Also:

				<NodeLookAndFeel>
		*/
		getDefaultLookAndFeel : this.getDefaultLookAndFeel,
		
		/* 
			Function: setDefaultLookAndFeel

			Sets default node type look-and-feel

			Parameters:

				defaultLookAndFeel - the default NodeLookAndFeel object to use as node type's look-and-feel
				
			Returns:

				N/A
			
			See Also:

				<NodeLookAndFeel>
		*/
		setDefaultLookAndFeel : this.setDefaultLookAndFeel,

    };

	return NodeType;
	
})();

/** 
 * Class: NodeLookAndFeel
 * This class represents a network node look-and-feel
  */
var NodeLookAndFeel = (function() {

	this.model; //String

	this.color; //int[3]

	this.labelColor; //int[3]

	this.texture; //String

	this.size; //float

	this.transparency; //float

	this.wireframe; //bool

	this.selectionAnimation; //String

	this.metaData; //var
	
	this.clone = function () {
		return new NodeLookAndFeel(this.model, this.color, this.labelColor, this.texture, this.size, this.transparency, this.wireframe, this.selectionAnimation);
	};

	this.getModel = function () {
		return this.model;
	};

	this.setModel = function (model) {
		this.model = model;
	};

	this.getColor = function () {
		return this.color;
	};

	this.setColor = function (color) {
		this.color = color;
	};

	this.getLabelColor = function () {
		return this.labelColor;
	};

	this.setLabelColor = function (labelColor) {
		this.labelColor = labelColor;
	};

	this.getTexture = function () {
		return this.texture;
	};

	this.setTexture = function (texture) {
		this.texture = texture;
	};

	this.getSize = function () {
		return this.size;
	};

	this.setSize = function (size) {
		this.size = size;
	};

	this.getTransparency = function () {
		return this.transparency;
	};

	this.setTransparency = function (transparency) {
		this.transparency = transparency;
	};

	this.getWireframe = function () {
		return this.wireframe;
	};

	this.setWireframe = function (wireframe) {
		this.wireframe = wireframe;
	};

	this.getSelectionAnimation = function () {
		return this.selectionAnimation;
	};

	this.setSelectionAnimation = function (selectionAnimation) {
		this.selectionAnimation = selectionAnimation;
	};

	this.getMetaData = function () {
		return this.metaData;
	};

	this.setMetaData = function (metaData) {
		this.metaData = metaData;
	};

	NodeLookAndFeel = function(model, color, labelColor, texture, size, transparency, wireframe, selectionAnimation, metaData) {
	
		this.model = model; //String

		this.color = color; //int[3]

		this.labelColor = labelColor; //int[3]

		this.texture = texture; //String

		this.size = size; //float

		this.transparency = transparency; //float

		this.wireframe = wireframe; //bool

		this.selectionAnimation = selectionAnimation; //String
		
		this.metaData = metaData;

	};
	
	NodeLookAndFeel.prototype = {
	
		/* 
			Function: NodeLookAndFeel

			Node look and feel constructor

			Parameters:

				model - 3D model name string
				color - integer array of length 3 with each member in range [0 - 255] that represents model color RGB value (i.e. [128, 0, 255])
				texture - texture name string
				size - floating point model size
				transparency - floating point transparency in range [0.0 - 1.0]
				wireframe - "true" or "false" string the defines whether to draw the model as a wireframe
				selectionAnimation - selection animation name string
				
			Returns:

				N/A
		*/
		constructor : NodeLookAndFeel,
		
		/* 
			Function: clone

			Creates and returns a deep copy of this look-and-feel

			Parameters:

				N/A
			
			Returns:

				clone - NodeLookAndFeel object representing a deep copy of this look-and-feel object
		*/
		clone : this.clone,
		
		/* 
			Function: getModel

			Returns look-and-feel 3D model name

			Parameters:

				N/A
			
			Returns:

				model - 3D model name string
		*/
		getModel : this.getModel,
		
		/* 
			Function: setModel

			Sets look-and-feel 3D model name

			Parameters:

				model - 3D model name string

			Returns:

				N/A
		*/
		setModel : this.setModel,
		
		/* 
			Function: getColor

			Returns look-and-feel color

			Parameters:

				N/A
			
			Returns:

				color - integer array of length 3 with each member in range [0 - 255] that represents model color RGB value (i.e. [128, 0, 255])			  
		*/
		getColor : this.getColor,
		
		/* 
			Function: setColor

			Sets look-and-feel color

			Parameters:

				color - integer array of length 3 with each member in range [0 - 255] that represents model color RGB value (i.e. [128, 0, 255])			  

			Returns:

				N/A
		*/
		setColor : this.setColor,
		
		/* 
			Function: getLabelColor

			Returns look-and-feel label color

			Parameters:

				N/A
			
			Returns:

				color - integer array of length 3 with each member in range [0 - 255] that represents model color RGB value (i.e. [128, 0, 255])			  
		*/
		getLabelColor : this.getLabelColor,
		
		/* 
			Function: setLabelColor

			Sets look-and-feel label color

			Parameters:

				color - integer array of length 3 with each member in range [0 - 255] that represents model color RGB value (i.e. [128, 0, 255])			  

			Returns:

				N/A
		*/
		setLabelColor : this.setLabelColor,
		
		/* 
			Function: getTexture

			Returns look-and-feel texture name string

			Parameters:

				name - a unique name string for node type
				defaultLookAndFeel - the default NodeLookAndFeel object to use as node type's look-and-feel

			Returns:

				texture - texture name string
		*/
		getTexture : this.getTexture,
		
		/* 
			Function: setTexture

			Sets look-and-feel texture name string

			Parameters:

				texture - texture name string

			Returns:

				N/A
		*/
		setTexture : this.setTexture,
		
		/* 
			Function: getSize

			Returns look-and-feel size

			Parameters:

				N/A
			
			Returns:

				size - floating point model size
		*/
		getSize : this.getSize,
		
		/* 
			Function: setSize

			Sets look-and-feel size

			Parameters:

				size - floating point model size

			Returns:

				N/A
		*/
		setSize : this.setSize,
		
		/* 
			Function: getTransparency

			Gets look-and-feel transparency

			Parameters:

				N/A
			
			Returns:

				transparency - floating point transparency in range [0.0 - 1.0]
		*/
		getTransparency : this.getTransparency,
		
		/* 
			Function: setTransparency

			Sets look-and-feel transparency

			Parameters:

				transparency - floating point transparency in range [0.0 - 1.0]
			
			Returns:

				N/A
		*/
		setTransparency : this.setTransparency,
		
		/* 
			Function: getWireframe

			Returns whether look-and-feel is set to use wireframe

			Parameters:

				N/A
			
			Returns:

				wireframe - "true" or "false" string the defines whether to draw the model as a wireframe
		*/
		getWireframe : this.getWireframe,
		
		/* 
			Function: setWireframe

			Sets whether look-and-feel is set to use wireframe

			Parameters:

				wireframe - "true" or "false" string the defines whether to draw the model as a wireframe

			Returns:

				N/A
		*/
		setWireframe : this.setWireframe,
		
		/* 
			Function: getSelectionAnimation

			Returns selection animation name string

			Parameters:

				N/A

			Returns:

				selectionAnimation - selection animation name string
			  
			See Also:

				<NodeLookAndFeel>
		*/
		getSelectionAnimation : this.getSelectionAnimation, 
		
		/* 
			Function: setSelectionAnimation

			Sets selection animation name string

			Parameters:

				selectionAnimation - selection animation name string

			Returns:

				N/A
			  
			See Also:

				<NodeLookAndFeel>
		*/
		setSelectionAnimation : this.setSelectionAnimation,
		
		/* 
			Function: getMetaData

			Returns metaData variable (var)

			Parameters:

				N/A

			Returns:

				metaData - metaData variable
		*/
		getMetaData : this.getMetaData, 

		/* 
			Function: setMetaData

			Sets metaData variable

			Parameters:

				metaData - metaData variable

			Returns:

				N/A
		*/
		setMetaData : this.setMetaData,

		
	};
	
	return NodeLookAndFeel;
	
}());

/** 
 * Class: NodeLocation
 * This class represents a network node location
  */
var NodeLocation = (function() {

	this.x; //float
	this.y; //float
	this.z; //float
	this.yaw; //float
	this.pitch; //float
	this.roll; //float

	this.getX = function () {
		return this.x;
	};

	this.setX = function (x) {
		this.x = x;
	};

	this.getY = function () {
		return this.y;
	};

	this.setY = function (y) {
		this.y = y;
	};

	this.getZ = function () {
		return this.z;
	};

	this.setZ = function (z) {
		this.z = z;
	};

	this.getYaw = function () {
		return this.yaw;
	};

	this.setYaw = function (yaw) {
		this.yaw = yaw;
	};

	this.getPitch = function () {
		return this.pitch;
	};

	this.setPitch = function (pitch) {
		this.pitch = pitch;
	};

	this.getRoll = function () {
		return this.roll;
	};

	this.setRoll = function (roll) {
		this.roll = roll;
	};

	NodeLocation = function () {
	
	};
	
	NodeLocation.prototype = { 
	
		constructor : NodeLocation,
		
		getX : this.getX,
		setX : this.setX,
		
		getY : this.getY,
		setY : this.setY,
		
		getZ : this.getZ,
		setZ : this.setZ,
		
		getYaw : this.getYaw,
		setYaw : this.setYaw,
		
		getPitch : this.getPitch,
		setPitch : this.setPitch,
		
		getRoll : this.getRoll,
		setRoll : this.setRoll,
		
	};
	
	return NodeLocation;
	
}());

/** 
 * Class: Connection
 * This class represents a network connection that comprises a VisualizationDataset
  */
var Connection = (function () {

	this.id; //String

	this.name; //String

	this.sourceId; //String

	this.targetId; //String

	this.connectionType; //String
	
	this.weight; //float

	this.getId = function () {
		return this.id;
	};

	this.setId = function (id) {
		this.id = id;
	};

	this.getName = function () {
		return this.name;
	};

	this.setName = function (name) {
		this.name = name;
	};

	this.getSourceId = function () {
		return this.sourceId;
	};

	this.setSourceId = function (sourceId) {
		this.sourceId = sourceId;
	};

	this.getTargetId = function () {
		return this.targetId;
	};

	this.setTargetId = function (targetId) {
		this.targetId = targetId;
	};

	this.getBidirectional = function () {
		return this.bidirectional;
	};

	this.setBidirectional = function (bidirectional) {
		this.bidirectional = bidirectional;
	};

	this.getConnectionType = function () {
		return this.connectionType;
	};

	this.setConnectionType = function (connectionType) {
		this.connectionType = connectionType;
	};
	
	this.getWeight = function () {
		return this.weight;
	};

	this.setWeight = function (weight) {
		this.weight = weight;
	};

	Connection = function (id, name, sourceId, targetId, bidirectional, connectionType, weight) {
	
		this.id = id; //String

		this.name = name; //String

		this.sourceId = sourceId; //String

		this.targetId = targetId; //String

		this.bidirectional = bidirectional; //bool

		this.connectionType = connectionType; //String

		this.weight = weight; //float
		
	};

	Connection.prototype = {
	
		/* 
			Function: Connection

			Connection constructor

			Parameters:

				id - a unique connection ID string
				name - a descriptive name string for connection
				sourceId - the unique source node ID string
				targetId - the unique target node ID string
				bidirectional - boolean value (TRUE or FALSE) representing whether the connection is bidirectional or unidirectional
				connectionType - a ConnectionType object to use as connection type

			Returns:

				N/A
			  
			See Also:

				<ConnectionType>
		*/
		constructor : Connection,
		
		/* 
			Function: getId

			Returns connection ID string

			Parameters:

				N/A
				
			Returns:

				id - a unique string connection ID
		*/
		getId : this.getId,
		
		/* 
			Function: setId

			Sets connection ID string

			Parameters:

				id - a unique string connection ID
				
			Returns:

				N/A
		*/
		setId : this.setId,
		
		/* 
			Function: getWeight

			Returns connection weight used for layouting purposes

			Parameters:

				N/A
				
			Returns:

				weight - connection weight value
		*/
		getWeight : this.getWeight,
		
		/* 
			Function: setWeight

			Sets connection weight used for layouting purposes

			Parameters:

				weight - connection weight value
				
			Returns:

				N/A
		*/
		setWeight : this.setWeight,
		
		/* 
			Function: getName

			Returns descriptive connection name string

			Parameters:

				N/A
				
			Returns:

				name - descriptive connection name string
		*/
		getName : this.getName,
		
		/* 
			Function: setName

			Sets descriptive connection name string

			Parameters:

				name - descriptive connection name string
				
			Returns:

				N/A
		*/
		setName : this.setName,
		
		/* 
			Function: getConnectionType

			Returns connection type

			Parameters:

				N/A
				
			Returns:

				connectionType - a ConnectionType object to use as connection type
			
			See Also:

				<ConnectionType>
		*/
		getConnectionType : this.getConnectionType,
		
		/* 
			Function: setConnectionType

			Sets  connection type

			Parameters:

				connectionType - a ConnectionType object to use as connection type
				
			Returns:

				N/A

			See Also:

				<ConnectionType>
		*/
		setConnectionType : this.setConnectionType,
				
		/* 
			Function: getSourceId

			Returns source node ID

			Parameters:

				N/A
				
			Returns:

				sourceId - the unique source node ID string
		*/
		getSourceId : this.getSourceId,
		
		/* 
			Function: setSourceId

			Sets source node ID

			Parameters:

				sourceId - the unique source node ID string
				
			Returns:

				N/A
		*/
		setSourceId : this.setSourceId,

		/* 
			Function: getTargetId

			Returns target node ID

			Parameters:

				N/A
				
			Returns:

				targetId - the unique target node ID string
		*/
		getTargetId : this.getTargetId,
		
		/* 
			Function: setTargetId

			Sets target node ID

			Parameters:

				targetId - the unique target node ID string
				
			Returns:

				N/A
		*/
		setTargetId : this.setTargetId,
		
		/* 
			Function: getBidirectional

			Returns whether connection represents a bidirectional connection

			Parameters:

				N/A
				
			Returns:

				isBidirectional - "true" or "false" string representing whether connection represents a bidirectional connection
		*/
		getBidirectional : this.getBidirectional,
		
		/* 
			Function: setBidirectional

			Sets whether connection represents a bidirectional connection

			Parameters:

			isBidirectional - "true" or "false" string representing whether connection represents a bidirectional connection
				
			Returns:

				N/A
		*/
		setBidirectional : this.setBidirectional,
		
	};
	
	return Connection;

}());

/** 
 * Class: ConnectionType
 * This class represents a network connection type
  */
var ConnectionType = (function () {

	this.name; //String

	this.defaultLookAndFeel; //ConnectionLookAndFeel

	this.getName = function () {
		return this.name;
	};

	this.setName = function (name) {
		this.name = name;
	};

	this.getDefaultLookAndFeel = function () {
		return this.defaultLookAndFeel;
	};

	this.setDefaultLookAndFeel = function (defaultLookAndFeel) {
		this.defaultLookAndFeel = defaultLookAndFeel;
	};

	ConnectionType = function (name, defaultLookAndFeel) {
	
		this.name = name; //String

		this.defaultLookAndFeel = defaultLookAndFeel; //ConnectionLookAndFeel

	};

	ConnectionType.prototype = {
	
		/* 
			Function: ConnectionType

			Connection type constructor

			Parameters:

				name - a unique name string for connection type
				defaultLookAndFeel - the default ConnectionLookAndFeel object to use as connection type's look-and-feel

			Returns:

				N/A
			  
			See Also:

				<ConnectionLookAndFeel>
		*/
		constructor: ConnectionType,

		/* 
			Function: getName

			Returns unique connection type name string

			Parameters:

				N/A
				
			Returns:

				name - unique connection type name string
		*/
		getName : this.getName,
		
		/* 
			Function: setName

			Sets unique connection type name string

			Parameters:

				name - unique connection type name string
				
			Returns:

				N/A
		*/
		setName : this.setName,
		
		/* 
			Function: getDefaultLookAndFeel

			Returns default connection type look-and-feel

			Parameters:

				N/A
				
			Returns:

				defaultLookAndFeel - the default ConnectionLookAndFeel object to use as connection type's look-and-feel
				
			See Also:

				<ConnectionLookAndFeel>
		*/
		getDefaultLookAndFeel : this.getDefaultLookAndFeel,
		
		/* 
			Function: setDefaultLookAndFeel

			Sets default connection type look-and-feel

			Parameters:

				defaultLookAndFeel - the default ConnectionLookAndFeel object to use as connection type's look-and-feel
				
			Returns:

				N/A
			
			See Also:

				<ConnectionLookAndFeel>
		*/
		setDefaultLookAndFeel : this.setDefaultLookAndFeel,
						
		/* 
			Function: getWeight

			Returns connection weight

			Parameters:

				N/A
				
			Returns:

				connectionWeight - weight of connection
		*/
		getWeight : this.getWeight,
		
		/* 
			Function: setWeight

			Sets connection weight

			Parameters:

				connectionWeight - weight of connection
				
			Returns:

				N/A
		*/
		setWeight : this.setWeight,

	};
	
	return ConnectionType;

}());

/** 
 * Class: ConnectionLookAndFeel
 * This class represents a network connection look-and-feel
  */
var ConnectionLookAndFeel = (function() {

	this.model; //String

	this.componentLookAndFeel; //NodeLookAndFeel
	
	this.color; //int[3]

	this.labelColor; //int[3]

	this.texture; //String

	this.size; //float

	this.transparency; //float

	this.wireframe; //bool

	this.selectionAnimation; //String

	this.clone = function () {
		return new ConnectionLookAndFeel(this.model, this.componentLookAndFeel.clone(), this.texture, this.color, this.labelColor, this.size, this.transparency, this.wireframe, this.selectionAnimation);
	};

	this.getModel = function () {
		return this.model;
	};

	this.setModel = function (model) {
		this.model = model;
	};

	this.getComponentLookAndFeel = function () {
		return this.componentLookAndFeel;
	};

	this.setComponentLookAndFeel = function (componentLookAndFeel) {
		this.componentLookAndFeel = componentLookAndFeel;
	};

	this.getColor = function () {
		return this.color;
	};

	this.setColor = function (color) {
		this.color = color;
	};

	this.getLabelColor = function () {
		return this.labelColor;
	};

	this.setLabelColor = function (labelColor) {
		this.labelColor = labelColor;
	};
	
	this.getTexture = function () {
		return this.texture;
	};

	this.setTexture = function (texture) {
		this.texture = texture;
	};

	this.getSize = function () {
		return this.size;
	};

	this.setSize = function (size) {
		this.size = size;
	};

	this.getTransparency = function () {
		return this.transparency;
	};

	this.setTransparency = function (transparency) {
		this.transparency = transparency;
	};

	this.getWireframe = function () {
		return this.wireframe;
	};

	this.setWireframe = function (wireframe) {
		this.wireframe = wireframe;
	};

	this.getSelectionAnimation = function () {
		return this.selectionAnimation;
	};

	this.setSelectionAnimation = function (selectionAnimation) {
		this.selectionAnimation = selectionAnimation;
	};

	ConnectionLookAndFeel = function (model, componentLookAndFeel, texture, color, labelColor, size, transparency, wireframe, selectionAnimation) {
	
		this.model = model; //String

		this.componentLookAndFeel = componentLookAndFeel; //NodeLookAndFeel
		
		this.color = color; //int[3]

		this.labelColor = labelColor; //int[3]

		this.texture = texture; //String

		this.size = size; //float

		this.transparency = transparency; //float

		this.wireframe = wireframe; //bool

		this.selectionAnimation = selectionAnimation; //String

	};

	ConnectionLookAndFeel.prototype = {
			
		/* 
			Function: ConnectionLookAndFeel

			Connection look and feel constructor

			Parameters:

				model - 3D model name string
				componentLookAndFeel - 3D model name for the connection component
				color - integer array of length 3 with each member in range [0 - 255] that represents model color RGB value (i.e. [128, 0, 255])
				texture - texture name string
				size - floating point model size
				transparency - floating point transparency in range [0.0 - 1.0]
				wireframe - "true" or "false" string the defines whether to draw the model as a wireframe
				selectionAnimation - selection animation name string
				
			Returns:

				N/A
		*/
		constructor : ConnectionLookAndFeel,
		
		/* 
			Function: clone

			Creates and returns a deep copy of this look-and-feel

			Parameters:

				N/A
			
			Returns:

				clone - ConnectionLookAndFeel object representing a deep copy of this look-and-feel object
		*/
		clone : this.clone,
		
		/* 
			Function: getModel

			Returns look-and-feel 3D model name

			Parameters:

				N/A
			
			Returns:

				model - 3D model name string
		*/
		getModel : this.getModel,
		
		/* 
			Function: setModel

			Sets look-and-feel 3D model name

			Parameters:

				model - 3D model name string

			Returns:

				N/A
		*/
		setModel : this.setModel,
		
		/* 
			Function: getColor

			Returns look-and-feel color

			Parameters:

				N/A
			
			Returns:

				color - integer array of length 3 with each member in range [0 - 255] that represents model color RGB value (i.e. [128, 0, 255])			  
		*/
		getColor : this.getColor,
		
		/* 
			Function: setColor

			Sets look-and-feel color

			Parameters:

				color - integer array of length 3 with each member in range [0 - 255] that represents model color RGB value (i.e. [128, 0, 255])			  

			Returns:

				N/A
		*/
		setColor : this.setColor,
		
		/* 
			Function: getLabelColor

			Returns look-and-feel label color

			Parameters:

				N/A
			
			Returns:

				color - integer array of length 3 with each member in range [0 - 255] that represents model color RGB value (i.e. [128, 0, 255])			  
		*/
		getLabelColor : this.getLabelColor,
		
		/* 
			Function: setLabelColor

			Sets look-and-feel label color

			Parameters:

				color - integer array of length 3 with each member in range [0 - 255] that represents model color RGB value (i.e. [128, 0, 255])			  

			Returns:

				N/A
		*/
		setLabelColor : this.setLabelColor,
		
		/* 
			Function: getTexture

			Returns look-and-feel texture name string

			Parameters:

				name - a unique name string for node type
				defaultLookAndFeel - the default NodeLookAndFeel object to use as node type's look-and-feel

			Returns:

				texture - texture name string
		*/
		getTexture : this.getTexture,
		
		/* 
			Function: setTexture

			Sets look-and-feel texture name string

			Parameters:

				texture - texture name string

			Returns:

				N/A
		*/
		setTexture : this.setTexture,
		
		/* 
			Function: getSize

			Returns look-and-feel size

			Parameters:

				N/A
			
			Returns:

				size - floating point model size
		*/
		getSize : this.getSize,
		
		/* 
			Function: setSize

			Sets look-and-feel size

			Parameters:

				size - floating point model size

			Returns:

				N/A
		*/
		setSize : this.setSize,
		
		/* 
			Function: getTransparency

			Gets look-and-feel transparency

			Parameters:

				N/A
			
			Returns:

				transparency - floating point transparency in range [0.0 - 1.0]
		*/
		getTransparency : this.getTransparency,
		
		/* 
			Function: setTransparency

			Sets look-and-feel transparency

			Parameters:

				transparency - floating point transparency in range [0.0 - 1.0]
			
			Returns:

				N/A
		*/
		setTransparency : this.setTransparency,
		
		/* 
			Function: getWireframe

			Returns whether look-and-feel is set to use wireframe

			Parameters:

				N/A
			
			Returns:

				wireframe - "true" or "false" string the defines whether to draw the model as a wireframe
		*/
		getWireframe : this.getWireframe,
		
		/* 
			Function: setWireframe

			Sets whether look-and-feel is set to use wireframe

			Parameters:

				wireframe - "true" or "false" string the defines whether to draw the model as a wireframe

			Returns:

				N/A
		*/
		setWireframe : this.setWireframe,
		
		/* 
			Function: NodeType

			Returns selection animation name string

			Parameters:

				N/A

			Returns:

				selectionAnimation - selection animation name string
			  
			See Also:

				<NodeLookAndFeel>
		*/
		getSelectionAnimation : this.getSelectionAnimation, 
		
		/* 
			Function: NodeType

			Sets selection animation name string

			Parameters:

				selectionAnimation - selection animation name string

			Returns:

				N/A
			  
			See Also:

				<NodeLookAndFeel>
		*/
		setSelectionAnimation : this.setSelectionAnimation,
		
		/* 
			Function: NodeType

			Returns 3D model name for the connection component

			Parameters:

				N/A

			Returns:

				componentLookAndFeel - 3D model name for the connection component
			  
			See Also:

				<NodeLookAndFeel>
		*/
		getComponentLookAndFeel : this.getComponentLookAndFeel,
		
		/* 
			Function: NodeType

			Sets 3D model name for the connection component

			Parameters:

				componentLookAndFeel - 3D model name for the connection component

			Returns:

				N/A
			  
			See Also:

				<NodeLookAndFeel>
		*/
		setComponentLookAndFeel : this.setComponentLookAndFeel,
	};
	
	return ConnectionLookAndFeel;

}());

/** 
 * Class: CameraSetup
 * This class represents a VisualizationSandbox camera position and target
  */
var CameraSetup = (function () {
	
	this.x; //float
	this.y; //float
	this.z; //float
	
	this.targetX; //float
	this.targetY; //float
	this.targetZ; //float
		
	this.getX = function () {
		return this.x;
	};

	this.setX = function (x) {
		this.x = x;
	};

	this.getY = function () {
		return this.y;
	};

	this.setY = function (y) {
		this.y = y;
	};

	this.getZ = function () {
		return this.z;
	};

	this.setZ = function (z) {
		this.z = z;
	};

	this.getTargetX = function () {
		return this.yaw;
	};

	this.setTargetX = function (targetX) {
		this.targetX = targetX;
	};

	this.getTargetY = function () {
		return this.targetX;
	};

	this.setTargetY = function (targetY) {
		this.targetY = targetY;
	};

	this.getTargetZ = function () {
		return this.targetZ;
	};

	this.setTargetZ = function (targetZ) {
		this.targetZ = targetZ;
	};
		
	this.getZoom = function () {
		return this.zoom;
	};

	this.setZoom = function (zoom) {
		this.zoom = zoom;
	};

	CameraSetup = function (x, y, z, targetX, targetY, targetZ, zoom) {
	
		this.x = x; //float
		this.y = y; //float
		this.z = z; //float
		
		this.targetX = targetX; //float
		this.targetY = targetY; //float
		this.targetZ = targetZ; //float			

		this.zoom = zoom; //float
		
	};
	
	CameraSetup.prototype = { 
				
		/* 
			Function: CameraSetup

			Camera setup constructor

			Parameters:

				x - X axis position of camera
				y - Y axis position of camera
				z - Z axis position of camera
				targetX - X axis position of camera focus
				targetY - Y axis position of camera focus
				targetZ - Z axis position of camera focus
				zoom - camera zoom
				
			Returns:

				N/A
		*/
		constructor : CameraSetup,
		
		/* 
			Function: getX

			Returns X axis position of camera

			Parameters:

				N/A

			Returns:

				x - X axis position of camera
		*/
		getX : this.getX,
		
		/* 
			Function: setX

			Sets X axis position of camera

			Parameters:

				x - X axis position of camera

			Returns:

				N/A
		*/
		setX : this.setX,
		
		/* 
			Function: getY

			Returns Y axis position of camera

			Parameters:

				N/A

			Returns:

				y - Y axis position of camera
		*/
		getY : this.getY,
		
		/* 
			Function: setY

			Sets Y axis position of camera

			Parameters:

				y - Y axis position of camera

			Returns:

				N/A
		*/
		setY : this.setY,
		
		/* 
			Function: getZ

			Returns Z axis position of camera

			Parameters:

				N/A

			Returns:

				z - Z axis position of camera
		*/
		getZ : this.getZ,
		
		/* 
			Function: setZ

			Sets Z axis position of camera

			Parameters:

				z - Z axis position of camera

			Returns:

				N/A
		*/
		setZ : this.setZ,
		
		/* 
			Function: getTargetX

			Returns X axis position of camera focus

			Parameters:

				N/A

			Returns:

				targetX - X axis position of camera focus
		*/
		getTargetX : this.getTargetX,
		
		/* 
			Function: setTargetX

			Sets X axis position of camera focus

			Parameters:

				targetX - X axis position of camera focus

			Returns:

				N/A
		*/
		setTargetX : this.setTargetX,
		
		/* 
			Function: getTargetY

			Returns Y axis position of camera focus

			Parameters:

				N/A

			Returns:

				targetY - Y axis position of camera focus
		*/
		getTargetY : this.getTargetY,
		
		/* 
			Function: setTargetY

			Sets Y axis position of camera focus

			Parameters:

				targetY - Y axis position of camera focus

			Returns:

				N/A
		*/
		setTargetY : this.setTargetY,
		
		
		/* 
			Function: getTargetZ

			Returns Z axis position of camera focus

			Parameters:

				N/A

			Returns:

				targetZ - Z axis position of camera focus
		*/
		getTargetZ : this.getTargetZ,
		
		/* 
			Function: setTargetZ

			Sets Z axis position of camera focus

			Parameters:

				targetZ - Z axis position of camera focus

			Returns:

				N/A
		*/
		setTargetZ : this.setTargetZ,
		
		/* 
			Function: getZoom

			Returns camera zoom

			Parameters:

				N/A

			Returns:

				zoom - camera zoom
		*/
		getZoom : this.getZoom,
		
		/* 
			Function: setZoom

			Sets camera zoom

			Parameters:

				zoom - camera zoom

			Returns:

				N/A
		*/
		setZoom : this.setZoom,
		
	};
	
	return CameraSetup;
	
}());

