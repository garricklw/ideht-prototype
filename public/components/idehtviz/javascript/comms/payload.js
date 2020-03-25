/**
 * @author Onur Sert
 * 			Perceptronics Solutions
 * This file contains the entirety of Payloads that are used in communication between 
 * CyberViz web client and plugin backend. 
 *
 * Please see the corresponding Payload types in their Java implementations. 
 */

/** 
 * Class: Payload
 * Represents a generic websocket message payload
 */
var Payload = function () {
	this.agentId;
};

/** 
 * Class: Connect
 * Represents a websocket connection payload
 */
var Connect = function (agent) {
	this.agentId;
	this.agent = agent;
};

/** 
 * Class: Disconnect
 * Represents a websocket disconnection payload
 */
var Disconnect = function () {
	this.agentId;
};

/** 
 * Class: NodeStyleRequestPayload
 * Represents a node style request payload
 */
var NodeStyleRequestPayload = function (type) {
	this.agentId;
	this.type = type;
};

/** 
 * Class: LinkStyleRequestPayload
 * Represents a link style request payload
 */
var LinkStyleRequestPayload = function (type) {
	this.agentId;
	this.type = type;
};

/** 
 * Class: LayoutRequestPayload
 * Represents a layout request payload
 */
var LayoutRequestPayload = function (type, threeD) {
	this.agentId;
	this.type = type;
	this.threeD = threeD
};

/** 
 * Class: NodeStylePayload
 * Represents a node style payload
 */
var NodeStylePayload = function (nodeStyle) {
	this.agentId;
	this.nodeStyle = nodeStyle;
};

/** 
 * Class: LinkStylePayload
 * Represents a link style payload
 */
var LinkStylePayload = function (linkStyle) {
	this.agentId;
	this.linkStyle = linkStyle;
};

/** 
 * Class: LayoutPayload
 * Represents a layout payload
 */
var LayoutPayload = function (type, layout) {
	this.agentId;
	this.type = type;
	this.layout = layout;
};

/** 
 * Class: NetworkRequestPayload
 * Represents a network data request payload
 */
var NetworkRequestPayload = function () {
	this.agentId;
};

/** 
 * Class: DataUpdatePayload
 * Represents a network data edit update payload
 */
var DataUpdatePayload = function (dataUpdate) {
	this.agentId;
	this.dataUpdate = dataUpdate;
};

/** 
 * Class: DataUpdateCheckPayload
 * Represents a data update check payload (to check whether there were any changes to data since last update)
 */
var DataUpdateCheckPayload = function (lastClientUpdateTime) {
	this.agentId;
	this.lastClientUpdateTime = lastClientUpdateTime;
};

/** 
 * Class: NetworkEditPayload
 * Represents a network edit payload (node/link add/remove/edit)
 */
var NetworkEditPayload = function (networkEdit) {
	this.agentId;
	this.networkEdit = networkEdit;
};

/** 
 * Class: JammedAssetsUpdatePayload
 * Represents a jammed asset ids payload
 */
var JammedAssetsUpdatePayload = function (jammedAssetIds) {
	this.agentId;
	this.jammedAssetIds = jammedAssetIds;
};

/** 
 * Class: SelectNodePayload
 * Represents a node selection payload
 */
var SelectNodePayload = function (nodeIds) {
	this.agentId;
	this.nodeIds = nodeIds;
};

/** 
 * Class: StyleOptionsRequestPayload
 * Represents a style options request payload
 */
var StyleOptionsRequestPayload = function () {
	this.agentId;
};

/** 
 * Class: ColorLegend
 * Represents a color legend
 */
var ColorLegend = function() {
	this.attributeName;
	this.minValue;
	this.maxValue;
	this.minColor;
	this.maxColor;
	this.colorMap;
};

/** 
 * Class: NumberLegend
 * Represents a number legend
 */
var NumberLegend = function() {
	this.attributeName;
	this.minValue;
	this.maxValue;
	this.minNumber;
	this.maxNumber;
	this.numberMap;
};

/** 
 * Class: TextLegend
 * Represents a text legend
 */
var TextLegend = function() {
	this.attributeName;
	this.minValue;
	this.maxValue;
	this.minText;
	this.maxText;
	this.textMap;
};

/** 
 * Class: CyberVisibilityPayload
 * Represents a paylaod representing which nodes and links should be visible
 */
var CyberVisibilityPayload = function (visibleNodeIds, visibleLinkIds) {
	this.visibleNodeIds = visibleNodeIds;
	this.visibleLinkIds = visibleLinkIds;
};

/** 
 * Class: MapHoverPayload
 * Represents a payload representing which node, link, or physical unit is hovered on in the map
 */
var MapHoverPayload = function (nodeId, linkId, physicalUnitId) {
	this.nodeId = nodeId;
	this.linkId = linkId;
	this.physicalUnitId = physicalUnitId;
};

/** 
 * Class: CyberHoverPayload
 * Represents a payload representing which node, link, or physical unit is hovered on in the CyberViz logical view
 */
var CyberHoverPayload = function (nodeId, linkId) {
	this.nodeId = nodeId;
	this.linkId = linkId;
};

/** 
 * Class: StyleOptionsPayload
 * Represents a style options payload (node, link styles and layouts, as well as any custom node, link style definitions and custom layout definitions
 */
var StyleOptionsPayload = function (nodeStyleNames, linkStyleNames, layoutNames, customNodeStyles, customLinkStyles, customLayouts) {
	this.agentId;
	this.nodeStyleNames = nodeStyleNames;
	this.linkStyleNames = linkStyleNames;
	this.layoutNames = layoutNames;
	this.customNodeStyles = customNodeStyles;
	this.customLinkStyles = customLinkStyles;
	this.customLayouts = customLayouts;
};

