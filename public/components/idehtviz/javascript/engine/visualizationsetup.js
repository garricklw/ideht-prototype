/** 
 * Class: VisualizationSetup
 * This class represents visualization environment settings, such as lighting, shadows, background objects, etc.
  */
var VisualizationSetup = (function () { 
		
	this.id;
	
	this.backgroundColor; //int[4]
	
	this.lights; //[lightId] = Light
	
	this.backgroundObjects; //[nodeId] = Node
	
	this.hudSetup; //HUDSetup

	this.showNodeLabels; //bool
	
	this.showConnectionLabels; //bool

	this.showShadows;
	
	this.fogIntensity;
		
	this.getDefault = function () {
	
		return new VisualizationSetup("Default", new Array(230, 230, 230, 1), {
//										"Default_point0" : new Light("Default_point0", 0.0, 0.0, 0.0, null, null, null, new Array(255, 255, 255), 1.0, "point"),
//										"Default_point1" : new Light("Default_point1", 200.0, 200.0, 200.0, null, null, null, new Array(255, 255, 255), 1.0, "point"), 
//										"Default_point2" : new Light("Default_point2", 200.0, 200.0, -200.0, null, null, null, new Array(255, 255, 255), 1.0, "point"),
//										"Default_point3" : new Light("Default_point3", 200.0, -200.0, 200.0, null, null, null, new Array(255, 255, 255), 1.0, "point"), 
//										"Default_point4" : new Light("Default_point4", 200.0, -200.0, -200.0, null, null, null, new Array(255, 255, 255), 1.0, "point"),
//										"Default_point5" : new Light("Default_point5", -200.0, 200.0, 200.0, null, null, null, new Array(255, 255, 255), 1.0, "point"),
//										"Default_point6" : new Light("Default_point6", -200.0, 200.0, -200.0, null, null, null, new Array(255, 255, 255), 1.0, "point"),
//										"Default_point7" : new Light("Default_point7", -200.0, -200.0, 200.0, null, null, null, new Array(255, 255, 255), 1.0, "point"),
//										"Default_point8" : new Light("Default_point8", -200.0, -200.0, -200.0, null, null, null, new Array(255, 255, 255), 1.0, "point"),
										"Default_Ambient" : new Light("Default_Ambient", null, null, null, null, null, null, new Array(128, 128, 128), null, "ambient"),
										"Default_Directional1" : new Light("Default_Directional1", 100, 100, 100, Math.PI/2, Math.PI/2, Math.PI/2, new Array(255, 255, 255), 0.35, "directional"),
										"Default_Directional2" : new Light("Default_Directional2", -100, 100, 100, -Math.PI/2, Math.PI/2, Math.PI/2, new Array(255, 255, 255), 0.35, "directional"),
										"Default_Directional3" : new Light("Default_Directional3", 100, -100, -100, Math.PI/2, -Math.PI/2, -Math.PI/2, new Array(255, 255, 255), 0.35, "directional"),
										"Default_Directional4" : new Light("Default_Directional4", -100, 100, -100, -Math.PI/2, Math.PI/2, -Math.PI/2, new Array(255, 255, 255), 0.35, "directional"),
										"Default_Directional5" : new Light("Default_Directional5", -0, -500, -0, Math.PI, 0, 0, new Array(255, 255, 255), 0.15, "directional"),
//										"Default_Directional" : new Light("Default_Directional", 100, 100, 100, Math.PI/2, Math.PI/2, Math.PI/2, new Array(255, 255, 255), 1.0, "directional"),
//										"Default_Spot" : new Light("Default_Spot", 100, 100, 100, Math.PI/2, Math.PI/2, Math.PI/2, new Array(255, 255, 255), 1.0, "spot")
								  	}, 
									0.0,
									{
//								  		"DefaultCube" : new Node("DefaultCube", "GlobalCube", "HugeCube"), 
//								  		"DefaultGrid" : new Node("Default_Grid", "GlobalGrid", "Axes"), 
//								  		"DefaultPlanes" : new Node("DefaultPlanes", "GlobalPlanes", "Planes"), 
//								  		"Default3DSurface" : new Node("Default3DSurface", "Global3DSurface", "3DSurface")
								  	}, 
									null, //TODO: Implement a default HUDSetup
									1, 
									0, 
									false);					  
	
	};

	this.getId = function () {
		return this.id;
	};

	this.setId = function (id) {
		this.id = id;
	};

	this.getBackgroundColor = function () {
		return this.backgroundColor;
	};

	this.setBackgroundColor = function (backgroundColor) {
		this.backgroundColor = backgroundColor;
	};

	this.getLights = function () {
		return this.lights;
	};

	this.setLights = function (lights) {
		this.lights = lights;
	};

	this.getFogIntensity = function () {
		return this.fogIntensity;
	};

	this.setFogIntensity = function (fogIntensity) {
		this.fogIntensity = fogIntensity;
	};

	this.getBackgroundObjects = function () {
		return this.backgroundObjects;
	};

	this.setBackgroundObjects = function (backgroundObjects) {
		this.backgroundObjects = backgroundObjects;
	};

	this.getHudSetup = function () {
		return this.hudSetup;
	};

	this.setHudSetup = function (hudSetup) {
		this.hudSetup = hudSetup;
	};

	this.getShowNodeLabels = function () {
		return this.showNodeLabels;
	};

	this.setShowNodeLabels = function (showNodeLabels) {
		this.showNodeLabels = showNodeLabels;
	};

	this.getShowConnectionLabels = function () {
		return this.showConnectionLabels;
	};

	this.setShowConnectionLabels = function (showConnectionLabels) {
		this.showConnectionLabels = showConnectionLabels;
	};

	this.getShowShadows = function () {
		return this.showShadows;
	};

	this.setShowShadows = function (showShadows) {
		this.showShadows = showShadows;
	};

	VisualizationSetup = function (id, backgroundColor, lights, fogIntensity, backgroundObjects, hudSetup, showNodeLabels, showConnectionLabels, showShadows) {
	
		this.id = id;
		
		this.backgroundColor = backgroundColor; //int[4]
		
		this.lights = lights; //[lightId] = Light
		
		this.backgroundObjects = backgroundObjects; //[nodeId] = Node
		
		this.hudSetup = hudSetup; //HUDSetup

		this.showNodeLabels = showNodeLabels; //int
		
		this.showConnectionLabels = showConnectionLabels; //int

		this.showShadows = showShadows;
		
		this.fogIntensity = fogIntensity;
	
	};

	VisualizationSetup.prototype = {
	
		/* 
			Function: VisualizationSetup

			Visualization setup constructor

			Parameters:

				id - unique ID string for visualization setup
				backgroundColor - number array of length 4 with first 3 members in range [0 - 255] that represents model color RGB value and
											last value being a float in range [0.0 - 1.0] that represents transparency of canvas background
				lights - map of Light objects
				backgroundObjects - a map of background objects of Node type
				hudSetup - a HUDSetup object representing HUD settings
				showNodeLabels - "true" or "false" value representing whether to show node labels
				showConnectionLabels - "true" or "false" value representing whether to show connection labels
				showShadows - "true" or "false" value representing whether to show object shadows
				fogIntensity - a floating point value defining power of fog effect
				
			Returns:

				N/A
				
			See Also:

				<Light>, <HUDSetup>
		*/
		constructor : VisualizationSetup,

		/* 
			Function: getId

			Returns unique visualization setup id string

			Parameters:

				N/A
			
			Returns:

				id - unique ID string for visualization setup
		*/
		getId : this.getId,
		
		/* 
			Function: setId

			Sets unique visualization setup id string

			Parameters:

				id - unique ID string for visualization setup

			Returns:

				N/A
		*/
		setId : this.setId,
	
		/* 
			Function: getBackgroundColor

			Returns background color

			Parameters:

				N/A
			
			Returns:

				backgroundColor - number array of length 4 with first 3 members in range [0 - 255] that represents model color RGB value and
											last value being a float in range [0.0 - 1.0] that represents transparency of canvas background
		*/
		getBackgroundColor : this.getBackgroundColor,
		
		/* 
			Function: setBackgroundColor

			Sets background color

			Parameters:

				backgroundColor - number array of length 4 with first 3 members in range [0 - 255] that represents model color RGB value and
											last value being a float in range [0.0 - 1.0] that represents transparency of canvas background

			Returns:

				N/A
		*/
		setBackgroundColor : this.setBackgroundColor,
		
		/* 
			Function: getLights

			Returns lights

			Parameters:

				N/A
			
			Returns:

				lights - map of Light objects
		*/
		getLights : this.getLights,
		
		/* 
			Function: setLights

			Sets lights

			Parameters:

				lights - map of Light objects

			Returns:

				N/A
		*/
		setLights : this.setLights,
		
		/* 
			Function: getFogIntensity

			Returns fog intensity

			Parameters:

				N/A
			
			Returns:

				fogIntensity - a floating point value defining power of fog effect
		*/
		getFogIntensity : this.getFogIntensity,
		
		/* 
			Function: setFogIntensity

			Sets fog intensity

			Parameters:

				fogIntensity - a floating point value defining power of fog effect

			Returns:

				N/A
		*/
		setFogIntensity : this.setFogIntensity,

		/* 
			Function: getBackgroundObjects

			Returns background objects

			Parameters:

				N/A
			
			Returns:

				backgroundObjects - a map of background objects of Node type
		*/
		getBackgroundObjects : this.getBackgroundObjects,
		
		/* 
			Function: setBackgroundObjects

			Sets background objects

			Parameters:

				backgroundObjects - a map of background objects of Node type

			Returns:

				N/A
		*/
		setBackgroundObjects : this.setBackgroundObjects,
		
		/* 
			Function: getHudSetup

			Returns HUD setup

			Parameters:

				N/A
			
			Returns:

				hudSetup - a HUDSetup object representing HUD settings
		*/
		getHudSetup : this.getHudSetup,
		
		/* 
			Function: setHudSetup

			Sets HUD setup

			Parameters:

				hudSetup - a HUDSetup object representing HUD settings

			Returns:

				N/A
		*/
		setHudSetup : this.setHudSetup,
		
		/* 
			Function: getShowNodeLabels

			Returns whether to show node labels

			Parameters:

				N/A
			
			Returns:

				showNodeLabels - "true" or "false" value representing whether to show node labels
		*/
		getShowNodeLabels : this.getShowNodeLabels,
		
		/* 
			Function: setShowNodeLabels

			Sets whether to show node labels

			Parameters:

				showNodeLabels - "true" or "false" value representing whether to show node labels

			Returns:

				N/A
		*/
		setShowNodeLabels : this.setShowNodeLabels,

		/* 
			Function: getShowConnectionLabels

			Returns whether to show connection labels

			Parameters:

				N/A
			
			Returns:

				showConnectionLabels - "true" or "false" value representing whether to show connection labels
		*/
		getShowConnectionLabels : this.getShowConnectionLabels,
		
		/* 
			Function: setShowConnectionLabels

			Sets whether to show connection labels

			Parameters:

				showConnectionLabels - "true" or "false" value representing whether to show connection labels

			Returns:

				N/A
		*/
		setShowConnectionLabels : this.setShowConnectionLabels,
		
		/* 
			Function: getShowShadows

			Returns whether to show object shadows

			Parameters:

				N/A
			
			Returns:

				showShadows - "true" or "false" value representing whether to show object shadows
		*/
		getShowShadows : this.getShowShadows,
		
		/* 
			Function: setShowShadows

			Sets whether to show object shadows

			Parameters:

				showShadows - "true" or "false" value representing whether to show object shadows

			Returns:

				N/A
		*/
		setShowShadows : this.setShowShadows,

		/* 
			Function: getDefault

			Returns a default visualization setup object

			Parameters:

				N/A
			
			Returns:

				defaultVisualizationSetup - a default VisualizationSetup object
		*/
		getDefault : this.getDefault,
		
	};
	
	return VisualizationSetup;
	
}());

