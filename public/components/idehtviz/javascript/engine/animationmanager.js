/** 
 * Class: AnimationManager
 * This class represents that manages execution of animations (scale change, movement, etc.) for VisualizationSandbox VisualizationObjects
  */
var AnimationManager = (function () {
	
	this.scene;
	this.synchronize;

	this.animationOptions;

	this.animationGroups;
	this.lastUpdate;
	this.progress;
		
	this.init = function () {

		this.animationOptions["Scale_Change"] = new Animation(null, "scale", null, null, 1, true, false);
		this.animationOptions["Position_Change"] = new Animation(null, "position", null, null, 1, true, false);

	};

	this.getOptions = function () {
		return this.animationOptions;
	};

	this.makeAnimationGroup = function (animationGroupId, synchronize) {
		this.animationGroups[animationGroupId] = new AnimationGroup(animationGroupId, synchronize, this);
	}; 

	this.getAnimationGroup = function (animationGroupId) {
		return this.animationGroups[animationGroupId];
	}; 

	this.removeAnimationGroup = function (animationGroupId) {
		var animationGroup = this.animationGroups[animationGroupId];
		if (animationGroup != undefined && animationGroup != null) {
			delete animationGroups.animationGroupId;
		}
	}; 

	this.update = function () {

		var newUpdate = Date.now();
		var delta = newUpdate - this.lastUpdate;
		
		this.progress = this.progress + (delta/1000);

		var shouldReset = false;
		if (this.progress >= 1.0) {
			this.progress = 0.0;
			shouldReset = true;
		}
		
		for (var key in this.animationGroups) {
			var animationGroup = this.animationGroups[key];
			if (animationGroup != undefined && animationGroup != null) {
				if (this.synchronize) {
					animationGroup.update(delta, this.progress, shouldReset);
				} else {
					animationGroup.update(delta, null, shouldReset);
				}
			}
		}
		this.lastUpdate = newUpdate;
		
	};

	this.pause = function (animationGroupId, animationId) {
		var animationGroup = this.animationGroups[animationGroupId];
		if (animationGroup != undefined && animationGroup != null) {
			var animation = animationGroup[animationId];
			if (animation != undefined && animation != null) {
				animation.pause();
			}
		}
	};

	this.resume = function (animationGroupId, animationId) {
		var animationGroup = this.animationGroups[animationGroupId];
		if (animationGroup != undefined && animationGroup != null) {
			var animation = animationGroup[animationId];
			if (animation != undefined && animation != null) {
				animation.resume();
			}
		}
	};

	this.reset = function (animationGroupId, animationId) {
		var animationGroup = this.animationGroups[animationGroupId];
		if (animationGroup != undefined && animationGroup != null) {
			var animation = animationGroup[animationId];
			if (animation != undefined && animation != null) {
				animation.reset();
			}
		}
	};
	
	AnimationManager = function (scene, synchronize) {
	
		this.scene = scene;
		this.synchronize = synchronize;
		
		this.animationOptions = {};

		this.animationGroups = {};
		this.lastUpdate = Date.now();
		this.progress = 0.0;

		this.init();

	};

	AnimationManager.prototype = {
	
		constructor : AnimationManager,

		init : this.init,
		getOptions : this.getOptions,

		makeAnimationGroup : this.makeAnimationGroup,
		getAnimationGroup : this.getAnimationGroup,
		removeAnimationGroup : this.removeAnimationGroup,
		update : this.update,
		pause : this.pause,
		resume : this.resume,
		
		reset : this.reset,
				
	};
	
	return AnimationManager;
	
}());

/** 
 * Class: AnimationGroup
 * This class represents a group of VisualizationObjects whose animations can be managed (triggered/stopped) together or synchronized
  */
var AnimationGroup = (function () {

	this.paused;
	
	this.id;
	this.synchronize;
	this.animationManager;
	this.paused;
	this.progress;
	
	this.animations;

	this.addAnimation = function (objectId, animation) {
		animation.animationGroup = this;
		animation.objectId = objectId;
		this.animations[animation.id] = animation;
	};

	this.getAnimation = function (animationId) {
		return this.animations[animationId];
	};

	this.update = function (delta, progress, shouldReset) {

		if (!this.paused) {
		
			var groupShouldReset = false;
			if (progress != undefined && progress != null) {
				this.progress = progress;
				groupShouldReset = shouldReset;
			} else {
				this.progress = this.progress + (delta/1000);
				
				if (this.progress >= 1.0) {
					this.progress = 0.0;
					groupShouldReset = true;
				}
			}
			
			for (var key in this.animations) {
				var animation = this.animations[key];
				if (animation != undefined && animation != null) {
					if (this.synchronize) {
						animation.update(delta, this.progress, groupShouldReset);
					} else {
						animation.update(delta, null, groupShouldReset);
					}
				}
			}
		
		}
		
	};

	this.pause = function () {
		var animation = animationGroup[animationId];
		if (animation != undefined && animation != null) {
			animation.pause();
		}
	};

	this.resume = function () {
		var animation = animationGroup[animationId];
		if (animation != undefined && animation != null) {
			animation.resume();
		}
	};

	this.reset = function () {
		var animation = animationGroup[animationId];
		if (animation != undefined && animation != null) {
			animation.reset();
		}
	};

	AnimationGroup = function (id, synchronize, animationManager) {
	
		this.paused = false;
		
		this.id = id;
		this.synchronize = synchronize;
		this.animationManager = animationManager;
		this.paused = false;
		this.progress = 0.0;
		
		this.animations = {};

	};

	AnimationGroup.prototype = {
	
		constructor : AnimationGroup,

		addAnimation : this.addAnimation,
		getAnimation : this.getAnimation,

		update : this.update,
		pause : this.pause,
		resume : this.resume,
		
		reset : this.reset,
				
	};
	
	return AnimationGroup;
	
}());

