import {individualRgb, networkRgb, threatColorMap, threatRgbMap} from "./ideht_colors.js";

export class HomePageUtils {

    static userRgbThreat(userName, isNetwork, factorFilter, userPosts) {
        if (factorFilter != null) {
            return threatRgbMap[HomePageUtils.mostSevereFilteredThreat(userName, factorFilter, userPosts)]
        } else {
            let worstThreat = HomePageUtils.mostSevereFilteredThreat(userName, factorFilter, userPosts);
            if (worstThreat != null) {
                return threatRgbMap[worstThreat];
            } else if (!isNetwork) {
                return networkRgb;
            } else {
                return individualRgb;
            }
        }
    }

    static mostSevereFilteredThreat(userName, factorFilter, userPosts) {
        if (!(userName in userPosts)) {
            return null;
        }
        if (factorFilter != null) {
            for (let post of userPosts[userName]) {
                if (post[factorFilter] === true) {
                    return factorFilter
                }
            }
            return null;
        }
        for (let factorFilter of Object.keys(threatColorMap)) {
            for (let post of userPosts[userName]) {
                if (post[factorFilter] === true) {
                    return factorFilter
                }
            }
        }
        return null;
    }

    static filterTimelineResults(filterThreatFacs, filterIndiv, indivPoints, networkPoints) {
        let filteredIndiv = [];
        let filteredNetwork = [];
        for (let indivPoint of indivPoints) {
            if (filterIndiv == null || filterIndiv) {
                if (filterThreatFacs == null) {
                    filteredIndiv.push(indivPoint);
                } else if (indivPoint[filterThreatFacs] === true) {
                    filteredIndiv.push(indivPoint);
                }
            }
        }
        for (let netPoint of networkPoints) {
            if (filterIndiv == null || !filterIndiv) {
                if (filterThreatFacs == null) {
                    filteredNetwork.push(netPoint);
                } else if (netPoint[filterThreatFacs] === true) {
                    filteredNetwork.push(netPoint);
                }
            }
        }
        return [filteredIndiv, filteredNetwork];
    }

    static filterNetworkLinks(networkEdges, indivFilter, user_name, factorFilter, userPosts) {
        let nodes = new Set();
        let links = [];
        for (let edge of networkEdges) {
            let source_id = edge["source_id"];
            let target_id = edge["target_id"];
            nodes.add(source_id);
            nodes.add(target_id);

            if (indivFilter != null) {
                if (indivFilter === true) {
                    continue; // no edges if just the individual
                } else {
                    if (source_id === user_name || target_id === user_name) {
                        continue;
                    }
                }
            }

            let linkConfig = {
                "sourceNodeId": source_id,
                "targetNodeId": target_id,
                "metaData1": 0.05,
                "metaData2": 0.5,
                "arrowSize": 0.2
            };
            if (HomePageUtils.userRgbThreat(target_id, false, factorFilter, userPosts) != null) {
                linkConfig["metaData2"] = 0.0;
            }
            links.push(linkConfig);
        }
        return [nodes, links];
    }

    static filterNetworkNodes(nodeSet, user_name, indivFilter, factorFilter, userPosts) {
        let nodeArray = [];
        for (let node_id of nodeSet) {
            if (indivFilter != null) {
                if (indivFilter === true) {
                    if (node_id !== user_name) {
                        continue;
                    }
                } else {
                    if (node_id === user_name) {
                        continue;
                    }
                }
            }

            let nodeConfig = {"id": node_id, "metaData1": 0.5, "metaData2": 0.5, "rgb": [255, 255, 255]};
            let worstThreat = HomePageUtils.userRgbThreat(node_id, user_name === node_id, factorFilter, userPosts);
            if (worstThreat != null) {
                nodeConfig["rgb"] = worstThreat;
                nodeConfig["metaData2"] = 0.0;
            }
            nodeArray.push(nodeConfig);
        }
        return nodeArray;
    }
}