/** 
 * Class: VisualizationStyle
 * This class represents a visualization style used to style members of a network dataset
  */
var VisualizationStyle = (function () {

	this.id; //String
	
	this.nodeTypeLookAndFeel; //node type id to NodeLookAndFeel mapping
	this.connectionTypeLookAndFeel; //connection type id to ConnectionLookAndFeel mapping

	this.nodeLookAndFeel; //node id to NodeLookAndFeel mapping
	this.connectionLookAndFeel; //connection id to ConnectionLookAndFeel mapping

	this.layouts; //[layoutId]=Layout
	
	this.getDefault = function () {
		return new VisualizationStyle("Default_Style", {"Random" : new RandomLayout(50.0), 
																			   "Force_Directed" : new ForceDirectedLayout(50.0)});					  
	};

	this.getId = function () {
		return this.id;
	};

	this.setId = function (id) {
		this.id = id;
	};

	this.getDatasetId = function () {
		return this.datasetId;
	};

	this.setDatasetId = function (datasetId) {
		this.datasetId = datasetId;
	};

	this.getNodeLookAndFeel = function (nodeId, nodeType) {
		
		var lookAndFeel = this.nodeLookAndFeel[nodeId];
		if (lookAndFeel == undefined || lookAndFeel == null) {
			lookAndFeel = this.nodeTypeLookAndFeel[nodeType];
		}
		return lookAndFeel;
		
	};

	this.getConnectionLookAndFeel = function (connectionId, connectionType) {

		var lookAndFeel = this.connectionLookAndFeel[connectionId];
		if (lookAndFeel == undefined || lookAndFeel == null) {
			lookAndFeel = this.connectionTypeLookAndFeel[connectionType];
		}
		return lookAndFeel;

	};

	this.setNodeLookAndFeel = function (nodeId, lookAndFeel) {
		this.nodeLookAndFeel[nodeId] = lookAndFeel;
	};

	this.setConnectionLookAndFeel = function (connectionId, lookAndFeel) {
		this.connectionLookAndFeel[connectionId] = lookAndFeel;
	};

	this.setNodeTypeLookAndFeel = function (nodeType, lookAndFeel) {
		this.nodeTypeLookAndFeel[nodeType] = lookAndFeel;
	};

	this.setConnectionTypeLookAndFeel = function (connectionType, lookAndFeel) {
		this.connectionTypeLookAndFeel[connectionType] = lookAndFeel;
	};

	this.removeNodeTypeLookAndFeel = function (nodeType) {
		if (this.nodeTypeLookAndFeel[nodeType] != undefined) {
			delete this.nodeTypeLookAndFeel.nodeType;
		}
	};

	this.removeConnectionTypeLookAndFeel = function (connectionType, lookAndFeel) {
		if (this.connectionTypeLookAndFeel[connectionType] != undefined) {
			delete this.connectionTypeLookAndFeel.connectionType;
		}
	};

	this.getNodeTypeLookAndFeels = function () {
		return this.nodeTypeLookAndFeel;
	};

	this.setNodeTypeLookAndFeels = function (nodeTypeToLookAndFeel) {
		this.nodeTypeLookAndFeel = nodeTypeToLookAndFeel;
	};

	this.getConnectionTypeLookAndFeels = function () {
		return this.connectionTypeLookAndFeel;
	};

	this.setConnectionTypeLookAndFeels = function (connectionTypeToLookAndFeel) {
		this.connectionTypeLookAndFeel = connectionTypeToLookAndFeel;
	};

	this.getNodeLookAndFeels = function () {
		return this.nodeLookAndFeel;
	};

	this.setNodeLookAndFeels = function (nodeLookAndFeel) {
		this.nodeLookAndFeel = nodeLookAndFeel;
	};

	this.getConnectionLookAndFeels = function () {
		return this.connectionLookAndFeel;
	};

	this.setConnectionLookAndFeels = function (connectionLookAndFeel) {
		this.connectionLookAndFeel = connectionLookAndFeel;
	};

	this.getLayouts = function () {
		return this.layouts;
	};

	this.setLayouts = function (layouts) {
		this.layouts = layouts;
	};

	VisualizationStyle = function (id, layouts) {
	
		this.id = id; //String
		
		this.nodeTypeLookAndFeel = {}; //node type id to NodeLookAndFeel mapping
		this.connectionTypeLookAndFeel = {}; //connection type id to ConnectionLookAndFeel mapping

		this.nodeLookAndFeel = {}; //node id to NodeLookAndFeel mapping
		this.connectionLookAndFeel = {}; //connection id to ConnectionLookAndFeel mapping

		this.layouts = layouts; //[layoutId]=Layout
	
	};

	VisualizationStyle.prototype = {
	
		/* 
			Function: VisualizationStyle

			Visualization style constructor

			Parameters:

				id - unique ID string for visualization style
				layouts - a map of layout id strings to Layout objects
				
			Returns:

				N/A
				
			See Also:

				<Layout>
		*/
		constructor : VisualizationStyle,

		/* 
			Function: getId

			Returns unique visualization style id string

			Parameters:

				N/A
			
			Returns:

				id - unique ID string for visualization style
		*/
		getId : this.getId,
		
		/* 
			Function: setId

			Sets unique visualization style id string

			Parameters:

				id - unique ID string for visualization style

			Returns:

				N/A
		*/
		setId : this.setId,
	
		/* 
			Function: getDatasetId

			Returns unique visualization style dataset ID string

			Parameters:

				N/A
			
			Returns:

				id - unique visualization style dataset id string
		*/
		getDatasetId : this.getDatasetId,
		
		/* 
			Function: setDatasetId

			Sets unique visualization style dataset ID string

			Parameters:

				id - unique visualization style dataset ID string

			Returns:

				N/A
		*/
		setDatasetId : this.setDatasetId,
		
		/* 
			Function: getNodeLookAndFeel

			Returns look-and-feel for a node with given node ID (if available) or node type ID (if node ID is not available)

			Parameters:

				nodeId - unique node ID string
				nodeType - unique node type ID string

			Returns:

				nodeLookAndFeel - NodeLookAndFeel object for a node with given node ID (if available) or node type ID (if node ID is not available)
			
			See Also:

				<NodeLookAndFeel>
		*/
		getNodeLookAndFeel : this.getNodeLookAndFeel,
		
		/* 
			Function: setNodeLookAndFeel

			Sets look-and-feel for a node with given node ID

			Parameters:

				nodeId - unique node ID string
				nodeLookAndFeel - NodeLookAndFeel object
				
			Returns:

				N/A
			
			See Also:

				<NodeLookAndFeel>
		*/
		setNodeLookAndFeel : this.setNodeLookAndFeel,
		
		/* 
			Function: getConnectionLookAndFeel

			Returns look-and-feel for a connection with given connection ID (if available) or connection type ID (if connection ID is not available)

			Parameters:

				connectionId - unique connection ID string
				connectionType - unique connection type ID string

			Returns:

				connectionLookAndFeel - ConnectionLookAndFeel object for the connection with given connection ID (if available) or connection type ID (if connection ID is not available)
			
			See Also:

				<ConnectionLookAndFeel>
		*/
		getConnectionLookAndFeel : this.getConnectionLookAndFeel,
		
		/* 
			Function: setConnectionLookAndFeel

			Sets look-and-feel for a connection with given connection ID

			Parameters:

				connectionId - unique connection ID string
				connectionLookAndFeel - NodeLookAndFeel object

			Returns:

				N/A
			
			See Also:

				<ConnectionLookAndFeel>
		*/
		setConnectionLookAndFeel : this.setConnectionLookAndFeel,

		/* 
			Function: setNodeTypeLookAndFeel

			Sets look-and-feel for a node type

			Parameters:

				nodeType - unique node type ID string
				nodeLookAndFeel - NodeLookAndFeel object
				
			Returns:

				N/A
			
			See Also:

				<NodeLookAndFeel>
		*/
		setNodeTypeLookAndFeel : this.setNodeTypeLookAndFeel,
		
		/* 
			Function: setConnectionTypeLookAndFeel

			Sets look-and-feel for a connection type

			Parameters:

				connectionTypeId - unique connection type ID string
				connectionLookAndFeel - ConnectionLookAndFeel object
				
			Returns:

				N/A
			
			See Also:

				<ConnectionLookAndFeel>
		*/
		setConnectionTypeLookAndFeel : this.setConnectionTypeLookAndFeel,
		
		/* 
			Function: removeNodeTypeLookAndFeel

			Removes look-and-feel for a node type

			Parameters:

				nodeType - unique node type ID string
				
			Returns:

				N/A
			
			See Also:

				<NodeLookAndFeel>
		*/
		removeNodeTypeLookAndFeel : this.removeNodeTypeLookAndFeel,
		
		/* 
			Function: removeConnectionTypeLookAndFeel

			Removes look-and-feel for a node type

			Parameters:

				connectionTypeId - unique connection type ID string
				
			Returns:

				N/A
			
			See Also:

				<ConnectionLookAndFeel>
		*/
		removeConnectionTypeLookAndFeel : this.removeConnectionTypeLookAndFeel,
		
		/* 
			Function: getNodeTypeLookAndFeels

			Returns a map of all node type look-and-feels

			Parameters:

				N/A
			
			Returns:

				nodeTypeLookAndFeels - a map of node type id strings to NodeLookAndFeel objects
			
			See Also:

				<NodeLookAndFeel>
		*/
		getNodeTypeLookAndFeels : this.getNodeTypeLookAndFeels,
		
		/* 
			Function: setNodeTypeLookAndFeels

			Sets the map of all node type look-and-feels

			Parameters:

				nodeTypeLookAndFeels - a map of node type id strings to NodeLookAndFeel objects

			Returns:

				N/A
			
			See Also:

				<NodeLookAndFeel>
		*/
		setNodeTypeLookAndFeels : this.setNodeTypeLookAndFeels,
		
		/* 
			Function: getConnectionTypeLookAndFeels

			Returns a map of all connection type look-and-feels

			Parameters:

				N/A
			
			Returns:

				connectionTypeLookAndFeels - a map of connection type id strings to ConnectionLookAndFeel objects
				
			See Also:

				<ConnectionLookAndFeel>
		*/
		getConnectionTypeLookAndFeels : this.getConnectionTypeLookAndFeels,
		
		/* 
			Function: setConnectionTypeLookAndFeels

			Sets the map of all connection type look-and-feels

			Parameters:

				connectionTypeLookAndFeels - a map of connection type id strings to ConnectionLookAndFeel objects

			Returns:

				N/A
				
			See Also:

				<ConnectionLookAndFeel>
		*/
		setConnectionTypeLookAndFeels : this.setConnectionTypeLookAndFeels,

		/* 
			Function: getNodeLookAndFeels

			Returns a map of all node look-and-feels

			Parameters:

				N/A
			
			Returns:

				nodeLookAndFeels - a map of node id strings to NodeLookAndFeel objects
			
			See Also:

				<NodeLookAndFeel>
		*/
		getNodeLookAndFeels : this.getNodeLookAndFeels,
		
		/* 
			Function: setNodeLookAndFeels

			Sets the map of all node look-and-feels

			Parameters:

				nodeLookAndFeels - a map of node id strings to NodeLookAndFeel objects

			Returns:

				N/A
			
			See Also:

				<NodeLookAndFeel>
		*/
		setNodeLookAndFeels : this.setNodeLookAndFeels,
		
		/* 
			Function: getConnectionLookAndFeels

			Returns a map of all connection look-and-feels

			Parameters:

				N/A
			
			Returns:

				connectionLookAndFeels - a map of connection id strings to ConnectionLookAndFeel objects
			
			See Also:

				<ConnectionLookAndFeel>
		*/
		getConnectionLookAndFeels : this.getConnectionLookAndFeels,
		
		/* 
			Function: setConnectionLookAndFeels

			Sets the map of all connection look-and-feels

			Parameters:

				connectionLookAndFeels - a map of connection id strings to ConnectionLookAndFeel objects

			Returns:

				N/A
			
			See Also:

				<ConnectionLookAndFeel>
		*/
		setConnectionLookAndFeels : this.setConnectionLookAndFeels,

		/* 
			Function: getLayouts

			Returns available layouts

			Parameters:

				N/A
			
			Returns:

				layouts - a map of layout id strings to Layout objects
		*/
		getLayouts : this.getLayouts,
		
		/* 
			Function: setLayouts

			Sets available layouts

			Parameters:

				layouts - a map of layout id strings to Layout objects

			Returns:

				N/A
		*/
		setLayouts : this.setLayouts,
	
		/* 
			Function: getDefault

			Returns a default visualization style object

			Parameters:

				N/A
			
			Returns:

				defaultVisualizationStyle - a default VisualizationStyle object
		*/
		getDefault : this.getDefault
		
	}
	
	return VisualizationStyle;

}());

