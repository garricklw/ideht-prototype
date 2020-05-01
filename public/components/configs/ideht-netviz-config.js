import {ConfigModFuncs} from "../../netvizer/src/configs/config-mod-funcs.js";
import {NetvizDrawFuncs} from "../../netvizer/src/drawing/netviz-draw-funcs.js";
import {highlightColor, individualColor} from "../../javascripts/ideht_colors.js";

export function idehtNetvizConfig(nodeIdToHsv, links, userOfInterest, nodeSelectCallback) {

    let highlightedNodes = new Set();
    let configMods = new IdehtNetvizConfigMods(highlightedNodes, userOfInterest);

    let defaultColorFunc = (node) => {
        return nodeIdToHsv[node.name];
    };
    let defaultNodeDraw = configMods.drawCircleFunc(defaultColorFunc);
    let defaultLineDraw = IdehtNetvizConfigMods.lineFunc(links);

    let config = {
        graph_props: {
            node_repulsion_strength: -3000,
            max_repulsion_distance: 600,
        },

        node_draw: {
            func: defaultNodeDraw,
            width: () => 50,
            height: () => 50,
        },
        link_draw: {
            func: defaultLineDraw,
            width: () => 1
        },
        on_node_click: {
            func: (visualState, node, context) => {
                highlightedNodes.clear();
                highlightedNodes.add(node.id);
                nodeSelectCallback(node.id);
            }
        },

        on_canvas_click: {
            func: (visualState, context) => {
                highlightedNodes.clear();
                nodeSelectCallback(null);
            }
        },

        clearHighlight: () => {
            highlightedNodes.clear();
        },

        updateColorFunc: (nodeIdToHsv) => {
            configMods.updateColorFunc(config, nodeIdToHsv);
        }
    };

    return config;
}

export class IdehtNetvizConfigMods {

    constructor(highlightedNodes, userOfInterest) {
        this.highlightedNodes = highlightedNodes;
        this.userOfInterest = userOfInterest;
    }

    updateColorFunc(config, nodeIdToHsv) {
        let newColorFunc = (node) => {
            return nodeIdToHsv[node.id];
        };
        config.node_draw.func = this.drawCircleFunc(newColorFunc);
    }

    drawCircleFunc(colorFunc) {
        let labelFunc = IdehtNetvizConfigMods.labelDrawFunc;
        return (config, visualState, node, context) => {
            if (this.highlightedNodes.has(node.id)) {
                NetvizDrawFuncs.drawCircle(context, node.x, node.y, 60, highlightColor);
            }
            if (node.id === this.userOfInterest) {
                NetvizDrawFuncs.drawCircle(context, node.x, node.y, 34, individualColor);
            }
            NetvizDrawFuncs.drawCircle(context, node.x, node.y, 27, "#333333");
            NetvizDrawFuncs.drawPieChart(context, node.x, node.y, 25, colorFunc(node));
            labelFunc(visualState, node, context);

            // NetvizDrawFuncs.drawCircleWithBorder(config, visualState, node, context,
            //     colorFunc, IdehtNetvizConfigMods.labelDrawFunc);
        }
    }

    static lineFunc(links) {

        let posOnes = {}; //{n1, n2} -> (p1 source, p1 target)
        let posTwos = {}; //{n1, n2} -> (p2 source, p2 target)

        for (let link of links) {
            let key = link.source + "_" + link.target;
            let backKey = link.target + "_" + link.source;

            if (backKey in posOnes) {
                posTwos[key] = [link.source, link.target];
            } else {
                posOnes[key] = [link.source, link.target];
            }
        }

        return (config, visualState, link, context) => {
            let key = link.source.id + "_" + link.target.id;
            let backKey = link.target.id + "_" + link.source.id;

            let lineEndPoints = null;
            if (key in posOnes) {
                if (!(backKey in posTwos)) {
                    NetvizDrawFuncs.drawLineFunc(config, visualState, link, context);
                    lineEndPoints = [link.source.x, link.source.y, link.target.x, link.target.y];
                } else {
                    lineEndPoints = NetvizDrawFuncs.drawDirectionalLine(link.source.x, link.source.y, link.target.x, link.target.y,
                        context, 1, 15);
                }
            } else {
                lineEndPoints = NetvizDrawFuncs.drawDirectionalLine(link.source.x, link.source.y, link.target.x, link.target.y,
                    context, 1, 15, false);
            }
            NetvizDrawFuncs.drawLineArrow(lineEndPoints[0], lineEndPoints[1], lineEndPoints[2], lineEndPoints[3], context);
        }
    }
}

IdehtNetvizConfigMods.labelDrawFunc = (visualState, node, context) => {
    let fontSizePx = 22;
    let fontName = "Ariel";
    context.font = fontSizePx + "px " + fontName;
    NetvizDrawFuncs.drawLabelBackground(visualState, node, context, "whitesmoke", "black", 0, -40, 22);
    NetvizDrawFuncs.drawLabelFunc(visualState, node, context, fontSizePx, fontName, "black", 0, -33);
};

function onContextSelect(updateGroupCallback) {
    return (visualState, node, prop) => {
        if (prop !== 'group') {
            return;
        }
        let selectedGroupId = node[prop];
        NetvizDrawFuncs.defaultContextCallback(visualState, node, prop);
        updateGroupCallback(selectedGroupId);
    }
}