
export class D3Utils {

    static widestExtent(valueLists, forceBottom = null, forceTop = null) {
        let allValues = [];
        for (let list of valueLists) {
            for (let value of list) {
                allValues.push(value);
            }
        }
        let extent = d3.extent(allValues);
        if (forceBottom != null) {
            extent[0] = forceBottom;
        }
        if (forceTop != null) {
            extent[1] = forceTop;
        }
        return extent;
    }
}