/** 
 * Class: Light
 * This class represents a light object used to provide lighting in VisualizationSandbox and it's parameters
  */
var Light = (function () {
	
	this.id; //String
	
	this.x; //float
	this.y; //float
	this.z; //float
	
	this.yaw; //float
	this.pitch; //float
	this.roll; //float

	this.color; //int [3]
	this.intensity; //float
	this.lightType; //String
	
	this.getId = function () {
		return this.id;
	};

	this.setId = function (id) {
		this.id = id;
	};

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

	this.getColor = function () {
		return this.color;
	};

	this.setColor = function (color) {
		this.color = color;
	};

	this.getIntensity = function () {
		return this.intensity;
	};

	this.setIntensity = function (intensity) {
		this.intensity = intensity;
	};

	this.getLightType = function () {
		return this.lightType;
	};

	this.setLightType = function (lightType) {
		this.lightType = lightType;
	};

	Light = function (id, x, y, z, yaw, pitch, roll, color, intensity, lightType) {
	
		this.id = id; //String
		
		this.x = x; //float
		this.y = y; //float
		this.z = z; //float
		
		this.yaw = yaw; //float
		this.pitch = pitch; //float
		this.roll = roll; //float

		this.color = color; //int [3]
		this.intensity = intensity; //float
		this.lightType = lightType; //String

	};
	
	Light.prototype = { 
	
		/* 
			Function: Light

			Light constructor

			Parameters:

				id - a unique light ID string
				x - X axis position of light
				y - Y axis position of light
				z - Z axis position of light
				yaw - yaw angle of light
				pitch - pitch angle of light
				roll - roll angle of light
				color - light color that is an integer array of length 3 with members in range [0 - 255]
				intensity - a floating point value defining brightness of the light
				lightType - a light type string from set of {"ambient", "point", "spot", "mobile"}

			Returns:

				N/A
		*/
		constructor : Light,
		
		/* 
			Function: getId

			Returns unique light id string

			Parameters:

				N/A
			
			Returns:

				id - unique ID string for light
		*/
		getId : this.getId,
		
		/* 
			Function: setId

			Sets unique light id string

			Parameters:

				id - unique ID string for light

			Returns:

				N/A
		*/
		setId : this.setId,

/* 
			Function: getX

			Returns X axis position of light

			Parameters:

				N/A

			Returns:

				x - X axis position of light
		*/
		getX : this.getX,
		
		/* 
			Function: setX

			Sets X axis position of light

			Parameters:

				x - X axis position of light

			Returns:

				N/A
		*/
		setX : this.setX,
		
		/* 
			Function: getY

			Returns Y axis position of light

			Parameters:

				N/A

			Returns:

				y - Y axis position of light
		*/
		getY : this.getY,
		
		/* 
			Function: setY

			Sets Y axis position of light

			Parameters:

				y - Y axis position of light

			Returns:

				N/A
		*/
		setY : this.setY,
		
		/* 
			Function: getZ

			Returns Z axis position of light

			Parameters:

				N/A

			Returns:

				z - Z axis position of light
		*/
		getZ : this.getZ,
		
		/* 
			Function: setZ

			Sets Z axis position of light

			Parameters:

				z - Z axis position of light

			Returns:

				N/A
		*/
		setZ : this.setZ,
		
/* 
			Function: getYaw

			Returns yaw angle of camera

			Parameters:

				N/A

			Returns:

				yaw - yaw angle of camera
		*/
		getYaw : this.getYaw,
		
		/* 
			Function: setYaw

			Sets yaw angle of camera

			Parameters:

				yaw - yaw angle of camera

			Returns:

				N/A
		*/
		setYaw : this.setYaw,
		
		/* 
			Function: getPitch

			Returns pitch angle of light

			Parameters:

				N/A

			Returns:

				pitch - pitch angle of light
		*/
		getPitch : this.getPitch,
		
		/* 
			Function: setPitch

			Sets pitch angle of light

			Parameters:

				pitch - pitch angle of light

			Returns:

				N/A
		*/
		setPitch : this.setPitch,
		
		/* 
			Function: getRoll

			Returns roll angle of light

			Parameters:

				N/A

			Returns:

				roll - roll angle of light
		*/
		getRoll : this.getRoll,
		
		/* 
			Function: setRoll

			Sets roll angle of light

			Parameters:

				roll - roll angle of light

			Returns:

				N/A
		*/
		setRoll : this.setRoll,
		
		/* 
			Function: getColor

			Returns color of light

			Parameters:

				N/A

			Returns:

				color - light color that is an integer array of length 3 with members in range [0 - 255]
		*/
		getColor : this.getColor,
		
		/* 
			Function: setColor

			Sets color of light

			Parameters:

				color - light color that is an integer array of length 3 with members in range [0 - 255]

			Returns:

				N/A
		*/
		setColor : this.setColor,

		/* 
			Function: getIntensity

			Returns brightness of light

			Parameters:

				N/A

			Returns:

				intensity - a floating point value defining brightness of the light
		*/
		getIntensity : this.getIntensity,
		
		/* 
			Function: setIntensity

			Sets brightness of light

			Parameters:

				intensity - a floating point value defining brightness of the light

			Returns:

				N/A
		*/
		setIntensity : this.setIntensity,

		/* 
			Function: getRoll

			Returns type of light

			Parameters:

				N/A

			Returns:

				lightType - a light type string from set of {"ambient", "point", "spot", "mobile"}
		*/
		getLightType : this.getLightType,
		
		/* 
			Function: setRoll

			Sets type of light

			Parameters:

				lightType - a light type string from set of {"ambient", "point", "spot", "mobile"}

			Returns:

				N/A
		*/
		setLightType : this.setLightType,
		
	};
	
	return Light;
	
}());

