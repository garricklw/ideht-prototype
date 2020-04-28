// export let individualColor = "#8B4513";
// export let networkColor = "#3d3d3d";

import {ColorUtils} from "../common/utils/ColorUtils.js";

export let highlightColor = getComputedStyle(document.documentElement).getPropertyValue("--highlight-color").trim();

export let individualColor = getComputedStyle(document.documentElement).getPropertyValue("--individual-color").trim();
export let networkColor = getComputedStyle(document.documentElement).getPropertyValue("--network-color").trim();

export let individualRgb = ColorUtils.hexStringToRgb(individualColor);
export let networkRgb = ColorUtils.hexStringToRgb(networkColor);

export let individualHsv = ColorUtils.rgb2hsv(individualRgb[0], individualRgb[1], individualRgb[2]);
export let networkHsv = ColorUtils.rgb2hsv(networkRgb[0], networkRgb[1], networkRgb[2]);

export let installationColor = getComputedStyle(document.documentElement).getPropertyValue("--installation-color").trim();
export let proximityColor = getComputedStyle(document.documentElement).getPropertyValue("--proximity-color").trim();
export let violenceColor = getComputedStyle(document.documentElement).getPropertyValue("--violence-color").trim();
export let radicalColor = getComputedStyle(document.documentElement).getPropertyValue("--radical-color").trim();

export let installationRgb = ColorUtils.hexStringToRgb(installationColor);
export let proximityRgb = ColorUtils.hexStringToRgb(proximityColor);
export let violenceRgb = ColorUtils.hexStringToRgb(violenceColor);
export let radicalRgb = ColorUtils.hexStringToRgb(radicalColor);

export let threatColorMap = {
    "is_installation_relevant": installationColor,
    "is_proximal": proximityColor,
    "is_violent": violenceColor,
    "is_radical": radicalColor
};

export let threatHueMap = {
    "is_installation_relevant": ColorUtils.rgb2hsv(installationRgb[0], installationRgb[1], installationRgb[2]),
    "is_proximal": ColorUtils.rgb2hsv(proximityRgb[0], proximityRgb[1], proximityRgb[2]),
    "is_violent": ColorUtils.rgb2hsv(violenceRgb[0], violenceRgb[1], violenceRgb[2]),
    "is_radical": ColorUtils.rgb2hsv(radicalRgb[0], radicalRgb[1], radicalRgb[2])
};

export let threatRgbMap = {
    "is_installation_relevant": installationRgb,
    "is_proximal": proximityRgb,
    "is_violent": violenceRgb,
    "is_radical": radicalRgb
};