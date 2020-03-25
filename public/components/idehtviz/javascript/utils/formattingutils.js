/** 
 * Class: FormattingUtils
 * This class contains various color conversion utility methods.
  */
var FormattingUtils = function () {
	
};

/* 
	Function: convertRGBAColorToHex

	Converts rgba color array to color hex string

	Parameters:

		rgbaColorArray - rgba color array
					
	Returns:
		
		hexColorString - color hex string output
*/
FormattingUtils.prototype.convertRGBAColorToHex = function (rgbaColorArray) {
	
	return FormattingUtils.prototype.rgbToHex(rgbaColorArray[0], rgbaColorArray[1], rgbaColorArray[2]);
	
};

/* 
	Function: convertHexColorToRGBA

	Converts color hex string to rgba color array

	Parameters:

		hexColorString - color hex string output
					
	Returns:
		
		rgbaColorArray - rgba color array
*/
FormattingUtils.prototype.convertHexColorToRGBA = function (hexColor) {
	
	var color = (hexColor.substr(0,1)=="#") ? hexColor.substr(1) : hexColor;
	return [parseInt(color.substr(0,2), 16), parseInt(color.substr(2,2), 16), parseInt(color.substr(4,2), 16)];
	
};

/* 
	Function: componentToHex

	Converts a color component (r, g, or b) to hex string

	Parameters:

		c - rgb color component
					
	Returns:
		
		hexColorComponentValue - color hex component value
*/
FormattingUtils.prototype.componentToHex = function (c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
};

/* 
	Function: rgbToHex

	Converts r, g, b color triplet to color hex string

	Parameters:

		r - red color component
		g - green color component
		b - blue color component
					
	Returns:
		
		hexColorString - color hex string output
*/
FormattingUtils.prototype.rgbToHex = function (r, g, b) {
    return "#" + FormattingUtils.prototype.componentToHex(r) + FormattingUtils.prototype.componentToHex(g) + FormattingUtils.prototype.componentToHex(b);
};