/** 
 * Class: HUDSetup
 * This class represents a HUD setup that is displayed over the VisualizationSandbox canvas
  */
var HUDSetup = (function () {

	this.showHUD; //bool
	
	this.showEditingButton; //bool
	
	this.showHideLabelsButton; //bool
	
	this.showNodeTypeLegend; //bool
	
	this.showConnectionTypeLegend; //bool
	
	this.showAxisLegend; //bool
	
	this.showVisualizationStatus; //bool
	
	this.showEditingTools; //bool
	
	this.showLayoutScaleSlider; //bool
	
	this.showSizingScaleSlider; //bool
	
	this.showHideHUDButton; //bool
	
	this.getShowHUD = function () {
		return this.showHUD;
	};

	this.setShowHUD = function (showHUD) {
		this.showHUD = showHUD;
	};

	this.getShowEditingButton = function () {
		return this.showEditingButton;
	};

	this.setShowEditingButton = function (showEditingButton) {
		this.showEditingButton = showEditingButton;
	};

	this.getShowHideNodeLabelsButton = function () {
		return this.showHideLabelsButton;
	};

	this.setShowHideNodeLabelsButton = function (showHideLabelsButton) {
		this.showHideLabelsButton = showHideLabelsButton;
	};

	this.getShowHideConnectionLabelsButton = function () {
		return this.showHideLabelsButton;
	};

	this.setShowHideConnectionLabelsButton = function (showHideLabelsButton) {
		this.showHideLabelsButton = showHideLabelsButton;
	};

	this.getShowNodeTypeLegend = function () {
		return this.showNodeTypeLegend;
	};

	this.setShowNodeTypeLegend = function (showNodeTypeLegend) {
		this.showNodeTypeLegend = showNodeTypeLegend;
	};

	this.getShowConnectionTypeLegend = function () {
		return this.showConnectionTypeLegend;
	};

	this.setShowConnectionTypeLegend = function (showConnectionTypeLegend) {
		this.showConnectionTypeLegend = showConnectionTypeLegend;
	};

	this.getShowAxisLegend = function () {
		return this.showAxisLegend;
	};

	this.setShowAxisLegend = function (showAxisLegend) {
		this.showAxisLegend = showAxisLegend;
	};

	this.getShowVisualizationStatus = function () {
		return this.showVisualizationStatus;
	};

	this.setShowVisualizationStatus = function (showVisualizationStatus) {
		this.showVisualizationStatus = showVisualizationStatus;
	};

	this.getShowEditingTools = function () {
		return this.showEditingTools;
	};

	this.setShowEditingTools = function (showEditingTools) {
		this.showEditingTools = showEditingTools;
	};

	this.getShowLayoutScaleSlider = function () {
		return this.showLayoutScaleSlider;
	};

	this.setShowLayoutScaleSlider = function (showLayoutScaleSlider) {
		this.showLayoutScaleSlider = showLayoutScaleSlider;
	};

	this.getShowSizingScaleSlider = function () {
		return this.showSizingScaleSlider;
	};

	this.setShowSizingScaleSlider = function (showSizingScaleSlider) {
		this.showSizingScaleSlider = showSizingScaleSlider;
	};

	this.getShowHideHUDButton = function () {
		return this.showHideHUDButton;
	};

	this.setShowHideHUDButton = function (showHideHUDButton) {
		this.showHideHUDButton = showHideHUDButton;
	};

	HUDSetup = function () {
	
	};
	
	HUDSetup.prototype = { 
	
		/* 
			Function: HUDSetup

			HUDSetup constructor

			Parameters:

				N/A

			Returns:

				N/A
		*/
		constructor : HUDSetup,
		
		/* 
			Function: getShowHUD

			Returns whether to show HUD

			Parameters:

				N/A
			
			Returns:

				showShadows - "true" or "false" value representing whether to show HUD
		*/
		getShowHUD : this.getShowHUD,
		
		/* 
			Function: setShowHUD

			Sets whether to show HUD

			Parameters:

				showShadows - "true" or "false" value representing whether to show HUD

			Returns:

				N/A
		*/
		setShowHUD : this.setShowHUD,

		/* 
			Function: getShowEditingButton

			Returns whether to show editing button

			Parameters:

				N/A
			
			Returns:

				showShadows - "true" or "false" value representing whether to show editing button
		*/
		getShowEditingButton : this.getShowEditingButton,
		
		/* 
			Function: setShowEditingButton
			
			Sets whether to show editing button

			Parameters:

				showShadows - "true" or "false" value representing whether to show editing button

			Returns:

				N/A
		*/
		setShowEditingButton : this.setShowEditingButton,
		
		/* 
			Function: getShowHideNodeLabelsButton

			Returns whether to show node labels toggling button
			
			Parameters:

				N/A
			
			Returns:

				showShadows - "true" or "false" value representing whether to show node labels toggling button
		*/
		getShowHideNodeLabelsButton : this.getShowHideNodeLabelsButton,
		
		/* 
			Function: setShowHideNodeLabelsButton

			Sets whether to show node labels toggling button

			Parameters:

				showShadows - "true" or "false" value representing whether to show node labels toggling button

			Returns:

				N/A
		*/
		setShowHideNodeLabelsButton : this.setShowHideNodeLabelsButton,
		
		/* 
			Function: getShowHideConnectionLabelsButton

			Returns whether to show connection labels toggling button

			Parameters:

				N/A
			
			Returns:

				showShadows - "true" or "false" value representing whether to show connection labels toggling button
		*/
		getShowHideConnectionLabelsButton : this.getShowHideConnectionLabelsButton,
		
		/* 
			Function: setShowHideConnectionLabelsButton

			Sets whether to show object shadows

			Parameters:

				showShadows - "true" or "false" value representing whether to show connection labels toggling button

			Returns:

				N/A
		*/
		setShowHideConnectionLabelsButton : this.setShowHideConnectionLabelsButton,
		
		/* 
			Function: getShowNodeTypeLegend

			Returns whether to show node type legend

			Parameters:

				N/A
			
			Returns:

				showShadows - "true" or "false" value representing whether to show node type legend
		*/
		getShowNodeTypeLegend : this.getShowNodeTypeLegend,
		
		/* 
			Function: setShowNodeTypeLegend

			Sets whether to show node type legend

			Parameters:

				showShadows - "true" or "false" value representing whether to show node type legend

			Returns:

				N/A
		*/
		setShowNodeTypeLegend : this.setShowNodeTypeLegend,
		
		/* 
			Function: getShowConnectionTypeLegend

			Returns whether to show connection type legend

			Parameters:

				N/A
			
			Returns:

				showShadows - "true" or "false" value representing whether to show connection type legend
		*/
		getShowConnectionTypeLegend : this.getShowConnectionTypeLegend,
		
		/* 
			Function: setShowConnectionTypeLegend

			Sets whether to show connection type legend

			Parameters:

				showShadows - "true" or "false" value representing whether to show connection type legend

			Returns:

				N/A
		*/
		setShowConnectionTypeLegend : this.setShowConnectionTypeLegend,
		
		/* 
			Function: getShowAxisLegend

			Returns whether to show axis legend

			Parameters:

				N/A
			
			Returns:

				showShadows - "true" or "false" value representing whether to show axis legend
		*/
		getShowAxisLegend : this.getShowAxisLegend,
		
		/* 
			Function: setShowAxisLegend

			Sets whether to show axis legend

			Parameters:

				showShadows - "true" or "false" value representing whether to show axis legend

			Returns:

				N/A
		*/
		setShowAxisLegend : this.setShowAxisLegend,
		
		/* 
			Function: getShowVisualizationStatus

			Returns whether to show visualization status message

			Parameters:

				N/A
			
			Returns:

				showShadows - "true" or "false" value representing whether to show visualization status message
		*/
		getShowVisualizationStatus : this.getShowVisualizationStatus,
		
		/* 
			Function: setShowVisualizationStatus

			Sets whether to show visualization status message

			Parameters:

				showShadows - "true" or "false" value representing whether to show visualization status message

			Returns:

				N/A
		*/
		setShowVisualizationStatus : this.setShowVisualizationStatus,

		/* 
			Function: getShowEditingTools

			Returns whether to show editing tools

			Parameters:

				N/A
			
			Returns:

				showShadows - "true" or "false" value representing whether to show editing tools
		*/
		getShowEditingTools : this.getShowEditingTools,
		
		/* 
			Function: setShowEditingTools

			Sets whether to show editing tools

			Parameters:

				showShadows - "true" or "false" value representing whether to show editing tools

			Returns:

				N/A
		*/
		setShowEditingTools : this.setShowEditingTools,

		/* 
			Function: getShowLayoutScaleSlider

			Returns whether to show layout scale slider

			Parameters:

				N/A
			
			Returns:

				showShadows - "true" or "false" value representing whether to show layout scale slider
		*/
		getShowLayoutScaleSlider : this.getShowLayoutScaleSlider,
		
		/* 
			Function: setShowLayoutScaleSlider

			Sets whether to show layout scale slider

			Parameters:

				showShadows - "true" or "false" value representing whether to show layout scale slider

			Returns:

				N/A
		*/
		setShowLayoutScaleSlider : this.setShowLayoutScaleSlider,
	
		/* 
			Function: getShowSizingScaleSlider

			Returns whether to show object size scale slider

			Parameters:

				N/A
			
			Returns:

				showShadows - "true" or "false" value representing whether to show object size scale slider
		*/
		getShowSizingScaleSlider : this.getShowSizingScaleSlider,
		
		/* 
			Function: setShowSizingScaleSlider

			Sets whether to show object size scale slider

			Parameters:

				showShadows - "true" or "false" value representing whether to show object size scale slider

			Returns:

				N/A
		*/
		setShowSizingScaleSlider : this.setShowSizingScaleSlider,

		/* 
			Function: getShowHideHUDButton

			Returns whether to show HUD toggling button

			Parameters:

				N/A
			
			Returns:

				showShadows - "true" or "false" value representing whether to show HUD toggling button
		*/
		getShowHideHUDButton : this.getShowHideHUDButton,
		
		/* 
			Function: setShowHideHUDButton

			Sets whether to show HUD toggling button

			Parameters:

				showShadows - "true" or "false" value representing whether to show HUD toggling button

			Returns:

				N/A
		*/
		setShowHideHUDButton : this.setShowHideHUDButton,

	};
	
	return HUDSetup;
	
}());
