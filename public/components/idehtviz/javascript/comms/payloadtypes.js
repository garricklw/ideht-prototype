/**
 * @author Onur Sert
 * 			Perceptronics Solutions
 *
 * This file contains the entirety of data structures used in the Payload types provided in
 * payload.js. 
 * 
 * Please see the corresponding types in their Java implementations. 
 */

/** 
 * Class: Agent
 * Represents a websocket end-point agent
 */ 
var Agent = function(id, name) {
  this.id = id;
  this.name = name;
};

/** 
 * Class: CommsNetwork
 * Represents a cyber network
 */
var CommsNetwork = function() {
  this.id;
  this.name;
  this.nodes;
  this.links;
  this.attributes;
  this.lastUpdate;
};

/** 
 * Class: CommsNode
 * Represents a cyber node
 */
var CommsNode = function() {
  this.id;
  this.name;
  this.attributes;
};

/** 
 * Class: CommsLink
 * Represents a cyber link
 */
var CommsLink = function() {
  this.id;
  this.name;
  this.sourceNodeId;
  this.targetNodeId;
  this.directional;
  this.attributes;
};

/** 
 * Class: CommsNodeStyle
 * Represents a node look-and-feel style
 */
var CommsNodeStyle = function() {
  this.id;
  this.name;
  this.type;
  this.nodeColors;
  this.nodeSizes;
  this.colorLegend;
  this.transparencyLegend;
  this.sizeLegend;
  this.modelLegend;
  this.textureLegend;
};

/** 
 * Class: CommsLinkStyle
 * Represents a link look-and-feel style
 */
var CommsLinkStyle = function() {
  this.id;
  this.name;
  this.type;
  this.linkColors;
  this.linkSizes;
  this.colorLegend;
  this.transparencyLegend;
  this.sizeLegend;
  this.modelLegend;
  this.textureLegend;
};

/** 
 * Class: CommsColor
 * Represents a color
 */
var CommsColor = function(r, g, b, a) {
  this.r = r;
  this.g = g;
  this.b = b;
  this.a = a;
};

/** 
 * Class: CommsLayout
 * Represents a 2D or 3D layout for a collection of nodes
 */
var CommsLayout = function() {
  this.id;
  this.name;
  this.type;
  this.threeD;
  this.xPositions;
  this.yPositions;
  this.zPositions;
  this.xAxisLegend;
  this.yAxisLegend;
  this.zAxisLegend;	
};

/** 
 * Class: CommsDataUpdate
 * Represents a network edit update
 */
var CommsDataUpdate = function (lastClientUpdateTime, latestDataTime, newNodeCount, newLinkCount,
			removedNodeCount, removedLinkCount, updatedNodeCount, updatedLinkCount) {
	this.lastClientUpdateTime = lastClientUpdateTime;
	this.latestDataTime = latestDataTime;
	this.newNodeCount = newNodeCount;
	this.newLinkCount = newLinkCount;
	this.removedNodeCount = removedNodeCount;
	this.removedLinkCount = removedLinkCount;
	this.updatedNodeCount = updatedNodeCount;
	this.updatedLinkCount = updatedLinkCount;
};

/** 
 * Class: CommsNetworkEdit
 * Represents a network edit
 */
var CommsNetworkEdit = function (removedNodes, removedLinks, addedNode, addedLink, updatedNode, updatedLink) {
	this.removedNodes = removedNodes;
	this.removedLinks = removedLinks;
	this.addedNode = addedNode;
	this.addedLink = addedLink;
	this.updatedNode = updatedNode;
	this.updatedLink = updatedLink;
};
