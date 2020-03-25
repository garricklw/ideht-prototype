/** 
 * Class: ModelRepository
 * This class represents the 3D model creation service/model repository
  */
var ModelRepository = function (vs) {
	
	this.vs = vs;
	
	this.contrastColor = 0xFFFFFF;
	this.contrastColorRGB = new Array(255, 255, 255);
	this.backgroundColorRGB = new Array(0, 0, 0);
	
	var that = this;

	that.resetColor = function () {
	
		var backgroundColor = that.vs.getCurrentVisualizationSetup().getBackgroundColor();
				
		for (var i = 0; i < 3; i++) {
			that.contrastColorRGB[i] = backgroundColor[i]+128;
			if (that.contrastColorRGB[i] > 255) {
				that.contrastColorRGB[i] -= 255;
			}
			if (Math.abs(that.contrastColorRGB[i] - backgroundColor[i]) < Math.abs(255-backgroundColor[i]-backgroundColor[i])) {
				that.contrastColorRGB[i] = 255-backgroundColor[i];
			}
		}
		
		that.contrastColor = that.contrastColorRGB[2] + that.contrastColorRGB[1]*256 + that.contrastColorRGB[0]*256*256;
		that.backgroundColorRGB = new Array(backgroundColor[0], backgroundColor[1], backgroundColor[2]);
	
	};
	
	that.getContrastColor = function (color) {
		
		var contrastColor = new Array(255, 255, 255, color[3]);
		
		for (var i = 0; i < 3; i++) {
			contrastColor[i] = color[i]+128;
			if (contrastColor[i] > 255) {
				contrastColor[i] -= 255;
			}
			if (Math.abs(contrastColor[i] - color[i]) < Math.abs(255-color[i]-color[i])) {
				contrastColor[i] = 255-color[i];
			}
		}
		
		return contrastColor;
		
	};
	
	that.getBestFontColor = function (color) {
		
		var contrastColor = new Array(255, 255, 255, color[3]);
		
		if((color[0]+color[1]+color[2]) > (128+127+127)) {
			contrastColor = new Array(0, 0, 0, color[3]);
		}
		
		return contrastColor;
		
	};
	
	that.getNodeModel = function (datasetId, visId, nodeName, lookAndFeel, castShadow, receiveShadow, callback) {

		var model = lookAndFeel.getModel();	
		
		if (that["get"+model]) {
			that["get"+model].call(that, datasetId, visId, nodeName, lookAndFeel, castShadow, receiveShadow, callback);
		} else {
			that["get"+"Cube"].call(that, datasetId, visId, nodeName, lookAndFeel, castShadow, receiveShadow, callback);
		}
			
	};
		
	that.getConnectionModel = function (datasetId, visId, connectionName, sourceId, targetId, lookAndFeel, sourcePosition, targetPosition, castShadow, receiveShadow, callback) {
		
		var model = lookAndFeel.getModel();	
				
		if (that["get"+model]) {
			 that["get"+model].call(that, datasetId, visId, connectionName, sourceId, targetId, sourcePosition, targetPosition, lookAndFeel, castShadow, receiveShadow, callback);
		} else {
			that["get"+"Line"].call(that, datasetId, visId, connectionName, sourceId, targetId, sourcePosition, targetPosition, lookAndFeel, castShadow, receiveShadow, callback);
		}
			
	};

	that.applyMaterialAndTexture = function (obj, datasetId, visId, visName, sourceId, targetId, lookAndFeel, castShadow, receiveShadow, callback, connectionObj, applyToChildren) {

		obj.castShadow = castShadow;
		obj.receiveShadow = receiveShadow;
		obj.name = datasetId + "_" + visId;
		obj.datasetId = datasetId;
		obj.sourceId = sourceId;
		obj.targetId = targetId;
		obj.labelText = visName;

		for (var index = 0; index < obj.children.length; index++) {
			var childObject = obj.children[index];
			childObject.castShadow = castShadow;
			childObject.receiveShadow = receiveShadow;
			childObject.name = datasetId + " " + visId;
			childObject.datasetId = datasetId;
			childObject.labelText = visName;
			childObject.sourceId = sourceId;
			childObject.targetId = targetId;
		}
		
		if (lookAndFeel == undefined || lookAndFeel == null) {

			obj.type = "Unknown";
			that.applyTextureToObject(obj, null, callback, connectionObj);

		} else {

			if (lookAndFeel.getModel() != undefined && lookAndFeel.getModel() != null) {
				obj.type = lookAndFeel.getModel();
			}

			if (obj.material == undefined || obj.material == null) {
				obj.material = new THREE.MeshPhongMaterial({ ambient: 0xFFFFFF, color: 0xFFFFFF, specular: 0x555555, shininess: 5, shading: THREE.FlatShading });

				for (var index = 0; index < obj.children.length; index++) {
					var childObject = obj.children[index];
					if (childObject.material == undefined || childObject.material == null) {
						if (applyToChildren == undefined || applyToChildren == true) {
							childObject.material = new THREE.MeshPhongMaterial({ ambient: 0xFFFFFF, color: 0xFFFFFF, specular: 0x555555, shininess: 5, shading: THREE.FlatShading });
						}
					}
				}
			}
			
			if (lookAndFeel.getColor() != undefined && lookAndFeel.getColor() != null) {
				if (obj.materials == undefined || obj.materials == null) {
					if (obj.material.color != undefined && obj.material.color != null) {
						var color = lookAndFeel.getColor();
						obj.material.color.set(FormattingUtils.prototype.convertRGBAColorToHex(color));
						if (obj.material.ambient != undefined && obj.material.ambient != null) {
							obj.material.ambient.set(FormattingUtils.prototype.convertRGBAColorToHex(color));
						}
						obj.material.wireframe = lookAndFeel.getWireframe();
						obj.material.transparent = true;
						obj.material.opacity = 1.0 - lookAndFeel.getTransparency();

						for (var index = 0; index < obj.children.length; index++) {
							var childObject = obj.children[index];
							if (childObject.material.color != undefined && childObject.material.color != null) {
								childObject.material.color.set(FormattingUtils.prototype.convertRGBAColorToHex(color));
								if (childObject.material.ambient != undefined && obj.material.ambient != null) {
									if (applyToChildren == undefined || applyToChildren == true) {
										childObject.material.ambient.set(FormattingUtils.prototype.convertRGBAColorToHex(color));
									}
								}
								childObject.material.wireframe = lookAndFeel.getWireframe();
								childObject.material.transparent = true;
								childObject.material.opacity = 1.0 - lookAndFeel.getTransparency();
							}
						}
					}
				} else {
				
					for (var index = 0; index < obj.materials.length; index++) {
						var material = obj.materials[index];
						if (material.color != undefined && material.color != null) {
							var color = lookAndFeel.getColor();
							material.color.set(FormattingUtils.prototype.convertRGBAColorToHex(color));
							if (material.ambient != undefined && material.ambient != null) {
								material.ambient.set(FormattingUtils.prototype.convertRGBAColorToHex(color));
							}
							material.wireframe = lookAndFeel.getWireframe();
							material.transparent = true;
							material.opacity = 1.0 - lookAndFeel.getTransparency();

							for (var index = 0; index < obj.children.length; index++) {
								var childObject = obj.children[index];
								if (childObject.materials == undefined || childObject.materials == null) {
									if (childObject.material.color != undefined && childObject.material.color != null) {
										childObject.material.color.set(FormattingUtils.prototype.convertRGBAColorToHex(color));
										if (childObject.material.ambient != undefined && obj.material.ambient != null) {
											if (applyToChildren == undefined || applyToChildren == true) {
												childObject.material.ambient.set(FormattingUtils.prototype.convertRGBAColorToHex(color));
											}
										}
										childObject.material.wireframe = lookAndFeel.getWireframe();
										childObject.material.transparent = true;
										childObject.material.opacity = 1.0 - lookAndFeel.getTransparency();
									}
								} else {
								
									for (var index = 0; index < childObject.materials.length; index++) {
										var childMaterial = childObject.materials[index];

										if (childMaterial.color != undefined && childMaterial.color != null) {
											childMaterial.color.set(FormattingUtils.prototype.convertRGBAColorToHex(color));
											if (childMaterial.ambient != undefined && childMaterial.ambient != null) {
												if (applyToChildren == undefined || applyToChildren == true) {
													childMaterial.ambient.set(FormattingUtils.prototype.convertRGBAColorToHex(color));
												}
											}
											childMaterial.wireframe = lookAndFeel.getWireframe();
											childMaterial.transparent = true;
											childMaterial.opacity = 1.0 - lookAndFeel.getTransparency();
										}
									}
								
								}
							}
						}
					}
				
				}
			}
			
			that.applyTextureToObject(obj, lookAndFeel, callback, connectionObj, applyToChildren);
			
		}


	};

	that.applyTextureToObject = function (obj, lookAndFeel, callback, connectionObj, applyToChildren) {

		var baseUrl = "data/textures/";

		if (lookAndFeel.getTexture() != null) {
					
			if (lookAndFeel.getTexture().indexOf("http") > -1) {

				var url = lookAndFeel.getTexture();
				var image = document.createElement('img');
				image.crossOrigin = '';
				
				image.onload = function () {
				
					var texture = new THREE.Texture();
					texture.image = image;
					texture.needsUpdate = true;

					obj.traverse( function ( child ) {
						if ( child instanceof THREE.Mesh ) {
							if (applyToChildren == undefined || applyToChildren == true) {
								child.material.map = texture;
								child.material.needsUpdate = true;
							}
						}
					} );
					
				};
				image.src = url;
					if ((obj.sourceId == undefined || obj.sourceId == null) && (connectionObj == undefined || connectionObj == null)) {
						that.makeVSObject.call(that, obj, lookAndFeel, callback, null);
					} else if (!(obj.sourceId == undefined || obj.sourceId == null) && (connectionObj == undefined || connectionObj == null)) {

						if (lookAndFeel.getComponentLookAndFeel() != null) {
							var componentLookAndFeel = lookAndFeel.getComponentLookAndFeel();
							var model = componentLookAndFeel.getModel();
											
							if (that["get"+model]) {
								that["get"+model].call(that, obj.datasetId, obj.name+"_component", obj.name+"_component", componentLookAndFeel, false, false, callback, obj);
							} else {
								that["get"+"Cube"].call(that, obj.datasetId, obj.name+"_component", obj.name+"_component", componentLookAndFeel, false, false, callback, obj);
							}
						} else {
							that.makeVSObject(obj, lookAndFeel, callback, null);
						}
						
					} else {
						that.makeVSObject(connectionObj, lookAndFeel, callback, obj);
					}
			} else {
		
				var image = document.createElement('img');
				image.onload = function () {
				
					var texture = new THREE.Texture();
					texture.image = image;
					texture.needsUpdate = true;

					obj.traverse( function ( child ) {
						if ( child instanceof THREE.Mesh ) {
							child.material.map = texture;
							child.material.needsUpdate = true;
						}
					} );

				};
				image.src = baseUrl+lookAndFeel.getTexture();

					if ((obj.sourceId == undefined || obj.sourceId == null) && (connectionObj == undefined || connectionObj == null)) {
						that.makeVSObject.call(that, obj, lookAndFeel, callback, null);
					} else if (!(obj.sourceId == undefined || obj.sourceId == null) && (connectionObj == undefined || connectionObj == null)) {

						if (lookAndFeel.getComponentLookAndFeel() != null) {
							var componentLookAndFeel = lookAndFeel.getComponentLookAndFeel();
							var model = componentLookAndFeel.getModel();
											
							if (that["get"+model]) {
								that["get"+model].call(that, obj.datasetId, obj.name+"_component", obj.name+"_component", componentLookAndFeel, false, false, callback, obj);
							} else {
								that["get"+"Cube"].call(that, obj.datasetId, obj.name+"_component", obj.name+"_component", componentLookAndFeel, false, false, callback, obj);
							}
						} else {
							that.makeVSObject(obj, lookAndFeel, callback, null);
						}
						
					} else {
						that.makeVSObject(connectionObj, lookAndFeel, callback, obj);
					}
			}
			
		} else {

			if ((obj.sourceId == undefined || obj.sourceId == null) && (connectionObj == undefined || connectionObj == null)) {
				that.makeVSObject(obj, lookAndFeel, callback, null);
			} else if (!(obj.sourceId == undefined || obj.sourceId == null) && (connectionObj == undefined || connectionObj == null)) {

				if (lookAndFeel.getComponentLookAndFeel() != null) {
					var componentLookAndFeel = lookAndFeel.getComponentLookAndFeel();
					var model = componentLookAndFeel.getModel();
									
					if (that["get"+model]) {
						 that["get"+model].call(that, obj.datasetId, obj.name+"_component", obj.name+"_component", componentLookAndFeel, false, false, callback, obj);
					} else {
						that["get"+"Cube"].call(that, obj.datasetId, obj.name+"_component", obj.name+"_component", componentLookAndFeel, false, false, callback, obj);
					}
				} else {
					that.makeVSObject(obj, lookAndFeel, callback, null);
				}
				
			} else {
				that.makeVSObject(connectionObj, lookAndFeel, callback, obj);
			}
		
		}	
		
	};

	that.makeVSObject = function (obj, lookAndFeel, callback, componentObj) {

		var vsObj;
		if (obj.sourceId == undefined || obj.sourceId == null) {
			vsObj = new VSNode();
			vsObj.setIsConnection(false);
		} else {
			vsObj = new VSConnection();
			vsObj.setIsConnection(true);
		}
		
		vsObj.setVisualizationObject(obj);
		vsObj.getVisualizationObject().castShadow = obj.castShadow;
		vsObj.getVisualizationObject().receiveShadow = obj.receiveShadow;
		vsObj.setId(obj.name);
		vsObj.setType(obj.type);
		vsObj.setOffset(obj.offset);
		vsObj.setOrienorientationOffsetAxis(obj.orientationOffsetAxis);
		vsObj.setOrientationOffsetAngle(obj.orientationOffsetAngle);
		vsObj.setScaleMultiplier(obj.scaleMultiplier);
		vsObj.setDatasetId(obj.datasetId);
		vsObj.setScale(lookAndFeel.getSize());
		vsObj.labelColor = lookAndFeel.getLabelColor();
		
		if (vsObj.getIsConnection()) {
			vsObj.setSelectionObject(that.getConnectionSelectionMesh(obj));
		} else {
			vsObj.setSelectionObject(that.getSelectionMesh(obj));
		}

		vsObj.getSelectionObject().name = vsObj.getId();
		vsObj.getSelectionObject().datasetId = obj.datasetId;
		vsObj.getSelectionObject().castShadow = false;
		vsObj.getSelectionObject().receiveShadow = false;

		vsObj.setHighlightingObject(that.getOutlineMesh(obj, vsObj.getIsConnection()));
		vsObj.getHighlightingObject().datasetId = obj.datasetId;
		vsObj.getHighlightingObject().castShadow = false;
		vsObj.getHighlightingObject().receiveShadow = false;

		if (obj.type != "Axes") {
			var labelSprite = that.makeLabelSprite(obj.labelText, [that.backgroundColorRGB[0], that.backgroundColorRGB[1], that.backgroundColorRGB[2], 0.0], [vsObj.labelColor[0], vsObj.labelColor[1], vsObj.labelColor[2], 1.0], that.vs.getLayoutScale(), vsObj.getScale());
			labelSprite.position = obj.position;
			labelSprite.name = obj.name+"_label";
			labelSprite.id = obj.name;
			labelSprite.datasetId = obj.datasetId;
			labelSprite.castShadow = false;
			labelSprite.receiveShadow = false;
			vsObj.setLabelSprite(labelSprite);
			vsObj.setLabelText(obj.labelText);
		} else {
			vsObj.setLabelSprite(new THREE.Sprite());
			vsObj.setLabelText(obj.labelText);
		}
		
		if (componentObj != undefined && componentObj != null) {
			componentObj.name = vsObj.getId()+"_firstComponent";
			componentObj.datasetId = obj.datasetId;
			componentObj.castShadow = obj.castShadow;
			componentObj.receiveShadow = obj.receiveShadow;
			vsObj.setFirstComponentObject(componentObj);
			var secondComponentObj = componentObj.clone();
			secondComponentObj.name = vsObj.getId()+"_secondComponent";
			that.offsetScaleRotate(secondComponentObj, new THREE.Vector3(0.0, 0.0, 0.0), new THREE.Vector3(1.0, 1.0, 1.0), new THREE.Vector3(0.0, 0.0, 1.0), Math.PI);
			vsObj.setSecondComponentObject(secondComponentObj);
		}

		if (vsObj.getVisualizationObject().geometry) {
			if (vsObj.getVisualizationObject().geometry.faces[0]) {
				vsObj.getVisualizationObject().geometry = THREE.BufferGeometryUtils.fromGeometry(vsObj.getVisualizationObject().geometry);
				vsObj.getSelectionObject().geometry = THREE.BufferGeometryUtils.fromGeometry(vsObj.getSelectionObject().geometry);
				vsObj.getHighlightingObject().geometry = THREE.BufferGeometryUtils.fromGeometry(vsObj.getHighlightingObject().geometry);
			}
		} else {
			//console.log(vsObj);
		}
		
		vsObj.setVisibility(false, false);
		
		if (vsObj.getIsConnection()) {
			if (vsObj.getFirstComponentObject() && vsObj.getFirstComponentObject().geometry && vsObj.getFirstComponentObject().geometry.faces[0]) {
				vsObj.getFirstComponentObject().geometry = THREE.BufferGeometryUtils.fromGeometry(vsObj.getFirstComponentObject().geometry);
			}
			if (vsObj.getSecondComponentObject() && vsObj.getSecondComponentObject().geometry && vsObj.getSecondComponentObject().geometry.faces[0]) {
				vsObj.getSecondComponentObject().geometry = THREE.BufferGeometryUtils.fromGeometry(vsObj.getSecondComponentObject().geometry);
			}
			// var componentLookAndFeel = lookAndFeel.getComponentLookAndFeel();
			// componentLookAndFeel.setSelectionAnimation(lookAndFeel.getSelectionAnimation());
			// that.getConnectionComponentModel(vsObj.datasetId, vsObj.ID, componentLookAndFeel, vsObj.castShadow, vsObj.receiveShadow, function(){callback(vsObj, selectionAnimation);});
			vsObj.setSourceId(obj.sourceId);
			vsObj.setTargetId(obj.targetId);
			vsObj.applyPosition(obj.sourcePosition, obj.targetPosition);
			vsObj.setIsConnection(true);

			callback(vsObj, lookAndFeel.getSelectionAnimation());
		} else {
			vsObj.applyPosition(obj.position);
			vsObj.setIsConnection(false);
			
			callback(vsObj, lookAndFeel.getSelectionAnimation());
		}

	};

	that.getGrid = function(datasetId, visId, visName, lookAndFeel, castShadow, receiveShadow, callback) {

		that.getPlanes(datasetId, visId, visName, lookAndFeel, castShadow, receiveShadow, callback);

	};

	that.getMirrorSurface = function(datasetId, visId, visName, lookAndFeel, castShadow, receiveShadow, callback) {

		var hexColor = FormattingUtils.prototype.convertRGBAColorToHex(new Array(128, 128, 128, 1));
		var material = new THREE.MeshBasicMaterial({color: hexColor, opacity: 1.0});

		var size = lookAndFeel.getSize();
		
		if (size == undefined || size == null) {
			size = 1.0;
		}
		
		var geometry = new THREE.BoxGeometry(size, 0, size); 
		
		var generatedObject = new THREE.Mesh(geometry, material);
		that.offsetScaleRotate(generatedObject, new THREE.Vector3(0, 0, 0), new THREE.Vector3(1.0, 1.0, 1.0), new THREE.Vector3(0.0, 1.0, 0.0), 0.0);
		
		that.applyMaterialAndTexture(generatedObject, datasetId, visId, visName, null, null, lookAndFeel, castShadow, receiveShadow, callback);
		
	};

	that.getPlane = function(datasetId, visId, visName, lookAndFeel, castShadow, receiveShadow, callback, connectionObj) {
		
		var size = lookAndFeel.getSize();
		
		if (size == undefined || size == null) {
			size = 1.0;
		}

		var geometry = new THREE.BoxGeometry(size, size, 0);
		var material = new THREE.MeshPhongMaterial({ ambient: 0xdddddd, color: 0xdddddd, specular: 0x555555, shininess: 5, shading: THREE.FlatShading });
		//var material = new THREE.MeshLambertMaterial({ color: 0x030303, wireframe : useWireframe});
		var generatedObject = new THREE.Mesh( geometry, material );
		that.offsetScaleRotate(generatedObject, new THREE.Vector3(0, 0, 0), new THREE.Vector3(1.0, 1.0, 1.0), new THREE.Vector3(0.0, 0.0, 0.0), 0.0);
		
		that.applyMaterialAndTexture(generatedObject, datasetId, visId, visName, null, null, lookAndFeel, castShadow, receiveShadow, callback, connectionObj);

	};
	
	that.getPlanes = function(datasetId, visId, visName, lookAndFeel, castShadow, receiveShadow, callback) {

		var size = lookAndFeel.getSize();
		
		if (size == undefined || size == null) {
			size = 1.0;
		}

		var hexColor = FormattingUtils.prototype.convertRGBAColorToHex(new Array(255, 255, 255, 1));
		var redHexColor = FormattingUtils.prototype.convertRGBAColorToHex(new Array(255, 128, 128, 1));
		var greenHexColor = FormattingUtils.prototype.convertRGBAColorToHex(new Array(128, 255, 128, 1));
		var blueHexColor = FormattingUtils.prototype.convertRGBAColorToHex(new Array(128, 128, 255, 1));

		if (lookAndFeel.getTexture() == undefined || lookAndFeel.getTexture() == null) {

			// var faceMaterial = new THREE.MeshFaceMaterial([new THREE.MeshPhongMaterial({ ambient: redHexColor, color: redHexColor, specular: 0x555555, shininess: 30, shading: THREE.FlatShading }), 
														   // new THREE.MeshPhongMaterial({ ambient: redHexColor, color: redHexColor, specular: 0x555555, shininess: 30, shading: THREE.FlatShading }), 
														   // new THREE.MeshPhongMaterial({ ambient: greenHexColor, color: greenHexColor, specular: 0x555555, shininess: 30, shading: THREE.FlatShading }), 
														   // new THREE.MeshPhongMaterial({ ambient: greenHexColor, color: greenHexColor, specular: 0x555555, shininess: 30, shading: THREE.FlatShading }), 
														   // new THREE.MeshPhongMaterial({ ambient: blueHexColor, color: blueHexColor, specular: 0x555555, shininess: 30, shading: THREE.FlatShading }), 
														   // new THREE.MeshPhongMaterial({ ambient: blueHexColor, color: blueHexColor, specular: 0x555555, shininess: 30, shading: THREE.FlatShading }),]);

			// for(var index = 0; index < faceMaterial.materials.length; index++) {
				// faceMaterial.materials[index].side = THREE.BackSide;
			// }
			
			var material = new THREE.MeshPhongMaterial({ ambient: hexColor, color: hexColor, specular: 0x555555, shininess: 5, shading: THREE.FlatShading });
			material.side = THREE.BackSide;
			
			var geometry = new THREE.BoxGeometry(size, size, size); 

			var generatedObject = new THREE.Mesh(geometry, material);
			
			that.offsetScaleRotate(generatedObject, new THREE.Vector3(0, 0, 0), new THREE.Vector3(1.0, 1.0, 1.0), new THREE.Vector3(0.0, 1.0, 0.0), 0.0);
		
			that.applyMaterialAndTexture(generatedObject, datasetId, visId, visName, null, null, lookAndFeel, castShadow, receiveShadow, callback);
		
		} else {
		
			var material = new THREE.MeshPhongMaterial({ ambient: hexColor, color: hexColor, specular: 0x555555, shininess: 5, shading: THREE.FlatShading });
			material.side = THREE.BackSide;
			
			var geometry = new THREE.BoxGeometry(size, size, size); 

			var generatedObject = new THREE.Mesh(geometry, material);
			
			that.offsetScaleRotate(generatedObject, new THREE.Vector3(0, 0, 0), new THREE.Vector3(1.0, 1.0, 1.0), new THREE.Vector3(0.0, 1.0, 0.0), 0.0);
		
			that.applyMaterialAndTexture(generatedObject, datasetId, visId, visName, null, null, lookAndFeel, castShadow, receiveShadow, callback);
		
		}
		
		
	};

	that.getAxes = function(datasetId, visId, visName, lookAndFeel, castShadow, receiveShadow, callback) {

		var generatedObject = new THREE.Object3D();

		var size = lookAndFeel.getSize();
		
		if (size == undefined || size == null) {
			size = 1.0;
		}

		generatedObject.add( that.buildAxis( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( size, 0, 0 ), 0xFF0000, false ) ); // +X
		generatedObject.add( that.buildAxis( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( -size, 0, 0 ), 0xFF0000, true) ); // -X
		generatedObject.add( that.buildAxis( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( 0, size, 0 ), 0x00FF00, false ) ); // +Y
		generatedObject.add( that.buildAxis( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( 0, -size, 0 ), 0x00FF00, true ) ); // -Y
		generatedObject.add( that.buildAxis( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( 0, 0, size ), 0x0000FF, false ) ); // +Z
		generatedObject.add( that.buildAxis( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( 0, 0, -size ), 0x0000FF, true ) ); // -Z
		
		that.offsetScaleRotate(generatedObject, new THREE.Vector3(0, 0, 0), new THREE.Vector3(1.0, 1.0, 1.0), new THREE.Vector3(0.0, 1.0, 0.0), 0.0);
		
		that.applyMaterialAndTexture(generatedObject, datasetId, visId, visName, null, null, lookAndFeel, castShadow, receiveShadow, callback);
		
	};

	that.getAffiliation = function(datasetId, visId, visName, lookAndFeel, castShadow, receiveShadow, callback) {

		var geometry = new THREE.TorusGeometry( 50, 1.5, 16, 100 );
		var material = new THREE.MeshBasicMaterial( { color: 0x039ED1 } );
		var generatedObject1 = new THREE.Mesh( geometry, material );
		var laf1 = new NodeLookAndFeel(null, [3, 158, 209], [3, 158, 209], null, 100, 0, false, null, null);
		that.offsetScaleRotate(generatedObject1, new THREE.Vector3(0, 0, 0), new THREE.Vector3(1.0, 1.0, 1.0), new THREE.Vector3(0.0, 0.0, 1.0), Math.PI/2.0);		
		that.applyMaterialAndTexture(generatedObject1, datasetId, visId+"f", visName+"f", null, null, laf1, false, false, callback);

		var geometry = new THREE.TorusGeometry( 50, 1.5, 16, 100 );
		var material = new THREE.MeshBasicMaterial( { color: 0xFFFF00 } );
		var generatedObject2 = new THREE.Mesh( geometry, material );
		var laf2 = new NodeLookAndFeel(null, [255, 255, 0], [255, 255, 0], null, 100, 0, false, null, null);
		if (vs.getPerspective()) {
			that.rotateAroundObjectAxis(generatedObject2, new THREE.Vector3(1.0, 0.0, 0.0), 0);
			that.offsetScaleRotate(generatedObject2, new THREE.Vector3(-0, 0, -0), new THREE.Vector3(1.0, 1.0, 1.0), new THREE.Vector3(-1.0/Math.sqrt(2), 1.0/Math.sqrt(2), 0.0), Math.PI/4.0);		
		} else {
			that.offsetScaleRotate(generatedObject2, new THREE.Vector3(0, 0, 0), new THREE.Vector3(1.0, 1.0, 1.0), new THREE.Vector3(0.0, 0.0, 1.0), Math.PI/2.0);		
		}
		that.applyMaterialAndTexture(generatedObject2, datasetId, visId+"u", visName+"u", null, null, laf2, false, false, callback);

		var geometry = new THREE.TorusGeometry( 50, 1.5, 16, 100 );
		var material = new THREE.MeshBasicMaterial( { color: 0x00FF00 } );
		var generatedObject3 = new THREE.Mesh( geometry, material );
		var laf3 = new NodeLookAndFeel(null, [0, 255, 0], [0, 255, 0], null, 100, 0, false, null, null);
		if (vs.getPerspective()) {
			that.rotateAroundObjectAxis(generatedObject3, new THREE.Vector3(1.0, 0.0, 0.0), 0);
			that.offsetScaleRotate(generatedObject3, new THREE.Vector3(0, 0, -0), new THREE.Vector3(1.0, 1.0, 1.0), new THREE.Vector3(-1.0/Math.sqrt(2), -1.0/Math.sqrt(2), 0.0), Math.PI/4.0);		
		} else {
			that.offsetScaleRotate(generatedObject3, new THREE.Vector3(0, 0, 0), new THREE.Vector3(1.0, 1.0, 1.0), new THREE.Vector3(0.0, 0.0, 1.0), Math.PI/2.0);		
		}
		that.applyMaterialAndTexture(generatedObject3, datasetId, visId+"n", visName+"n", null, null, laf3, false, false, callback);

		var geometry = new THREE.TorusGeometry( 50, 1.5, 16, 100 );
		var material = new THREE.MeshBasicMaterial( { color: 0xFF0000 } );
		var generatedObject4 = new THREE.Mesh( geometry, material );
		var laf4 = new NodeLookAndFeel(null, [255, 0, 0], [255, 0, 0], null, 100, 0, false, null, null);
		if (vs.getPerspective()) {
			that.offsetScaleRotate(generatedObject4, new THREE.Vector3(0, 0, 0*Math.sqrt(2)), new THREE.Vector3(1.0, 1.0, 1.0), new THREE.Vector3(1.0, 0.0, 0.0), Math.PI/4.0);		
		} else {
			that.offsetScaleRotate(generatedObject4, new THREE.Vector3(0, 0, 0), new THREE.Vector3(1.0, 1.0, 1.0), new THREE.Vector3(0.0, 0.0, 1.0), Math.PI/2.0);		
		}
		that.applyMaterialAndTexture(generatedObject4, datasetId, visId+"s", visName+"s", null, null, laf4, false, false, callback);
		
	};

	that.buildAxis = function( src, dst, colorHex, dashed) {
		
		var geom = new THREE.Geometry();
		var mat; 

		if(dashed) {
				mat = new THREE.LineDashedMaterial({ linewidth: 1, color: colorHex, dashSize: 2, gapSize: 2 });
		} else {
				mat = new THREE.LineBasicMaterial({ linewidth: 1, color: colorHex });
		}

		geom.vertices.push( src.clone() );
		geom.vertices.push( dst.clone() );
		geom.computeLineDistances(); // This one is SUPER important, otherwise dashed lines will appear as simple plain lines

		var generatedObject = new THREE.Line( geom, mat, THREE.LinePieces );
		
		return generatedObject;
		
	};

	that.getPctower = function(datasetId, visId, visName, lookAndFeel, castShadow, receiveShadow, callback, connectionObj) {

		var size = lookAndFeel.getSize();
		
		if (size == undefined || size == null) {
			size = 1.0;
		}
		
		if (ModelRepositoryModelCache["data/objects/pctower/pctower.obj"] == undefined || ModelRepositoryModelCache["data/objects/pctower/pctower.obj"] == null) {
			var loader = new THREE.OBJMTLLoader();
			loader.load("data/objects/pctower/pctower.obj", "data/objects/pctower/pctower.mtl", function (generatedObject) {
				ModelRepositoryModelCache["data/objects/pctower/pctower.obj"] = generatedObject.clone();
				generatedObject.scale.set(size, size, size);
				that.offsetScaleRotate(generatedObject, new THREE.Vector3(-25.0, -4.0, -7.0), new THREE.Vector3(0.004, 0.004, 0.004), new THREE.Vector3(0.0, 1.0, 0.0), Math.PI);
				that.applyMaterialAndTexture(generatedObject, datasetId, visId, visName, null, null, lookAndFeel, castShadow, receiveShadow, callback, connectionObj);
			} );	
		} else {
			var generatedObject = ModelRepositoryModelCache["data/objects/pctower/pctower.obj"].clone();
			generatedObject.scale.set(size, size, size);
			that.offsetScaleRotate(generatedObject, new THREE.Vector3(-25.0, -4.0, -7.0), new THREE.Vector3(0.004, 0.004, 0.004), new THREE.Vector3(0.0, 1.0, 0.0), Math.PI);
			that.applyMaterialAndTexture(generatedObject, datasetId, visId, visName, null, null, lookAndFeel, castShadow, receiveShadow, callback, connectionObj);
		}

	};

	that.getPilotFishUAV = function(datasetId, visId, visName, lookAndFeel, castShadow, receiveShadow, callback, connectionObj) {

		var generatedObject = null;

		var size = lookAndFeel.getSize();
		
		if (size == undefined || size == null) {
			size = 1.0;
		}
		
		if (ModelRepositoryModelCache["data/objects/pilotfishuav/PilotFish_UAV.obj"] == undefined || ModelRepositoryModelCache["data/objects/pilotfishuav/PilotFish_UAV.obj"] == null) {
			var loader = new THREE.OBJMTLLoader();
			loader.load("data/objects/pilotfishuav/PilotFish_UAV.obj", "data/objects/pilotfishuav/PilotFish_UAV.mtl", function (generatedObject) {
				ModelRepositoryModelCache["data/objects/pilotfishuav/PilotFish_UAV.obj"] = generatedObject.clone();
				generatedObject.scale.set(size, size, size);
				that.offsetScaleRotate(generatedObject, new THREE.Vector3(0.0, 0.0, 1.0), new THREE.Vector3(0.25, 0.25, 0.25), new THREE.Vector3(-1.0, 0.0, 0.0), Math.PI/2.0);		
				that.applyMaterialAndTexture(generatedObject, datasetId, visId, visName, null, null, lookAndFeel, castShadow, receiveShadow, callback, connectionObj);
			} );
		} else {
			var generatedObject = ModelRepositoryModelCache["data/objects/pilotfishuav/PilotFish_UAV.obj"].clone();
			generatedObject.scale.set(size, size, size);
			that.offsetScaleRotate(generatedObject, new THREE.Vector3(0.0, 0.0, 1.0), new THREE.Vector3(0.25, 0.25, 0.25), new THREE.Vector3(-1.0, 0.0, 0.0), Math.PI/2.0);		
			that.applyMaterialAndTexture(generatedObject, datasetId, visId, visName, null, null, lookAndFeel, castShadow, receiveShadow, callback, connectionObj);
		}
		
	};

	that.getSpiderman = function(datasetId, visId, visName, lookAndFeel, castShadow, receiveShadow, callback, connectionObj) {

		var size = lookAndFeel.getSize();
		
		if (size == undefined || size == null) {
			size = 1.0;
		}
				
		if (ModelRepositoryModelCache["data/objects/spiderman/spiderman.obj"] == undefined || ModelRepositoryModelCache["data/objects/spiderman/spiderman.obj"] == null) {
			var loader = new THREE.OBJMTLLoader();
			loader.load("data/objects/spiderman/spiderman.obj", "data/objects/spiderman/spiderman.mtl", function (generatedObject) {
				ModelRepositoryModelCache["data/objects/spiderman/spiderman.obj"] = generatedObject.clone();
				generatedObject.scale.set(size, size, size);
				that.offsetScaleRotate(generatedObject, new THREE.Vector3(0.0, -10.0, 0.0), new THREE.Vector3(0.05, 0.05, 0.05), new THREE.Vector3(0.0, 1.0, 0.0), Math.PI/2.0);
				that.applyMaterialAndTexture(generatedObject, datasetId, visId, visName, null, null, lookAndFeel, castShadow, receiveShadow, callback, connectionObj);
			} );
		} else {
			var generatedObject = ModelRepositoryModelCache["data/objects/spiderman/spiderman.obj"].clone();
			generatedObject.scale.set(size, size, size);
			that.offsetScaleRotate(generatedObject, new THREE.Vector3(0.0, -10.0, 0.0), new THREE.Vector3(0.05, 0.05, 0.05), new THREE.Vector3(0.0, 1.0, 0.0), Math.PI/2.0);
			that.applyMaterialAndTexture(generatedObject, datasetId, visId, visName, null, null, lookAndFeel, castShadow, receiveShadow, callback, connectionObj);
		}
		
	};

	that.getTrafficCone = function(datasetId, visId, visName, lookAndFeel, castShadow, receiveShadow, callback, connectionObj) {

		var generatedObject = null;

		var size = lookAndFeel.getSize();
		
		if (size == undefined || size == null) {
			size = 1.0;
		}
		
		if (ModelRepositoryModelCache["data/objects/cone/cone1.obj"] == undefined || ModelRepositoryModelCache["data/objects/cone/cone1.obj"] == null) {
			var loader = new THREE.OBJMTLLoader();
			loader.load("data/objects/cone/cone1.obj", "data/objects/cone/cone1.mtl", function (generatedObject) {		
				ModelRepositoryModelCache["data/objects/cone/cone1.obj"] = generatedObject.clone();
				generatedObject.scale.set(size, size, size);
				that.offsetScaleRotate(generatedObject, new THREE.Vector3(0, 0, 0), new THREE.Vector3(0.05, 0.05, 0.05), new THREE.Vector3(0.0, 1.0, 0.0), 0.0);		
				that.applyMaterialAndTexture(generatedObject, datasetId, visId, visName, null, null, lookAndFeel, castShadow, receiveShadow, callback, connectionObj);
			} );
		} else {
			var generatedObject = ModelRepositoryModelCache["data/objects/cone/cone1.obj"].clone();
			generatedObject.scale.set(size, size, size);
			that.offsetScaleRotate(generatedObject, new THREE.Vector3(0, 0, 0), new THREE.Vector3(0.05, 0.05, 0.05), new THREE.Vector3(0.0, 1.0, 0.0), 0.0);		
			that.applyMaterialAndTexture(generatedObject, datasetId, visId, visName, null, null, lookAndFeel, castShadow, receiveShadow, callback, connectionObj);
		}
		
	};

	that.getTriangle = function(datasetId, visId, visName, lookAndFeel, castShadow, receiveShadow, callback, connectionObj) {

		var size = lookAndFeel.getSize();
		
		if (size == undefined || size == null) {
			size = 1.0;
		}

		var geometry = new THREE.Geometry();
		var v1 = new THREE.Vector3(-size/2, -size/2, 0);
		var v2 = new THREE.Vector3(0, size/2, 0);
		var v3 = new THREE.Vector3(size/2, -size/2, 0);

		geometry.vertices.push(v1);
		geometry.vertices.push(v2);
		geometry.vertices.push(v3);

		geometry.faces.push( new THREE.Face3( 0, 1, 2 ) );
		geometry.computeFaceNormals();

		var material = new THREE.MeshPhongMaterial({ ambient: 0xdddddd, color: 0xdddddd, specular: 0x555555, shininess: 5, shading: THREE.FlatShading });
		material.side = THREE.DoubleSide;
		var generatedObject = new THREE.Mesh( geometry, material );
		that.offsetScaleRotate(generatedObject, new THREE.Vector3(0, 0, 0), new THREE.Vector3(1.0, 1.0, 1.0), new THREE.Vector3(0.0, 1.0, 0.0), 0.0);
		
		that.applyMaterialAndTexture(generatedObject, datasetId, visId, visName, null, null, lookAndFeel, castShadow, receiveShadow, callback, connectionObj);
			
	};

	that.getCube = function(datasetId, visId, visName, lookAndFeel, castShadow, receiveShadow, callback, connectionObj) {

		var size = lookAndFeel.getSize();
		
		if (size == undefined || size == null) {
			size = 1.0;
		}

		var geometry = new THREE.BoxGeometry(size, size, size);
		var material = new THREE.MeshPhongMaterial({ ambient: 0xdddddd, color: 0xdddddd, specular: 0x555555, shininess: 5, shading: THREE.FlatShading });
		//var material = new THREE.MeshLambertMaterial({ color: 0x030303, wireframe : useWireframe});
		var generatedObject = new THREE.Mesh( geometry, material );
		that.offsetScaleRotate(generatedObject, new THREE.Vector3(0, 0, 0), new THREE.Vector3(1.0, 1.0, 1.0), new THREE.Vector3(0.0, 1.0, 0.0), 0.0);
		
		that.applyMaterialAndTexture(generatedObject, datasetId, visId, visName, null, null, lookAndFeel, castShadow, receiveShadow, callback, connectionObj);

	};

	that.getTetrahedron = function(datasetId, visId, visName, lookAndFeel, castShadow, receiveShadow, callback, connectionObj) {

		var size = lookAndFeel.getSize();
		
		if (size == undefined || size == null) {
			size = 1.0;
		}

		var geometry = new THREE.TetrahedronGeometry(size);
		var material = new THREE.MeshPhongMaterial({ ambient: 0xdddddd, color: 0xdddddd, specular: 0x555555, shininess: 5, shading: THREE.FlatShading });
		//var material = new THREE.MeshLambertMaterial({ color: 0x030303, wireframe : useWireframe});
		var generatedObject = new THREE.Mesh( geometry, material );
		that.offsetScaleRotate(generatedObject, new THREE.Vector3(0, 0, 0), new THREE.Vector3(1.0, 1.0, 1.0), new THREE.Vector3(0.0, 1.0, 0.0), 0.0);
		
		that.applyMaterialAndTexture(generatedObject, datasetId, visId, visName, null, null, lookAndFeel, castShadow, receiveShadow, callback, connectionObj);

	};

	that.getIcosahedron = function(datasetId, visId, visName, lookAndFeel, castShadow, receiveShadow, callback, connectionObj) {

		var size = lookAndFeel.getSize();
		
		if (size == undefined || size == null) {
			size = 1.0;
		}

		var geometry = new THREE.IcosahedronGeometry(size);
		var material = new THREE.MeshPhongMaterial({ ambient: 0xdddddd, color: 0xdddddd, specular: 0x555555, shininess: 5, shading: THREE.FlatShading });
		//var material = new THREE.MeshLambertMaterial({ color: 0x030303, wireframe : useWireframe});
		var generatedObject = new THREE.Mesh( geometry, material );
		that.offsetScaleRotate(generatedObject, new THREE.Vector3(0, 0, 0), new THREE.Vector3(1.0, 1.0, 1.0), new THREE.Vector3(0.0, 1.0, 0.0), 0.0);
		
		that.applyMaterialAndTexture(generatedObject, datasetId, visId, visName, null, null, lookAndFeel, castShadow, receiveShadow, callback, connectionObj);

	};

	that.getOctahedron = function(datasetId, visId, visName, lookAndFeel, castShadow, receiveShadow, callback, connectionObj) {

		var size = lookAndFeel.getSize();
		
		if (size == undefined || size == null) {
			size = 1.0;
		}

		var geometry = new THREE.OctahedronGeometry(size);
		var material = new THREE.MeshPhongMaterial({ ambient: 0xdddddd, color: 0xdddddd, specular: 0x555555, shininess: 5, shading: THREE.FlatShading });
		//var material = new THREE.MeshLambertMaterial({ color: 0x030303, wireframe : useWireframe});
		var generatedObject = new THREE.Mesh( geometry, material );
		that.offsetScaleRotate(generatedObject, new THREE.Vector3(0, 0, 0), new THREE.Vector3(1.0, 1.0, 1.0), new THREE.Vector3(0.0, 1.0, 0.0), 0.0);

		that.applyMaterialAndTexture(generatedObject, datasetId, visId, visName, null, null, lookAndFeel, castShadow, receiveShadow, callback, connectionObj);

	};

	that.getCone = function(datasetId, visId, visName, lookAndFeel, castShadow, receiveShadow, callback, connectionObj) {

		var size = lookAndFeel.getSize();
		
		if (size == undefined || size == null) {
			size = 1.0;
		}

		var geometry = new THREE.CylinderGeometry(size, 0, 3.0, 20, 1.0, false); //radiusTop, radiusBottom, height, segmentsRadius, segmentsHeight, openEnded
		var material = new THREE.MeshPhongMaterial({ ambient: 0xdddddd, color: 0xdddddd, specular: 0x555555, shininess: 5, shading: THREE.FlatShading });
		//var material = new THREE.MeshLambertMaterial({ color: 0x030303, wireframe : useWireframe});

		var generatedObject = new THREE.Mesh(geometry,material);
		that.offsetScaleRotate(generatedObject, new THREE.Vector3(0, 0, 0), new THREE.Vector3(1.0, 1.0, 1.0), new THREE.Vector3(0.0, 1.0, 0.0), 0.0);
		
		that.applyMaterialAndTexture(generatedObject, datasetId, visId, visName, null, null, lookAndFeel, castShadow, receiveShadow, callback, connectionObj);

	};

	that.getArrowHead = function(datasetId, visId, visName, lookAndFeel, castShadow, receiveShadow, callback, connectionObj) {

		var size = lookAndFeel.getSize();
		
		if (size == undefined || size == null) {
			size = 1.0;
		}

		var geometry = new THREE.CylinderGeometry(size/4.0, size, 1.0, 20, 1.0, false); //radiusTop,` radiusBottom, height, segmentsRadius, segmentsHeight, openEnded
		var material = new THREE.MeshPhongMaterial({ ambient: 0xdddddd, color: 0xdddddd, specular: 0x555555, shininess: 5, shading: THREE.FlatShading });
		//var material = new THREE.MeshLambertMaterial({ color: 0x030303, wireframe : useWireframe});

		var generatedObject = new THREE.Mesh(geometry,material);
		that.offsetScaleRotate(generatedObject, new THREE.Vector3(0, 0, 0), new THREE.Vector3(1.0, 1.0, 1.0), new THREE.Vector3(0.0, 1.0, 0.0), 0.0);
		
		that.applyMaterialAndTexture(generatedObject, datasetId, visId, visName, null, null, lookAndFeel, castShadow, receiveShadow, callback, connectionObj);

	};

	that.getSphere = function(datasetId, visId, visName, lookAndFeel, castShadow, receiveShadow, callback, connectionObj) {

		var size = lookAndFeel.getSize();
		
		if (size == undefined || size == null) {
			size = 1.0;
		}

		var geometry = new THREE.SphereGeometry(size*5/6, 32, 32);
		var material = new THREE.MeshPhongMaterial({ ambient: 0xdddddd, color: 0xdddddd, specular: 0x555555, shininess: 5, shading: THREE.FlatShading });
		//var material = new THREE.MeshLambertMaterial({ color: 0x030303, wireframe : useWireframe});
		var generatedObject = new THREE.Mesh( geometry, material );
		that.offsetScaleRotate(generatedObject, new THREE.Vector3(0, 0, 0), new THREE.Vector3(1.0, 1.0, 1.0), new THREE.Vector3(0.0, 1.0, 0.0), 0.0);

		that.applyMaterialAndTexture(generatedObject, datasetId, visId, visName, null, null, lookAndFeel, castShadow, receiveShadow, callback, connectionObj);

	};
	
	
	that.getTube = function(datasetId, visId, visName, lookAndFeel, castShadow, receiveShadow, callback, connectionObj) {

		var size = lookAndFeel.getSize();
		//var colors = [0x33e8ff, 0x99C0A2, 0xFF9845, 0xb841c2, 0x3338ff, 0xc75c66];
		//var colors = [0x33e8ff, 0x33e8ff, 0x33e8ff, 0x33e8ff, 0x33e8ff, 0x33e8ff];
		var colors = [0xffcccc, 0xffaaaa, 0xff8080, 0xff5050, 0xff2222, 0xff0000];
		var flags = lookAndFeel.getMetaData().flags;
		var segmentCount = 30;
		//var densities = [10, 20, 30, 40, 50, 60];
		var densities = [50, 50, 50, 50, 50, 50];

		if (size == undefined || size == null) {
			size = 1.0;
		}
		
		size *= 2.0;
		
		var metaData = lookAndFeel.getMetaData();
		var levels = metaData.levels;
		//levels = [1.0, 1.0, 1.0, 1.0, 1.0, 1.0];
		
		var tempGeometry = new THREE.CylinderGeometry(0.0, 0.0, 0.0, segmentCount, 1.0, false); //radiusTop, radiusBottom, height, segmentsRadius, segmentsHeight, openEnded
		var tempMaterial = new THREE.MeshPhongMaterial({ ambient: 0xFFFFFF, color: 0xFFFFFF, specular: 0x555555, shininess: 5, shading: THREE.FlatShading });
		
		var generatedObject = new THREE.Mesh(tempGeometry, tempMaterial);
		
		for	(index = 0; index < levels.length; index++) {
			var geometry = new THREE.CylinderGeometry(Math.max(levels[index]*2.0, 0.05), Math.max(levels[index]*2.0, 0.05), size/6.0, densities[index], 1.0, false); //radiusTop, radiusBottom, height, segmentsRadius, segmentsHeight, openEnded
			
			var material = new THREE.MeshPhongMaterial({ ambient: colors[index], color: colors[index], specular: 0x555555, shininess: 5, shading: THREE.FlatShading });
			
			if (!flags[index]) {
				material = new THREE.MeshPhongMaterial({ ambient: 0xFFFFFF, color: 0xFFFFFF, specular: 0x555555, shininess: 5, shading: THREE.FlatShading });
			}
			
			var newMesh = new THREE.Mesh(geometry, material);

			that.offsetScaleRotate(newMesh, new THREE.Vector3(0, size/6.0*(levels.length-1-index), 0), new THREE.Vector3(1.0, 1.0, 1.0), new THREE.Vector3(0.0, 1.0, 0.0), 0.0);
			
			generatedObject.add(newMesh);
		}
						
		that.offsetScaleRotate(generatedObject, new THREE.Vector3(0, -size/2.0+size/3.0, 0), new THREE.Vector3(1.0, 1.0, 1.0), new THREE.Vector3(1.0, 0.0, 0.0), 0);
		
		that.applyMaterialAndTexture(generatedObject, datasetId, visId, visName, null, null, lookAndFeel, castShadow, receiveShadow, callback, connectionObj, false);

	};
	
	that.getSpherePrism = function(datasetId, visId, visName, lookAndFeel, castShadow, receiveShadow, callback, connectionObj) {

		console.log("HERE");
		var size = lookAndFeel.getSize();
		
		if (size == undefined || size == null) {
			size = 1.0;
		}

		var geometry = new THREE.CylinderGeometry(size/2.0, size/2.0, size, 6, 1.0, false); //radiusTop, radiusBottom, height, segmentsRadius, segmentsHeight, openEnded
		var material = new THREE.MeshPhongMaterial({ ambient: 0xdddddd, color: 0xdddddd, specular: 0x555555, shininess: 5, shading: THREE.FlatShading });
		//var material = new THREE.MeshLambertMaterial({ color: 0x030303, wireframe : useWireframe});
		var generatedObject = new THREE.Mesh( geometry, material );
		that.offsetScaleRotate(generatedObject, new THREE.Vector3(0, 0, 0), new THREE.Vector3(1.0, 1.0, 1.0), new THREE.Vector3(0.0, 1.0, 0.0), 0.0);

		that.applyMaterialAndTexture(generatedObject, datasetId, visId, visName, null, null, lookAndFeel, castShadow, receiveShadow, callback, connectionObj);

	};

	that.getLine = function(datasetId, visId, visName, sourceId, targetId, sourcePosition, targetPosition, lookAndFeel, castShadow, receiveShadow, callback) {

		if (sourcePosition == undefined || sourcePosition == null) {
			sourcePosition = -1.0;
		}

		if (targetPosition == undefined || targetPosition == null) {
			targetPosition = 1.0;
		}

		var geometry = new THREE.Geometry();
		geometry.vertices.push(new THREE.Vector3(0.0, -0.5, 0.0));
		geometry.vertices.push(new THREE.Vector3(0.0, 0.5, 0.0));
		var material = new THREE.LineBasicMaterial({color: 0xdddddd, linewidth: 1.0,  fog: true});
		//var material = new THREE.MeshLambertMaterial({ color: 0x030303, wireframe : useWireframe});

		var HALF_PI = Math.PI * .5;
		var distance = sourcePosition.distanceTo(targetPosition);
		
		var generatedObject = new THREE.Line(geometry, material);

		generatedObject.position = new THREE.Vector3((sourcePosition.x+targetPosition.x)/2.0, (sourcePosition.y+targetPosition.y)/2.0, (sourcePosition.z+targetPosition.z)/2.0);
		
		var matrix = new THREE.Matrix4();
		var up = new THREE.Vector3( 0, 1, 0 );
		var axis = new THREE.Vector3( );

		var tangent = new THREE.Vector3(targetPosition.x - sourcePosition.x, targetPosition.y - sourcePosition.y, targetPosition.z - sourcePosition.z);
		tangent = tangent.normalize();
		axis.crossVectors( up, tangent ).normalize();
		var radians = Math.acos( up.dot( tangent ) );
		generatedObject.quaternion.setFromAxisAngle( axis, radians );

		generatedObject.sourcePosition = sourcePosition;
		generatedObject.targetPosition = targetPosition;

		that.offsetScaleRotate(generatedObject, new THREE.Vector3(0, 0, 0), new THREE.Vector3(1.0, 1.0, 1.0), new THREE.Vector3(0.0, 1.0, 0.0), 0.0);

		that.applyMaterialAndTexture(generatedObject, datasetId, visId, visName, sourceId, targetId, lookAndFeel, castShadow, receiveShadow, callback);

	};

	that.getCylinder = function(datasetId, visId, visName, sourceId, targetId, sourcePosition, targetPosition, lookAndFeel, castShadow, receiveShadow, callback) {

		var size = lookAndFeel.getSize();
		
		if (size == undefined || size == null) {
			size = 1.0;
		}

		if (sourcePosition == undefined || sourcePosition == null) {
			sourcePosition = new THREE.Vector3(-0.5, -0.5, -0.5);
		}

		if (targetPosition == undefined || targetPosition == null) {
			targetPosition = new THREE.Vector3(0.5, 0.5, 0.5);
		}

		var material = new THREE.MeshPhongMaterial({ ambient: 0xdddddd, color: 0xdddddd, specular: 0x555555, shininess: 5, shading: THREE.FlatShading });
		//var material = new THREE.MeshLambertMaterial({ color: 0x030303, wireframe : useWireframe});

		var HALF_PI = Math.PI * .5;
		var distance = sourcePosition.distanceTo(targetPosition);
		
		var cylinder = new THREE.CylinderGeometry(size, size, 1.0, 6, 1.0, false); //radiusTop, radiusBottom, height, segmentsRadius, segmentsHeight, openEnded
		
		var generatedObject = new THREE.Mesh(cylinder,material);

		generatedObject.position = sourcePosition;
		
		var matrix = new THREE.Matrix4();
		var up = new THREE.Vector3( 0, 1, 0 );
		var axis = new THREE.Vector3( );

		var tangent = new THREE.Vector3(targetPosition.x - sourcePosition.x, targetPosition.y - sourcePosition.y, targetPosition.z - sourcePosition.z);
		tangent = tangent.normalize();
		axis.crossVectors( up, tangent ).normalize();
		var radians = Math.acos( up.dot( tangent ) );
		generatedObject.quaternion.setFromAxisAngle( axis, radians );
		
		generatedObject.sourcePosition = sourcePosition;
		generatedObject.targetPosition = targetPosition;
		
		that.offsetScaleRotate(generatedObject, new THREE.Vector3(0, 0, 0), new THREE.Vector3(1.0, 1.0, 1.0), axis, radians);
		
		that.applyMaterialAndTexture(generatedObject, datasetId, visId, visName, sourceId, targetId, lookAndFeel, castShadow, receiveShadow, callback);

	};

	that.makeLabelSprite = function (labelText, borderColor, backgroundColor, layoutScale, objectScale) {

		var contrastColor = that.getBestFontColor(backgroundColor);
		return that.makeTextSprite(labelText, layoutScale, objectScale, { fontsize: 24, borderColor: {r:borderColor[0], g:borderColor[1], b:borderColor[2], a:borderColor[3]}, backgroundColor: {r:backgroundColor[0], g:backgroundColor[1], b:backgroundColor[2], a:backgroundColor[3]}, fontColor: {r:contrastColor[0], g:contrastColor[1], b:contrastColor[2], a:1.0} });

	};

	that.makeTextSprite = function (message, layoutScale, objectScale, parameters) {
		
		if ( parameters === undefined ) parameters = {};
		
		var fontface = parameters.hasOwnProperty("fontface") ? 
			parameters["fontface"] : "Arial";
		
		var fontsize = parameters.hasOwnProperty("fontsize") ? 
			parameters["fontsize"] : 36;
		
		var fontColor  = parameters.hasOwnProperty("fontColor") ? 
			parameters["fontColor"] : { r:0, g:0, b:0, a:1.0 };
			
		var borderThickness = parameters.hasOwnProperty("borderThickness") ? 
			parameters["borderThickness"] : 16;
		
		var borderColor = parameters.hasOwnProperty("borderColor") ?
			parameters["borderColor"] : { r:0, g:0, b:0, a:1.0 };
		
		var backgroundColor = parameters.hasOwnProperty("backgroundColor") ?
			parameters["backgroundColor"] : { r:255, g:255, b:255, a:1.0 };
			
		var canvas = document.createElement('canvas');

		canvas.width = 2000;
		canvas.height = 100;
		var context = canvas.getContext('2d');
		context.font = "Bold " + fontsize + "px " + fontface;
		
		// get size data (height depends only on font size)
		var metrics = context.measureText( message );
		var textWidth = metrics.width;

		canvas = document.createElement('canvas');
		canvas.width = (textWidth + borderThickness * 2+objectScale*50)*2;
		canvas.height = (fontsize * 1.4 + borderThickness * 2);
		context = canvas.getContext('2d');
		context.font = "Bold " + fontsize + "px " + fontface;
		context.lineWidth = borderThickness;

		// border color
		context.strokeStyle = "rgba(" + borderColor.r + "," + borderColor.g + ","
									  + borderColor.b + "," + borderColor.a + ")";

		// background color-
		context.fillStyle   = "rgba(" + borderColor.r + "," + borderColor.g + ","
									  + borderColor.b + "," + borderColor.a + ")";

		that.roundRect(context, borderThickness/2.0, borderThickness/2.0, textWidth+borderThickness, fontsize * 1.4+borderThickness, 6);
								
		// background color-
		context.fillStyle   = "rgba(" + backgroundColor.r + "," + backgroundColor.g + ","
									  + backgroundColor.b + "," + backgroundColor.a + ")";
								
		that.roundRect(context, borderThickness, borderThickness, textWidth, fontsize * 1.4, 6);
		// 1.4 is extra height factor for text below baseline: g,j,p,q.
		
		// text color
		context.fillStyle = "rgba(" + fontColor.r + "," + fontColor.g + ","
									  + fontColor.b + "," + fontColor.a + ")";

		context.fillText( message, borderThickness, fontsize + borderThickness);
		
		// canvas contents will be used for a texture
		var texture = new THREE.Texture(canvas) 
		texture.needsUpdate = true;

		var xOffsetValue = 0.5 + (objectScale*25)/(canvas.width);
		var yOffsetValue = 0.0;
		var spriteMaterial = new THREE.SpriteMaterial({map: texture, useScreenCoordinates: true});
		spriteMaterial.map.offset.set(-1.0*xOffsetValue, yOffsetValue);
		
		var sprite = new THREE.Sprite(spriteMaterial);
		sprite.type = "Label";
		sprite.scale.set(canvas.width/canvas.height*layoutScale, layoutScale, 1.0);
		
		sprite.labelText = message; 
		sprite.width = textWidth + borderThickness * 2;
		sprite.height = fontsize * 1.4 + borderThickness * 2;
					
		return sprite;	
		
	};
	
	that.roundRect = function (ctx, x, y, w, h, r) {

		ctx.moveTo(x+r, y);
		ctx.beginPath();
		ctx.lineTo(x+w-r, y);
		ctx.quadraticCurveTo(x+w, y, x+w, y+r);
		ctx.lineTo(x+w, y+h-r);
		ctx.quadraticCurveTo(x+w, y+h, x+w-r, y+h);
		ctx.lineTo(x+r, y+h);
		ctx.quadraticCurveTo(x, y+h, x, y+h-r);
		ctx.lineTo(x, y+r);
		ctx.quadraticCurveTo(x, y, x+r, y);
		ctx.closePath();
		ctx.fill();
//		ctx.stroke();   
		
	};

	that.getCompoundBoundingSphere = function (obj) {
		var box = null;
		if (obj.children.length > 0) {
			obj.traverse(function (childObj) {
				var geometry = childObj.geometry;
				if (geometry === undefined) return;
				geometry.computeBoundingBox();
				if (box === null) {
					box = geometry.boundingBox;
				} else {
					box.union(geometry.boundingBox);
				}
			});
			return new THREE.SphereGeometry(box.getBoundingSphere().radius, 32, 32);
		} else {
			return new THREE.SphereGeometry(childObj.geometry.boundingBox.getBoundingSphere().radius, 32, 32);
		}
	};

	that.getOutlineMesh = function (obj, forConnection) { 

		var outlineMaterial = new THREE.MeshBasicMaterial({
			color : 0x00FFFF,
			side : THREE.BackSide,
			opacity : 1.0
		});

		var outlineGeometry = new THREE.Geometry();
		 if (obj.geometry != undefined && obj.geometry != null) {
			if (obj instanceof THREE.Line) {
				outlineGeometry = new THREE.CylinderGeometry(0.2, 0.2, 1.0, 6, 1.0, false);
			} else {
				outlineGeometry.merge(obj.geometry);
			}
		}
		
		for (var index = 0; index < obj.children.length; index++) {
			var child = obj.children[index];
			outlineGeometry.merge(that.getOutlineMesh(child).geometry);
		}

		var outlineMesh = new THREE.Mesh(outlineGeometry, outlineMaterial);
		
		outlineMesh.name = obj.name+"_highlight";
		outlineMesh.castShadow = false;
		outlineMesh.receiveShadow = false;
		outlineMesh.visible = false;

		outlineMesh.position = obj.position;
		
		var outlineOffset = new THREE.Vector3(-obj.offset.x, -obj.offset.y, -obj.offset.z);
		that.offsetScaleRotate(outlineMesh, outlineOffset, new THREE.Vector3(1.0, 1.0, 1.0), obj.orientationOffsetAxis, 0.0);
		outlineOffset = new THREE.Vector3(0.0, 0.0, 0.0);
		that.offsetScaleRotate(outlineMesh, outlineOffset, new THREE.Vector3(1.0, 1.0, 1.0), obj.orientationOffsetAxis, obj.orientationOffsetAngle);
		outlineOffset = new THREE.Vector3(obj.offset.x*1.1, obj.offset.y*1.1, obj.offset.z*1.1);
		that.offsetScaleRotate(outlineMesh, outlineOffset, new THREE.Vector3(1.0, 1.0, 1.0), obj.orientationOffsetAxis, 0.0);

		if (obj.scale != undefined && obj.scale != null) {
			outlineMesh.scale.set(obj.scale.x, obj.scale.y, obj.scale.z);
			if (forConnection) {
				outlineMesh.scale.x *= 10;
				outlineMesh.scale.y *= 1.0;
				outlineMesh.scale.z *= 10;
			} else {
				outlineMesh.scale.x *= 1.3;
				outlineMesh.scale.y *= 1.3;
				outlineMesh.scale.z *= 1.3;
			}
		} 
			
		return outlineMesh;
		
	};

	that.getConnectionSelectionMesh = function (obj) {
		var selectionGeometry = new THREE.Geometry();
		 if (obj.geometry != undefined && obj.geometry != null) {
			if (obj instanceof THREE.Line) {
				selectionGeometry = new THREE.CylinderGeometry(0.2, 0.2, 1.0, 6, 1.0, false);
			} else {
				selectionGeometry.merge(obj.geometry);
			}
		}

		var selectionMaterial = new THREE.MeshBasicMaterial( { color: 0xffff00 } );
		var selectionMesh = new THREE.Mesh(selectionGeometry, selectionMaterial);
		selectionMesh.name = obj.name;
		selectionMesh.position = obj.position;
		selectionMesh.visible = false;
			
		if (obj.scale != undefined && obj.scale != null) {
			selectionMesh.scale.set(obj.scale.x, obj.scale.y, obj.scale.z);
		}
			
		that.offsetScaleRotate(selectionMesh, new THREE.Vector3(0.0, 0.0, 0.0), new THREE.Vector3(1.0, 1.0, 1.0), obj.orientationOffsetAxis, obj.orientationOffsetAngle);
		
		/*
		for (var index = 0; index < obj.children.length; index++) {
			var child = obj.children[index];
			selectionGeometry.merge(that.getSelectionMesh(child).geometry);
		}
		*/
			
		return selectionMesh;
	};
	
	that.getSelectionMesh = function (obj) { 

		var selectionGeometry = new THREE.Geometry();
		 if (obj.geometry != undefined && obj.geometry != null) {
			selectionGeometry.merge(obj.geometry);
		}

		var selectionMaterial = new THREE.MeshBasicMaterial( { color: 0xffff00 } );
		var selectionMesh = new THREE.Mesh(selectionGeometry, selectionMaterial);
		selectionMesh.name = obj.name;
		selectionMesh.position = obj.position;
		selectionMesh.visible = false;
			
		if (obj.scale != undefined && obj.scale != null) {
			selectionMesh.scale.set(obj.scale.x, obj.scale.y, obj.scale.z);
		}
			
		that.offsetScaleRotate(selectionMesh, new THREE.Vector3(0.0, 0.0, 0.0), new THREE.Vector3(1.0, 1.0, 1.0), obj.orientationOffsetAxis, obj.orientationOffsetAngle);
		
		for (var index = 0; index < obj.children.length; index++) {
			var child = obj.children[index];
			selectionGeometry.merge(that.getSelectionMesh(child).geometry);
		}
		
		return selectionMesh;

	};

	that.rotateAroundObjectAxis = function (obj, axis, radians) {

		if (axis != undefined && axis != null  && obj.matrix != undefined && obj.matrix != null) {
			var rotObjectMatrix = new THREE.Matrix4();
			rotObjectMatrix.makeRotationAxis(axis.normalize(), radians);
			obj.matrix.multiply(rotObjectMatrix);
			obj.rotation.setFromRotationMatrix(obj.matrix);
		}
			
	};
	
	that.offsetScaleRotate = function (obj, offset, scaleMultiplier, rotationVector, rotationAngle) {

		if (obj.geometry != undefined && obj.geometry != null) {
			var objGeometry = obj.geometry;
			for(var i = 0 ; i < objGeometry.vertices.length; i++) {
				var objVertices = objGeometry.vertices;
				objVertices[i].x += offset.x;
				objVertices[i].y += offset.y;
				objVertices[i].z += offset.z;
			}
		}
		obj.offset = offset;
		obj.orientationOffsetAxis = rotationVector;
		obj.orientationOffsetAngle = rotationAngle;
		obj.scaleMultiplier = scaleMultiplier;

		if (obj.scale != undefined && obj.scale != null) {
			obj.scale.set(obj.scale.x*scaleMultiplier.x, obj.scale.y*scaleMultiplier.y, obj.scale.z*scaleMultiplier.z);
		} else {
			obj.scale.set(scaleMultiplier.x, scaleMultiplier.y, scaleMultiplier.z);
		}
		
		that.rotateAroundObjectAxis(obj, rotationVector, rotationAngle);

		if (obj.children != undefined && obj.children != null) {
			for (var index = 0; index < obj.children.length; index++) {
				that.offsetScaleRotate(obj.children[index], offset, new THREE.Vector3(1.0, 1.0, 1.0), rotationVector, 0.0);
			}
		}
		
	};

	return {
	
		/* 
			Constructor: ModelRepository

			Constructs a ModelRepository and binds it to a VisualizationSandbox object

			Parameters:

				vs - the VisualizationSandbox object to bind this ModelRepository to
		*/
		constructor : ModelRepository,

		/* 
			Function: getNodeModel

			Gets a node VisualizationObject for given node look-and-feel parameters
		*/
		getNodeModel : that.getNodeModel,

		/* 
			Function: getConnectionModel

			Gets a connection VisualizationObject for given connection look-and-feel parameters
		*/
		getConnectionModel : that.getConnectionModel,
	
		/* 
			Function: makeLabelSprite

			Makes a label sprite for a given label text and look-and-feel parameters
		*/
		makeLabelSprite : that.makeLabelSprite,
		
		/* 
			Function: resetColor

			Resets background, contrast/highlight colors to defaults
		*/
		resetColor : that.resetColor
	}
	
};

//var ModelRepositoryModelCache = {};