/** 
 * Class: SupportedNodeModelType
 * Represents a list of supported node 3D model types
 */
var SupportedNodeModelType = ["Cube", "Sphere", "Cone", "Tetrahedron", "Icosahedron", "Octahedron"];

/** 
 * Class: SupportedLinkModelType
 * Represents a list of supported link 3D model types
 */
var SupportedLinkModelType = ["Line", "Cylinder"];

/** 
 * Class: CustomNodeStyleDefinition
 * Represents a custom node style definition
 */
var CustomNodeStyleDefinition = function (name, colorMapping, transparencyMapping, sizeMapping, modelMapping, textureMapping) {
	this.name = name;
	this.colorMapping = colorMapping;
	this.transparencyMapping = transparencyMapping;
	this.sizeMapping = sizeMapping;
	this.modelMapping = modelMapping;
	this.textureMapping = textureMapping;
};

/** 
 * Class: CustomLinkStyleDefinition
 * Represents a custom link style definition
 */
var CustomLinkStyleDefinition = function (name, colorMapping, transparencyMapping, sizeMapping, modelMapping, textureMapping) {
	this.name = name;
	this.colorMapping = colorMapping;
	this.transparencyMapping = transparencyMapping;
	this.sizeMapping = sizeMapping;
	this.modelMapping = modelMapping;
	this.textureMapping = textureMapping;
};

/** 
 * Class: CustomLayoutDefinition
 * Represents a custom layout definition
 */
var CustomLayoutDefinition = function (name, twoDlayout, threeDlayout) {
	this.name = name;
	this.twoDlayout = twoDlayout;
	this.threeDlayout = threeDlayout;
};

/** 
 * Class: Custom2DLayoutDefinition
 * Represents a custom 2D layout definition
 */
var Custom2DLayoutDefinition = function (xAxisMapping, yAxisMapping) {
	this.xAxisMapping = xAxisMapping;
	this.yAxisMapping = yAxisMapping;
};

/** 
 * Class: Custom3DLayoutDefinition
 * Represents a custom 3D layout definition
 */
var Custom3DLayoutDefinition = function (xAxisMapping, yAxisMapping, zAxisMapping) {
	this.xAxisMapping = xAxisMapping;
	this.yAxisMapping = yAxisMapping;
	this.zAxisMapping = zAxisMapping;
};

/** 
 * Class: CustomAttributeMapping
 * Represents an attribute to visualization dimension mapping
 */
var CustomAttributeMapping = function (attributeName) {
	this.attributeName = attributeName;
};

/** 
 * Class: CategoricalCustomAttributeToNumberMapping
 * Represents a categorical attribute to number mapping
 */
var CategoricalCustomAttributeToNumberMapping = function (attributeName, valueToNumberMap) {
	this.attributeName = attributeName;
	this.valueToNumberMap = valueToNumberMap;
};

/** 
 * Class: CategoricalCustomAttributeToColorMapping
 * Represents a categorical attribute to color mapping
 */
var CategoricalCustomAttributeToColorMapping = function (attributeName, valueToColorMap) {
	this.attributeName = attributeName;
	this.valueToColorMap = valueToColorMap;
};

/** 
 * Class: CategoricalCustomAttributeToLinkModelMapping
 * Represents a categorical attribute to link model mapping
 */
var CategoricalCustomAttributeToLinkModelMapping = function (attributeName, valueToModelMap) {
	this.attributeName = attributeName;
	this.valueToModelMap = valueToModelMap;
};

/** 
 * Class: CategoricalCustomAttributeToNodeModelMapping
 * Represents a categorical attribute to node model mapping
 */
var CategoricalCustomAttributeToNodeModelMapping = function (attributeName, valueToModelMap) {
	this.attributeName = attributeName;
	this.valueToModelMap = valueToModelMap;
};

/** 
 * Class: CategoricalCustomAttributeToTextureMapping
 * Represents a categorical attribute to texture mapping
 */
var CategoricalCustomAttributeToTextureMapping = function (attributeName, valueToTextureMap) {
	this.attributeName = attributeName;
	this.valueToTextureMap = valueToTextureMap;
};

/** 
 * Class: ContinuousCustomAttributeToNumberMapping
 * Represents a continuous attribute to number mapping
 */
var ContinuousCustomAttributeToNumberMapping = function (attributeName, minValueNumber, maxValueNumber, rangeMin, rangeMax) {
	this.attributeName = attributeName;
	this.minValueNumber = minValueNumber;
	this.maxValueNumber = maxValueNumber;
	this.rangeMin = rangeMin;
	this.rangeMax = rangeMax;
};

/** 
 * Class: ContinuousCustomAttributeToColorMapping
 * Represents a continuous attribute to color mapping
 */
var ContinuousCustomAttributeToColorMapping = function (attributeName, minValueColor, maxValueColor, rangeMin, rangeMax) {
	this.attributeName = attributeName;
	this.minValueColor = minValueColor;
	this.maxValueColor = maxValueColor;
	this.rangeMin = rangeMin;
	this.rangeMax = rangeMax;
};

/** 
 * Class: CustomStylePayload
 * Represents a custom style payload
 */
var CustomStylePayload = function (nodeStyle, linkStyle, layout) {
	this.nodeStyle = nodeStyle;
	this.linkStyle = linkStyle;
	this.layout = layout;
};

/** 
 * Class: StyleDeletePayload
 * Represents a style deletion payload
 */
var StyleDeletePayload = function (nodeStyleName, linkStyleName, layoutName) {
	this.nodeStyleName = nodeStyleName;
	this.linkStyleName = linkStyleName;
	this.layoutName = layoutName;
};