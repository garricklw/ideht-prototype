/** 
 * Class: VSObject
 * This class represents any object (node, connection, background, etc.) that is represented in VisualizationSandbox
  */
var VSObject = function () {

	this.castShadow;
	this.receiveShadow;
	this.id;
	this.datasetId;
	this.labelText;
	this.type; 
	this.objectType; 
	this.model; //String

	this.scale = 1.0;

	this.isConnection;
	this.selectionAnimation;
	
	this.offset; //THREE.Vector3
	this.orientationOffsetAxis; //THREE.Vector3
	this.orientationOffsetAngle; //float - radians
	this.scaleMultiplier; //float

	this.color; //THREE.Vector3
	this.texture; //String
	this.sourcePosition; //THREE.Vector3
	this.targetPosition; //THREE.Vector3
	this.rotation; //THREE.Vector3
	
	this.layoutScale = 1.0;
	this.position;
	this.visualizationObject;
	this.selectionObject;
	this.highlightingObject;
	this.labelSprite;
	
	this.selected;
	this.highlighted;

	this.setVisibility = function (visible, labelVisibility, keepHighlights) {

		this.visibility = visible;
		this.labelVisibility = labelVisibility;
		
		this.visualizationObject.visible = visible;
		this.selectionObject.visible = false;
		if (!keepHighlights) {
			this.highlightingObject.visible = false;
		}
		this.labelSprite.visible = labelVisibility;
		
	};

	this.getVisibility = function () {
		return this.visibility;
	};

	this.applyColor = function (color) {

		if (this.visualizationObject.material.color != undefined && this.visualizationObject.material.color != null) {
			this.visualizationObject.material.color.set(FormattingUtils.prototype.convertRGBAColorToHex(color));
			if (this.visualizationObject.material.ambient != undefined && this.visualizationObject.material.ambient != null) {
				this.visualizationObject.material.ambient.set(FormattingUtils.prototype.convertRGBAColorToHex(color));
			}
		}
		
		for (var index = 0; index < this.visualizationObject.children.length; index++) {
			var childObject = this.visualizationObject.children[index];
			if (childObject.material.color != undefined && childObject.material.color != null) {
				childObject.material.color.set(FormattingUtils.prototype.convertRGBAColorToHex(color));
				if (childObject.material.ambient != undefined && obj.material.ambient != null) {
					childObject.material.ambient.set(FormattingUtils.prototype.convertRGBAColorToHex(color));
				}
			}
		}

	};

	this.updateLabel = function (modelRepository, borderColor, backgroundColor, visible, zoomLevel) {

		var labelSprite = modelRepository.makeLabelSprite(this.labelText, borderColor, backgroundColor, this.layoutScale, this.scale);
		var tempPosition2 = new THREE.Vector3(this.getVisualizationObject().position.x, this.getVisualizationObject().position.y, this.getVisualizationObject().position.z);

		labelSprite.position = tempPosition2;
		labelSprite.name = this.getVisualizationObject().name+"_label";
		labelSprite.id = this.getVisualizationObject().name;
		labelSprite.castShadow = false;
		labelSprite.receiveShadow = false;
		labelSprite.visible = visible;
		this.labelSprite = labelSprite;
		
	};

	this.setIsConnection = function (isConnection) {
		this.isConnection = isConnection;
	};
		
	this.getIsConnection = function () {	
		return this.isConnection;
	};
		
	this.setVisualizationObject = function (obj) {
		this.visualizationObject = obj;
	};
	
	this.getVisualizationObject = function () {
		return this.visualizationObject;
	};

	this.setSelectionObject = function (obj) {
		this.selectionObject = obj;
	};
	
	this.getSelectionObject = function () {	
		return this.selectionObject;
	};

	this.setHighlightingObject = function (obj) {
		this.highlightingObject = obj;
	};
	
	this.getHighlightingObject = function () {	
		return this.highlightingObject;
	};

	this.setLabelSprite = function (obj) {
		this.labelSprite = obj;
	};

	this.getLabelSprite = function () {	
		return this.labelSprite;
	};
	
	this.setScale = function (scale) {
		this.scale = scale;
	};

	this.getScale = function () {	
		return this.scale;
	};
	
	this.setSelected = function (selected, contrastColor) {
		var deselectedMaterial = new THREE.MeshBasicMaterial({
			color : contrastColor,
			side : THREE.BackSide,
			opacity : 1.0
		});

		var selectedMaterial = new THREE.MeshBasicMaterial({
			color : contrastColor,
			side : THREE.BackSide,
			opacity : 1.0
		});

		this.selected = selected;
		if (selected) {
			this.highlightingObject.material = selectedMaterial;
			this.highlightingObject.visible = true;
		} else {
			if (!this.highlighted) {
				this.highlightingObject.visible = false;
			} else {
				this.highlightingObject.material = deselectedMaterial;
			}
		}
	};

	this.getSelected = function () {	
		return this.selected;
	};
	
	this.setHighlighted = function (highlighted, contrastColor) {
		var deselectedMaterial = new THREE.MeshBasicMaterial({
			color : contrastColor,
			side : THREE.BackSide,
			opacity : 1.0
		});

		var selectedMaterial = new THREE.MeshBasicMaterial({
			color : contrastColor,
			side : THREE.BackSide,
			opacity : 1.0
		});

		this.highlighted = highlighted;
		if (highlighted) {
			this.highlightingObject.material = deselectedMaterial;
			this.highlightingObject.visible = true;
		} else {
			if (!this.selected) {
				this.highlightingObject.visible = false;
			} else {
				this.highlightingObject.material = selectedMaterial;
			}
		}
	};

	this.getHighlighted = function () {	
		return this.highlighted;
	};
	
	this.setId = function (id) {
		this.id = id;
		if (this.getVisualizationObject() != null) {
			this.getVisualizationObject().name = this.id;
		}
		if (this.getSelectionObject() != null) {
			this.getSelectionObject().name = this.id;
		}
		if (this.getHighlightingObject() != null) {
			this.getHighlightingObject().name = this.id+"_highlight";
		}
		if (this.getLabelSprite() != null) {
			this.getLabelSprite().name = this.id;
		}
	};
	
	this.getId = function () {
		return this.id;
	};
	
	this.setType = function (type) {
		this.type = type;
	};
	
	this.getType = function () {
		return this.type;
	};
	
	this.setObjectType = function (type) {
		this.objectType = type;
	};
	
	this.getObjectType = function () {
		return this.objectType;
	};
	
	this.setLabelText = function (labelText) {
		this.labelText = labelText;
	};
	
	this.getLabelText = function () {
		return this.labelText;
	};	

	this.setOffset = function (offset) {
		this.offset = offset;
	};
	
	this.getOffset = function () {
		return this.offset;
	};
		
	this.setOrienorientationOffsetAxis = function (orientationOffsetAxis) {
		this.orientationOffsetAxis = orientationOffsetAxis;
	};
	
	this.setOrientationOffsetAngle = function (orientationOffsetAngle) {
		this.orientationOffsetAngle = orientationOffsetAngle;
	};
	
	this.setScaleMultiplier = function (scaleMultiplier) {	
		this.scaleMultiplier = scaleMultiplier;
	};
	
	this.getScaleMultiplier = function () {	
		return this.scaleMultiplier;
	};
	
	this.setDatasetId = function (datasetId) {
		this.datasetId = datasetId;
	};
	
	this.getDatasetId = function () {
		return this.datasetId;
	};
	
	return {
	
		position: this.position,
		layoutScale : this.layoutScale,

		setScale : this.setScale,
		setSelected : this.setSelected,
		setHighlighted : this.setHighlighted,
		setVisualizationObject : this.setVisualizationObject,
		setSelectionObject : this.setSelectionObject,
		setHighlightingObject : this.setHighlightingObject,
		setLabelSprite : this.setLabelSprite,
		setVisibility : this.setVisibility,
		setIsConnection : this.setIsConnection,
		
		getScale : this.getScale,
		getSelected : this.getSelected,
		getHighlighted : this.getHighlighted,
		getVisualizationObject : this.getVisualizationObject,
		getSelectionObject : this.getSelectionObject,
		getHighlightingObject : this.getHighlightingObject,
		getLabelSprite : this.getLabelSprite,
		getVisibility : this.getVisibility,
		getIsConnection : this.getIsConnection,
		
		setId : this.setId,
		getId : this.getId,

		setType : this.setType,
		getType : this.getType,

		setObjectType : this.setObjectType,
		getObjectType : this.getObjectType,

		setOffset : this.setOffset,
		getOffset : this.getOffset,
		
		getScaleMultiplier : this.getScaleMultiplier,
		
		setOrienorientationOffsetAxis : this.setOrienorientationOffsetAxis,
		setOrientationOffsetAngle : this.setOrientationOffsetAngle,
		setScaleMultiplier : this.setScaleMultiplier,
		setDatasetId : this.setDatasetId,
		getDatasetId : this.getDatasetId,
		
		setHighlight : this.setHighlight,
		
		applyColor : this.applyColor,
		updateLabel : this.updateLabel,
		setLabelText : this.setLabelText,
		
	}
	
};