/** 
 * Class: Animation
 * This class represents a specific animation that can be executed by any VisualizationObject
  */
var Animation = (function () {
	
	this.id;
	this.objectId;
	this.paused;
	
	this.parameterName;
	this.initialValue;
	this.finalValue;
	this.speedMultiplier;
	this.loop;
	this.shouldReset;
	this.progress;
	this.forward;
	
	this.clone = function () {
		return new Animation(this.id, this.parameterName, this.initialValue, this.finalValue, this.speedMultiplier, this.loop, this.shouldReset);
	};

	this.setId = function (id) {
		this.id = id;
	};

	this.setObjectId = function (objectId) {
		this.objectId = objectId;
	};

	this.setInitialValue = function (initialValue) {
		this.initialValue = initialValue;
	};

	this.setFinalValue = function (finalValue) {
		this.finalValue = finalValue;
	};

	this.update = function (delta, progress, shouldReset) {

		if (!this.paused && !this.animationGroup.paused) {
			
			if (progress != undefined && progress != null) {
				this.progress = progress;
				if (shouldReset) {
					if (this.loop) {
						this.forward = !this.forward;
					} else {
						this.paused = true;
					}
				}
			} else {
				this.progress = this.progress + ((delta/1000)/this.speedMultiplier);
			
				if (this.progress >= 1.0) {
					if (this.loop) {
						this.progress = 0.0;
						this.forward = !this.forward;
					} else {
						this.progress = 1.0;
						this.paused = true;
					}
				}	
			}
			
			var obj = this.animationGroup.animationManager.scene.getObjectByName(this.objectId);
			var parameter = obj[this.parameterName];
			if (this.forward) {
				if (typeof parameter === 'number') {
					parameter = (1.0 - this.progress) * this.initialValue + (this.progress) * this.finalValue;
				} else if (parameter instanceof THREE.Vector3) {
					parameter.x = (1.0 - this.progress) * this.initialValue.x + (this.progress) * this.finalValue.x;
					parameter.y = (1.0 - this.progress) * this.initialValue.y + (this.progress) * this.finalValue.y;
					parameter.z = (1.0 - this.progress) * this.initialValue.z + (this.progress) * this.finalValue.z;
				}
			} else {
				if (typeof parameter === 'number') {
					parameter = (1.0 - this.progress) * this.finalValue + (this.progress) * this.initialValue;
				} else if (parameter instanceof THREE.Vector3) {
					parameter.x = (1.0 - this.progress) * this.finalValue.x + (this.progress) * this.initialValue.x;
					parameter.y = (1.0 - this.progress) * this.finalValue.y + (this.progress) * this.initialValue.y;
					parameter.z = (1.0 - this.progress) * this.finalValue.z + (this.progress) * this.initialValue.z;
				}
			}
		}
		
	};

	this.pause = function () {
		this.paused = true;
	};

	this.resume = function () {
		this.paused = false;
	};

	this.reset = function () {
		this.progress = 0.0;
		this.forward = true;
		var obj = this.animationGroup.animationManager.scene.getObjectByName(this.objectId);
		var parameter = obj[this.parameterName];
		if (typeof parameter === 'number') {
			parameter = this.initialValue;
		} else if (parameter instanceof THREE.Vector3) {
			parameter.x = this.initialValue.x;
			parameter.y = this.initialValue.y;
			parameter.z = this.initialValue.z;
		}
	};

	Animation = function (id, parameterName, initialValue, finalValue, speedMultiplier, loop, shouldReset) {
	
		this.id = id;
		this.objectId = null;
		this.paused = true;
		
		this.parameterName = parameterName;
		this.initialValue = initialValue;
		this.finalValue = finalValue;
		this.speedMultiplier = speedMultiplier;
		this.loop = loop;
		this.shouldReset = shouldReset;
		this.progress = 0.0;
		this.forward = true;

	};

	Animation.prototype = {
	
		constructor : Animation,

		clone : this.clone,
		setId : this.setId,

		setObjectId : this.setObjectId,
		setInitialValue : this.setInitialValue,
		setFinalValue : this.setFinalValue,
		
		update : this.update,
		pause : this.pause,
		resume : this.resume,
		
		reset : this.reset,

	};
	
	return Animation;

}());