var JSLoader = function (callback) {

	var scriptsToBeLoaded = [	"../javascript/utils/gl-matrix.js",  
											"../javascript/utils/jquery-2.0.1.js", 
											"../javascript/utils/springy_3d.js", 	
											"../javascript/utils/webgl-utils.js", 
											"../javascript/utils/leap.js", 
											"../three/examples/js/loaders/OBJLoader.js", 
											"../three/examples/js/loaders/MTLLoader.js", 
											"../three/examples/js/loaders/OBJMTLLoader.js", 
											"../three/examples/js/controls/TrackballControls.js", 
											"../three/examples/js/controls/OrbitControls.js", 
											"../three/examples/js/Mirror.js", 
											"../javascript/utils/formattingutils.js", 
											"../javascript/engine/data.js", 
											"../javascript/engine/layoutmanager.js", 
											"../javascript/layout/forcedirectedlayout.js", 
											"../javascript/layout/randomlayout.js", 
											"../javascript/layout/userdefinedlayout.js", 
											"../javascript/engine/animationmanager.js",
											"../javascript/engine/visualizationobject.js",
											"../javascript/utils/typerepository.js",
											"../javascript/utils/modelrepository.js", 
											"../javascript/engine/visualizationsetup.js", 
											"../javascript/engine/visualizationsandbox.js" ];

	this.loadScripts(scriptsToBeLoaded, callback);

};

JSLoader.prototype.loadScripts = function (scripts, complete) {
	var that = this;
	var loadScript = function( src ) {
		console.log("Loading: " + src + "...");
		var xmlhttp, next;
		if (window.XMLHttpRequest)  {
			xmlhttp = new XMLHttpRequest();
		} else {
			try {
				xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
			} catch(e) {
				return;
			}
		}
		xmlhttp.onreadystatechange = function() {
			if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
		        window.eval.call(window, xmlhttp.responseText);
				next = scripts.shift();
				if ( next ) {
					loadScript(next);
				} else if ( typeof complete == 'function' ) {
					console.log("Finished loading all dependencies.");
					complete();
				}
			}
		};
		xmlhttp.open("GET", src , true);
		xmlhttp.send();
	};
	loadScript( scripts.shift() );		
};