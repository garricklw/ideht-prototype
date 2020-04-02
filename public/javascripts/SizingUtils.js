export class SizingUtils {
    static measureTextWidth(text, textElement) {
        let fontSizePx = window.getComputedStyle(textElement).font;

        let canvas = document.createElement("canvas");
        let context = canvas.getContext("2d");
        context.font = fontSizePx;
        return context.measureText(text).width;
    }

    static truncateTextToRows(text, textElement, rowWidth, numRows) {
        let result = "";
        let remainText = text;
        for (let i = 0; i < numRows; i++) {
            let row = this.truncateTextToFit(remainText, textElement, rowWidth);
            result += row;
            remainText = remainText.substring(row.length);
        }
        return result;
    }

    static truncateTextToFit(text, textElement, targetWidth) {
        let words = text.split(" ");
        let result = "";

        for (let word of words) {
            let resultWithAdd = result + word + " ";
            let newWidth = SizingUtils.measureTextWidth(resultWithAdd, textElement);
            if (newWidth > targetWidth) {
                return result;
            }
            result = resultWithAdd;
        }
        return result.trim();
    }

    static runOnInit(parentNode, onInit) {
        // still not sure if this is 100% accurate; seems like there has to be a better way
        // to detect when a node has its final measurements.
        if (parentNode.offsetHeight === 0 || parentNode.offsetHeight === 0) {
            window.requestAnimationFrame(() => {
                SizingUtils.runOnInit(parentNode, onInit);
            });
        }
        onInit();
    }
}