/** 
 * Class: VSNode
 * This class represents any node object that is represented in VisualizationSandbox
  */
var VSNode = function () {

	this.size; //float
	this.scale = 1.0;
	this.objectType = "node";
	
	this.getPosition = function () {
		return this.position;
	}

	this.applyPosition = function (position) {

		this.position = position;

		var tempPosition = new THREE.Vector3(this.position.x*this.layoutScale, this.position.y*this.layoutScale, this.position.z*this.layoutScale);

		this.getVisualizationObject().position = tempPosition;
		this.getSelectionObject().position = tempPosition;
		this.getHighlightingObject().position = tempPosition;	
		var tempPosition2 = new THREE.Vector3(this.position.x*this.layoutScale, this.position.y*this.layoutScale+3.0, this.position.z*this.layoutScale);
		this.getLabelSprite().position = tempPosition2;

	};

	this.applyLayoutScale = function (layoutScale) {

		this.layoutScale = layoutScale;

		this.applyPosition(this.position);
		
	};

	this.applyScale = function (scale) {

		//this.scale = scale;
		
		this.getVisualizationObject().scale.set(scale.x*this.scaleMultiplier.x, scale.y*this.scaleMultiplier.y, scale.z*this.scaleMultiplier.z);

		this.getSelectionObject().scale.set(scale.x*this.scaleMultiplier.x, scale.y*this.scaleMultiplier.y, scale.z*this.scaleMultiplier.z);

		this.getHighlightingObject().scale.set(scale.x*this.scaleMultiplier.x*1.1, scale.y*this.scaleMultiplier.y*1.1, scale.z*this.scaleMultiplier.z*1.1);
		
	};

	return {
		
		setScale : this.setScale,
		setSelected : this.setSelected,
		setHighlighted : this.setHighlighted,
		setVisualizationObject : this.setVisualizationObject,
		setSelectionObject : this.setSelectionObject,
		setHighlightingObject : this.setHighlightingObject,
		setLabelSprite : this.setLabelSprite,
		setVisibility : this.setVisibility,
		setIsConnection : this.setIsConnection,

		getScale : this.getScale,
		getSelected : this.getSelected,
		getHighlighted : this.getHighlighted,
		getVisualizationObject : this.getVisualizationObject,
		getSelectionObject : this.getSelectionObject,
		getHighlightingObject : this.getHighlightingObject,
		getLabelSprite : this.getLabelSprite,
		getVisibility : this.getVisibility,
		getIsConnection : this.getIsConnection,

		setOrienorientationOffsetAxis : this.setOrienorientationOffsetAxis,
		setOrientationOffsetAngle : this.setOrientationOffsetAngle,
		setScaleMultiplier : this.setScaleMultiplier,
		setDatasetId : this.setDatasetId,
		getDatasetId : this.getDatasetId,

		setId : this.setId,
		getId : this.getId,
		
		setType : this.setType,
		getType : this.getType,
		
		setObjectType : this.setObjectType,
		getObjectType : this.getObjectType,

		setOffset : this.setOffset,
		getOffset : this.getOffset,
		
		getScaleMultiplier : this.getScaleMultiplier,
		
		setHighlight : this.setHighlight,
		
		updateLabel : this.updateLabel,
		
		applyPosition : this.applyPosition,
		getPosition : this.getPosition,
		applyLayoutScale : this.applyLayoutScale,
		applyScale : this.applyScale,
		applyColor : this.applyColor,
		setLabelText : this.setLabelText,
		
	}
	
};

