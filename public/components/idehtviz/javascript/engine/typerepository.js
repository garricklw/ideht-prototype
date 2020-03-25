/** 
 * Class: TypeRepository
 * This class represents a repository of node, connection, and layotu types supported by VisualizationSandbox
  */
var TypeRepository = (function () {

	this.nodeTypes ;
	this.connectionTypes;

	this.getNodeTypes = function () {
	
		return this.nodeTypes;
		
	};

	this.getConnectionTypes = function () {
		
		return this.connectionTypes;
		
	};

	TypeRepository = function () {
	
		this.nodeTypes = {};
		this.connectionTypes = {};

		var simpleNodeLookAndFeel = new NodeLookAndFeel("Triangle", [64, 0, 255], [128, 128, 128], null, 1.0, 0.0, false, "Scale_Change");
		var simpleNodeType = new NodeType("Simple", simpleNodeLookAndFeel);

		var planeNodeLookAndFeel = new NodeLookAndFeel("Plane", [255, 32, 255], [128, 128, 128], null, 1.0, 0.0, false, "Scale_Change");
		var planeNodeType = new NodeType("Plane", planeNodeLookAndFeel);
		
		var cubeNodeLookAndFeel = new NodeLookAndFeel("Cube", [32, 32, 255], [128, 128, 128], null, 1.0, 0.0, false, "Scale_Change");
		var cubeNodeType = new NodeType("Cube", cubeNodeLookAndFeel);

		var firewallNodeLookAndFeel = new NodeLookAndFeel("Sphere", [255, 255, 255], [128, 128, 128], "brick.png", 1.0, 0.0, false, "Scale_Change");
		var firewallNodeType = new NodeType("Firewall", firewallNodeLookAndFeel);

		var sphereNodeLookAndFeel = new NodeLookAndFeel("Sphere", [255, 32, 32], [128, 128, 128], null, 0.65, 0.0, false, "Scale_Change");
		var sphereNodeType = new NodeType("Sphere", sphereNodeLookAndFeel);

		var spherePrismNodeLookAndFeel = new NodeLookAndFeel("SpherePrism", [32, 255, 32], [128, 128, 128], null, 0.65, 0.0, false, "Scale_Change");
		var spherePrismNodeType = new NodeType("SpherePrism", spherePrismNodeLookAndFeel);

		var arrowHeadNodeLookAndFeel = new NodeLookAndFeel("ArrowHead", [32, 32, 255], [128, 128, 128], null, 1.0, 0.0, false, "Scale_Change");
		var arrowHeadNodeType = new NodeType("ArrowHead", arrowHeadNodeLookAndFeel);

		// var cubeNodeLookAndFeel = new NodeLookAndFeel("Cube", [128, 128, 128], null, 1.0, 0.0, false, "Scale_Change");
		// var cubeNodeType = new NodeType("Cube", cubeNodeLookAndFeel);

		// var sphereNodeLookAndFeel = new NodeLookAndFeel("Sphere", [128, 128, 128], null, 0.65, 0.0, false, "Scale_Change");
		// var sphereNodeType = new NodeType("Sphere", sphereNodeLookAndFeel);

		var texturedCubeNodeLookAndFeel = new NodeLookAndFeel("Cube", [128, 128, 128], [128, 128, 128], "light_marble.png", 1.0, 0.0, false, "Scale_Change");
		var texturedCubeNodeType = new NodeType("TexturedCube", texturedCubeNodeLookAndFeel);

		var coneNodeLookAndFeel = new NodeLookAndFeel("Cone", [255, 255, 255], [128, 128, 128], null, 1.0, 0.0, false, "Scale_Change");
		var coneNodeType = new NodeType("Cone", coneNodeLookAndFeel);

		var cylinderNodeLookAndFeel = new NodeLookAndFeel("Cylinder", [255, 255, 255], [128, 128, 128], null, 1.0, 0.0, false, "Scale_Change");
		var cylinderNodeType = new NodeType("Cylinder", cylinderNodeLookAndFeel);

		var trafficConeNodeLookAndFeel = new NodeLookAndFeel("TrafficCone", [255, 255, 255], [128, 128, 128], null, 1.0, 0.0, false, "Scale_Change");
		var trafficConeNodeType = new NodeType("TrafficCone", trafficConeNodeLookAndFeel);

		var pctowerNodeLookAndFeel = new NodeLookAndFeel("Pctower", [128, 128, 128], [128, 128, 128], null, 1.0, 0.0, false, "Scale_Change");
		var pctowerNodeType = new NodeType("Pctower", pctowerNodeLookAndFeel);
		
		var pilotFishUAVNodeLookAndFeel = new NodeLookAndFeel("PilotFishUAV", [255, 255, 255], [128, 128, 128], null, 1.0, 0.0, false, "Scale_Change");
		var pilotFishUAVNodeType = new NodeType("PilotFishUAV", pilotFishUAVNodeLookAndFeel);

		var spidermanNodeLookAndFeel = new NodeLookAndFeel("Spiderman", [255, 255, 255], [128, 128, 128], null, 1.0, 0.0, false, "Scale_Change");
		var spidermanNodeType = new NodeType("Spiderman", spidermanNodeLookAndFeel);

		var complexNodeLookAndFeel = new NodeLookAndFeel("Icosahedron", [64, 0, 255], [128, 128, 128], null, 1.0, 0.0, false, "Scale_Change");
		var complexNodeType = new NodeType("Complex", complexNodeLookAndFeel);

		var hugeCubeNodeLookAndFeel = new NodeLookAndFeel("Cube", [64, 0, 255], [128, 128, 128], null, 100.0, 0.0, false, "Scale_Change");
		var hugeCubeNodeType = new NodeType("HugeCube", hugeCubeNodeLookAndFeel);

		var axesLookAndFeel = new NodeLookAndFeel("Axes", null, [128, 128, 128], null, 500.0, 0.0, false, "Scale_Change");
		var axesNodeType = new NodeType("Axes", axesLookAndFeel);

		var gridLookAndFeel = new NodeLookAndFeel("Planes", [255, 255, 255], [128, 128, 128], "chessboard.png", 500.0, 0.8, false, "Scale_Change");
		var gridNodeType = new NodeType("Grid", gridLookAndFeel);

		var planesLookAndFeel = new NodeLookAndFeel("Planes", [192, 192, 192], [128, 128, 128],  null, 500.0, 0.0, false, "Scale_Change");
		var planesNodeType = new NodeType("Planes", planesLookAndFeel);

		var mirrorSurfaceLookAndFeel = new NodeLookAndFeel("MirrorSurface", [255, 255, 255], [128, 128, 128], null, 100.0, 0.0, false, "Scale_Change");
		var mirrorSurfaceNodeType = new NodeType("MirrorSurface", mirrorSurfaceLookAndFeel);

		this.nodeTypes[simpleNodeType.getName()] = simpleNodeType;
		this.nodeTypes[cubeNodeType.getName()] = cubeNodeType;
		this.nodeTypes[firewallNodeType.getName()] = firewallNodeType;
		this.nodeTypes[sphereNodeType.getName()] = sphereNodeType;
		this.nodeTypes[spherePrismNodeType.getName()] = spherePrismNodeType;
		this.nodeTypes[arrowHeadNodeType.getName()] = arrowHeadNodeType;
		this.nodeTypes[texturedCubeNodeType.getName()] = texturedCubeNodeType;
		this.nodeTypes[coneNodeType.getName()] = coneNodeType;
		this.nodeTypes[cylinderNodeType.getName()] = cylinderNodeType;
		this.nodeTypes[trafficConeNodeType.getName()] = trafficConeNodeType;
		this.nodeTypes[pctowerNodeType.getName()] = pctowerNodeType;
		this.nodeTypes[pilotFishUAVNodeType.getName()] = pilotFishUAVNodeType;
		this.nodeTypes[spidermanNodeType.getName()] = spidermanNodeType;
		this.nodeTypes[complexNodeType.getName()] = complexNodeType;
		this.nodeTypes[axesNodeType.getName()] = axesNodeType;
		this.nodeTypes[gridNodeType.getName()] = gridNodeType;
		this.nodeTypes[planesNodeType.getName()] = planesNodeType;
		this.nodeTypes[hugeCubeNodeType.getName()] = hugeCubeNodeType;
		this.nodeTypes[mirrorSurfaceNodeType.getName()] = mirrorSurfaceNodeType;

		var simpleConnectionLookAndFeel = new ConnectionLookAndFeel("Line", new NodeLookAndFeel("ArrowHead", [128, 128, 128], [128, 128, 128], null, 0.4, 0.0, false, "Scale_Change"), null, [128, 128, 128], [128, 128, 128], 0.125, 0.0, false, "Move_Component");
		var simpleConnectionType = new ConnectionType("Simple", simpleConnectionLookAndFeel);

		var thickConnectionLookAndFeel = new ConnectionLookAndFeel("Cylinder", new NodeLookAndFeel("ArrowHead", [128, 128, 128], [128, 128, 128], null, 0.4, 0.0, false, "Scale_Change"), null, [128, 128, 128], [128, 128, 128], 0.125, 0.0, false, "Move_Component");
		var thickConnectionType = new ConnectionType("Thick", thickConnectionLookAndFeel);

		var thinConnectionLookAndFeel = new ConnectionLookAndFeel("Cylinder", new NodeLookAndFeel("ArrowHead", [128, 128, 128], [128, 128, 128], null, 0.4, 0.0, false, "Scale_Change"), null, [128, 128, 128], [128, 128, 128], 0.05, 0.0, false, "Move_Component");
		var thinConnectionType = new ConnectionType("Thin", thinConnectionLookAndFeel);

		var texturedConnectionLookAndFeel = new ConnectionLookAndFeel("Cylinder", new NodeLookAndFeel("ArrowHead", [128, 128, 128], [128, 128, 128], null, 0.4, 0.0, false, "Scale_Change"), "striped.png", [255, 255, 255], [128, 128, 128], 0.125, 0.0, false, "Move_Component");
		var texturedConnectionType = new ConnectionType("Textured", texturedConnectionLookAndFeel);

		this.connectionTypes[simpleConnectionType.getName()] = simpleConnectionType;
		this.connectionTypes[thickConnectionType.getName()] = thickConnectionType;
		this.connectionTypes[thinConnectionType.getName()] = thinConnectionType;
		this.connectionTypes[texturedConnectionType.getName()] = texturedConnectionType;
		
	};

	TypeRepository.prototype = {
	
		/* 
			Constructor: TypeRepository

			Constructs a TypeRepository

			Parameters:

				N/A
		*/
		constructor : TypeRepository,
		
		/* 
			Function: getNodeTypes

			Returns node types supported by VisualizationSandbox

			Parameters:

				N/A
							
			Returns:
				
				nodeTypes - supported node types
		*/
		getNodeTypes : this.getNodeTypes,
		
		/* 
			Function: getConnectionTypes

			Returns connection types supported by VisualizationSandbox

			Parameters:

				N/A
							
			Returns:
				
				connectionTypes - supported connection types
		*/
		getConnectionTypes : this.getConnectionTypes,
		
	};
	
	return TypeRepository;
		
}());
