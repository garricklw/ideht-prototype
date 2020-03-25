/**
 * @author onurs
 * Class: Utils
 * Contains general utility methods used throughout CyberViz application
 */
 var Utils = function () {
	
};

/* Function: convertRGBAColorToHex
 * Generates and returns a Pseudo UUID
*/
Utils.generateUUID = function () {
	var uuid = "", i, random;
	for (i = 0; i < 32; i++) {
		random = Math.random() * 16 | 0;

		if (i == 8 || i == 12 || i == 16 || i == 20) {
		  uuid += "-"
		}
		uuid += (i == 12 ? 4 : (i == 16 ? (random & 3 | 8) : random)).toString(16);
	}
	return uuid;
};

/* 
	Function: hexToColor
	
	Converts a color hex string to CyberViz specific Color object
 	
	Parameters:

		hex - color hex string
					
	Returns:
		
		Color - CyberViz CommsColor object
*/
function hexToColor(hex) {
  var r = 0;
  var g = 0;
  var b = 0;

  r = parseInt(hex.substring(0,2), 16);
  g = parseInt(hex.substring(2,4), 16);
  b = parseInt(hex.substring(4,6), 16);
  
  return new CommsColor(r, g, b, 1.0);
}

/* 
	Function: colorToHex
	
	Converts a Color object representing an RGB value triplet to a color Hex string
	
	Parameters:

		color - r, g, b color triplet object
					
	Returns:
		
		hex - color hex string
*/
function colorToHex(color) {
   return rgbToHex(color.r)+rgbToHex(color.g)+rgbToHex(color.b);
}

/* 
	Function: rgbToHex
	
	Converts an rgb number value to hexadecimal format
	
	Parameters:

		rgb - rgb value
					
	Returns:
		
		hex - color hex string
*/
function rgbToHex(rgb) { 
  var hex = Number(rgb).toString(16);
  if (hex.length < 2) {
       hex = "0" + hex;
  }
  return hex;
};

/* 
	Function: dragElement
	
	Provides an object wrapper that allows users to drag the wrapped element using it's header
	
	Parameters:

		elmnt - element to make draggable
					
	Returns:
		
		N/A
*/
function dragElement(elmnt) {
	  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
	  if (document.getElementById(elmnt.id + "header")) {
		// if present, the header is where you move the DIV from:
		document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
	  } else {
		// otherwise, move the DIV from anywhere inside the DIV: 
		elmnt.onmousedown = dragMouseDown;
	  }

	  function dragMouseDown(e) {
		e = e || window.event;
		e.preventDefault();
		// get the mouse cursor position at startup:
		pos3 = e.clientX;
		pos4 = e.clientY;
		document.onmouseup = closeDragElement;
		// call a function whenever the cursor moves:
		document.onmousemove = elementDrag;
	  }

	  function elementDrag(e) {
		e = e || window.event;
		e.preventDefault();
		// calculate the new cursor position:
		pos1 = pos3 - e.clientX;
		pos2 = pos4 - e.clientY;
		pos3 = e.clientX;
		pos4 = e.clientY;
		// set the element's new position:
		elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
		elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
	  }

	  function closeDragElement() {
		// stop moving when mouse button is released:
		document.onmouseup = null;
		document.onmousemove = null;
	  }
};