VSNode.prototype = new VSObject();

/** 
 * Class: VSConnection
 * This class represents any connection object that is represented in VisualizationSandbox
  */
var VSConnection = function () {

	this.firstComponentObject;
	this.secondComponentObject;

	this.sourceId;
	this.targetId;

	this.sourcePosition; //THREE.Vector3
	this.targetPosition; //THREE.Vector3
	
	this.thickness = 1.0; //float
	this.scale = 1.0;
	
	this.objectType = "connection";
	
	this.updateLabel = function (modelRepository, borderColor, backgroundColor, visible, zoomLevel) {

		var labelSprite = modelRepository.makeLabelSprite(this.labelText, borderColor, backgroundColor, this.layoutScale, this.scale);

		labelSprite.position =  this.getVisualizationObject().position;
		labelSprite.name = this.getVisualizationObject().name+"_label";
		labelSprite.id = this.getVisualizationObject().name;
		labelSprite.castShadow = false;
		labelSprite.receiveShadow = false;
		labelSprite.visible = visible;
		this.labelSprite = labelSprite;
		
	};
	
	this.setVisibility = function (visible, labelVisibility, keepHighlights) {

		this.visibility = visible;
		this.labelVisibility = labelVisibility;
		
		if (this.firstComponentObject != null) {
			this.firstComponentObject.visible = visible;
		}
		if (this.secondComponentObject != null) {
			this.secondComponentObject.visible = visible;
		}
		this.visualizationObject.visible = visible;
		this.selectionObject.visible = false;
		if (!keepHighlights) {
			this.highlightingObject.visible = false;
		}
		this.labelSprite.visible = labelVisibility;

	};
	
	this.setFirstComponentObject = function (obj) {
		this.firstComponentObject = obj;
		if (this.sourcePosition != null && this.targetPosition != null) {
			this.applyPosition(this.sourcePosition, this.targetPosition);
		}
	};
	
	this.getFirstComponentObject = function () {
		return this.firstComponentObject;
	};
	
	this.setSecondComponentObject = function (obj) {
		this.secondComponentObject = obj;
		if (this.sourcePosition != null && this.targetPosition != null) {
			this.applyPosition(this.sourcePosition, this.targetPosition);
		}
	};
	
	this.getSecondComponentObject = function () {
		return this.secondComponentObject;
	};

	this.setSourceId = function (sourceId) {
		this.sourceId = sourceId;
	};
	
	this.getSourceId = function () {
		return this.sourceId;
	};

	this.setTargetId = function (targetId) {
		this.targetId = targetId;
	};
	
	this.getTargetId = function () {
		return this.targetId;
	};

	this.setSourcePosition = function (sourcePosition) {
		this.sourcePosition = sourcePosition;
	};
	
	this.getSourcePosition = function () {
		return this.sourcePosition;
	};

	this.setTargetPosition = function (targetPosition) {
		this.targetPosition = targetPosition;
	};
	
	this.getTargetPosition = function () {
		return this.targetPosition;
	};
	
	this.setThickness = function (thickness) {
		this.thickness = thickness;
	};
	
	this.getThickness = function () {
		return this.thickness;
	};

	this.applyLayoutScale = function (layoutScale) {

		this.layoutScale = layoutScale;

		this.applyPosition(this.sourcePosition, this.targetPosition);
		
	};

	this.applyScale = function (scale) {

		//this.scale = scale;
		
		this.getVisualizationObject().scale.set(scale.x*this.scaleMultiplier.x, scale.y, scale.z*this.scaleMultiplier.z);

		this.getSelectionObject().scale.set(scale.x*this.scaleMultiplier.x, scale.y, scale.z*this.scaleMultiplier.z);

		this.getHighlightingObject().scale.set(scale.x*this.scaleMultiplier.x*3, scale.y, scale.z*this.scaleMultiplier.z*3);

	};
	
	this.applyPosition = function (sourcePosition, targetPosition) {

		this.sourcePosition = sourcePosition;
		this.targetPosition = targetPosition;

		var matrix = new THREE.Matrix4();
		var up = new THREE.Vector3(0, 1, 0);
		var axis = new THREE.Vector3();

		var tempSourcePosition = new THREE.Vector3(this.sourcePosition.x*this.layoutScale, this.sourcePosition.y*this.layoutScale, this.sourcePosition.z*this.layoutScale);
		var tempTargetPosition = new THREE.Vector3(this.targetPosition.x*this.layoutScale, this.targetPosition.y*this.layoutScale, this.targetPosition.z*this.layoutScale);

		var distance = tempSourcePosition.distanceTo(tempTargetPosition);
		
		var tangent = new THREE.Vector3(tempTargetPosition.x - tempSourcePosition.x, tempTargetPosition.y - tempSourcePosition.y, tempTargetPosition.z - tempSourcePosition.z);
		tangent = tangent.normalize();
		axis.crossVectors(up, tangent).normalize();
		var radians = Math.acos(up.dot(tangent));
		var newScale = new THREE.Vector3(this.getVisualizationObject().scale.x, ((distance > 0) ? distance : 0.0001), this.getVisualizationObject().scale.z);

		if (this.getFirstComponentObject() != null) {
			this.getFirstComponentObject().position = new THREE.Vector3((tempSourcePosition.x + tempTargetPosition.x)/2.0, (tempSourcePosition.y + tempTargetPosition.y)/2.0, (tempSourcePosition.z + tempTargetPosition.z)/2.0);;	
			this.getFirstComponentObject().quaternion.setFromAxisAngle(axis, radians);
		}

		var tangent = new THREE.Vector3(tempSourcePosition.x - tempTargetPosition.x, tempSourcePosition.y - tempTargetPosition.y, tempSourcePosition.z - tempTargetPosition.z);
		tangent = tangent.normalize();
		axis.crossVectors(up, tangent).normalize();
		var radians = Math.acos(up.dot(tangent));
		
		if (this.getSecondComponentObject() != null) {
			this.getSecondComponentObject().position = new THREE.Vector3((tempSourcePosition.x + tempTargetPosition.x)/2.0, (tempSourcePosition.y + tempTargetPosition.y)/2.0, (tempSourcePosition.z + tempTargetPosition.z)/2.0);;	
			this.getSecondComponentObject().quaternion.setFromAxisAngle(axis, radians);
		}

		this.getVisualizationObject().position = new THREE.Vector3((tempSourcePosition.x + tempTargetPosition.x)/2.0, (tempSourcePosition.y + tempTargetPosition.y)/2.0, (tempSourcePosition.z + tempTargetPosition.z)/2.0);
		this.getVisualizationObject().quaternion.setFromAxisAngle(axis, radians);
//		this.getVisualizationObject().scale = newScale;

		this.getSelectionObject().position = this.getVisualizationObject().position;
		this.getSelectionObject().quaternion.setFromAxisAngle(axis, radians);
//		this.getSelectionObject().scale = newScale;

		this.getHighlightingObject().position = this.getVisualizationObject().position;
		this.getHighlightingObject().quaternion.setFromAxisAngle(axis, radians);
//		this.getHighlightingObject().scale = new THREE.Vector3(newScale.x*1.5, newScale.y, newScale.z*1.5);

		this.applyScale(newScale);

		this.getLabelSprite().position = this.getVisualizationObject().position;

	};
	
	return {
		
		setScale : this.setScale,
		setSelected : this.setSelected,
		setHighlighted : this.setHighlighted,
		setFirstComponentObject : this.setFirstComponentObject,
		setSecondComponentObject : this.setSecondComponentObject,
		setVisualizationObject : this.setVisualizationObject,
		setSelectionObject : this.setSelectionObject,
		setHighlightingObject : this.setHighlightingObject,
		setLabelSprite : this.setLabelSprite,
		setVisibility : this.setVisibility,
		setIsConnection : this.setIsConnection,

		getScale : this.getScale,
		getSelected : this.getSelected,
		getHighlighted : this.getHighlighted,
		getFirstComponentObject : this.getFirstComponentObject,
		getSecondComponentObject : this.getSecondComponentObject,
		getVisualizationObject : this.getVisualizationObject,
		getSelectionObject : this.getSelectionObject,
		getHighlightingObject : this.getHighlightingObject,
		getLabelSprite : this.getLabelSprite,
		getVisibility : this.getVisibility,
		getIsConnection : this.getIsConnection,

		setOrienorientationOffsetAxis : this.setOrienorientationOffsetAxis,
		setOrientationOffsetAngle : this.setOrientationOffsetAngle,
		setScaleMultiplier : this.setScaleMultiplier,
		setDatasetId : this.setDatasetId,
		getDatasetId : this.getDatasetId,

		setId : this.setId,
		getId : this.getId,
		
		setType : this.setType,
		getType : this.getType,
		
		setObjectType : this.setObjectType,
		getObjectType : this.getObjectType,

		setOffset : this.setOffset,
		getOffset : this.getOffset,
	
		setHighlight : this.setHighlight,
		
		updateLabel : this.updateLabel,
		
		setSourceId : this.setSourceId,
		setTargetId : this.setTargetId,
		setSourcePosition : this.setSourcePosition,
		setTargetPosition : this.setTargetPosition,
		setThickness : this.setThickness,
	
		getSourceId : this.getSourceId,
		getTargetId : this.getTargetId,
		applyPosition : this.applyPosition,
		applyScale : this.applyScale,
		applyColor : this.applyColor,
		getThickness : this.getThickness,
		applyLayoutScale : this.applyLayoutScale,
		setLabelText : this.setLabelText,

	}

};

VSConnection.prototype = new VSObject();