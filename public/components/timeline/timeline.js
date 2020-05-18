// import * as d3 from "/public/javascripts/d3";

import {networkColor, individualColor, threatColorMap, highlightColor} from "../../javascripts/ideht_colors.js";

export let timelineInteractionCallback = {
    onAlertSelected: function (postId) {
    }
};

export function Timeline(parentNode, htmlDepends, top_alerts, bottom_alerts, timelineInteractionCallback = timelineInteractionCallback) {

    let that = this;
    this.isInit = false;
    this.parent = parentNode;
    that.topAlerts = top_alerts;
    that.bottomAlerts = bottom_alerts;
    that.highlightCircle = null;
    that.highlightFollow = null; //rect element that the highlight is tracking

    that.shadow = htmlDepends.attachShadow("Timeline", parentNode);
    if ((top_alerts == null || top_alerts.length === 0) && (bottom_alerts == null || bottom_alerts.length === 0)) {
        let noData = document.createElement("div");
        noData.textContent = "No Data";
        that.shadow.getElementById("graph-svg").remove();
        that.shadow.getElementById("timeline-root").appendChild(noData);
        return ({
            clearHighlight: () => {

            }
        });
    }

    this.displayData = function () {
        that.axesElem.select(".x-axis").call(that.graphXAxis);
        that.navElem.select(".x-axis").call(that.navXAxis);

        let [networkTicks, networkLines] = that.displayTicks(that.topAlerts, "Network");
        let [indivTicks, indivLines] = that.displayTicks(that.bottomAlerts, "Individual");
        that.networkTicks = networkTicks;
        that.networkLines = networkLines;
        that.indivTicks = indivTicks;
        that.indivLines = indivLines;
    };

    function alertPostToColor(post) {
        let color = individualColor;
        for (let threat_check of Object.keys(threatColorMap)) {
            if (post[threat_check] === true) {
                color = threatColorMap[threat_check];
                break
            }
        }
        return color;
    }

    function hasThreatFactorColor(post, threatFactor) {
        if (post[threatFactor] === true) {
            return threatColorMap[threatFactor];
        }
        return null;
    }

    that.displayTicks = function (alert_infos, y_idx) {
        let graphBars = [];
        let graphLines = [];
        for (let alertInfo of alert_infos) {
            let highlightFollow = [];
            let clickOnAlert = () => {
                timelineInteractionCallback.onAlertSelected(alertInfo["post_id"]);
                let x = highlightFollow[0].attr("x");
                let topY = +highlightFollow[0].attr("y");
                let bottomY = +highlightFollow[highlightFollow.length-1].attr("y") + (that.y.bandwidth() / 4.0);

                that.highlightCircle
                    .attr("r", (bottomY - topY) + 10)
                    .attr("cx", +x + 4)
                    .attr("cy", topY + (bottomY - topY) / 2.0)
                    .attr("display", "block");
                that.highlightFollow = highlightFollow;
            };

            let i = 0;
            for (let threatFactor of Object.keys(threatColorMap)) {
                let leftX = that.graphXData(new Date(alertInfo["created_day"] * 1000));
                let navLeftX = that.navXData(new Date(alertInfo["created_day"] * 1000));
                let navTopY = that.navY(y_idx) + ((that.navY.bandwidth() / 4.0) * i);
                let topY = that.y(y_idx) + ((that.y.bandwidth() / 4.0) * i);

                if (hasThreatFactorColor(alertInfo, threatFactor) == null) {
                    i++;
                    continue;
                }
                let subRect = that.chart.append("rect")
                    .on("click", clickOnAlert)
                    .attr("x", leftX)
                    .attr("width", 8)
                    .attr("y", topY)
                    .attr("height", that.y.bandwidth() / 4.0)
                    .attr("fill", hasThreatFactorColor(alertInfo, threatFactor))
                    .attr("stroke-width", "1px")
                    .attr("stroke", "gray");
                graphBars.push([subRect, alertInfo]);
                highlightFollow.push(subRect);

                that.navElem.append("rect")
                    .attr("x", navLeftX)
                    .attr("width", 5)
                    .attr("y", navTopY)
                    .attr("height", that.navY.bandwidth() / 4.0)
                    .attr("fill", hasThreatFactorColor(alertInfo, threatFactor))
                    .attr("stroke-width", "1px")
                    .attr("stroke", "gray");
                i++;
            }
        }

        return [graphBars, graphLines];
    };

    that.updateTicks = function (ticks, lines) {
        that.axesElem.select(".x-axis").call(that.graphXAxis);
        that.navElem.select(".x-axis").call(that.navXAxis);

        if (!that.isInit) {
            return;
        }
        for (let [graphBar, alertInfo] of ticks) {
            graphBar.attr("x", that.graphXData(new Date(alertInfo["created_day"] * 1000)))
        }
        for (let [graphLine, alertInfo] of lines) {
            let leftX = that.graphXData(new Date(alertInfo["created_day"] * 1000));
            graphLine.attr("x1", leftX);
            graphLine.attr("x2", leftX + 8);
        }
        if (that.highlightCircle != null && that.highlightFollow != null && that.highlightFollow.length !== 0) {
            let x = that.highlightFollow[0].attr("x");
            that.highlightCircle
                .attr("cx", +x + 4)
        }
    };

    this.initGraph = function (top_alerts, bottom_alerts) {
        that.graphRootSvg = d3.select(that.shadow.querySelector("svg"));
        that.margin = {top: 10, right: 20, bottom: 0, left: 60};
        that.navMargin = {top: 0, right: 20, bottom: 0, left: 60};
        that.chartWidth = +that.parent.offsetWidth - that.margin.left - that.margin.right;
        that.height = +that.parent.offsetHeight * 0.5;
        that.navHeight = +that.parent.offsetHeight * 0.18;

        that.brush = d3.brushX()
            .extent([[0, 0], [that.chartWidth, that.navHeight]])
            .on("brush end", that.brushed);

        that.zoom = d3.zoom()
            .scaleExtent([1, Infinity])
            .translateExtent([[0, 0], [that.chartWidth, that.height]])
            .extent([[0, 0], [that.chartWidth, that.height]])
            .on("zoom", that.zoomed);

        that.graphRootSvg.append("rect")
            .attr("class", "zoom")
            .attr("width", that.chartWidth)
            .attr("height", that.height)
            .attr("transform", "translate(" + that.margin.left + "," + that.margin.top + ")")
            .on("click", _ => {
                timelineInteractionCallback.onAlertSelected(null);
                that.highlightCircle.attr("display", "none");
                that.highlightFollow = null;
            })
            .call(that.zoom);

        that.chart = that.graphRootSvg.append("g")
            .attr("class", "focus")
            .attr("transform", "translate(" + that.margin.left + "," + that.margin.top + ")")
            .attr("clip-path", "url(#clip)");
        // .on("click", () => timelineInteractionCallback.onAlertSelected(null));

        that.highlightCircle = that.chart.append("circle")
            .attr("r", 30)
            .attr("fill", highlightColor)
            .attr("fill-opacity", 0.4)
            .attr("display", "none");

        that.graphRootSvg.append("defs").append("svg:clipPath")
            .attr("id", "clip")
            .append("svg:rect")
            .attr("width", that.chartWidth)
            .attr("height", that.height)
            .attr("x", 0)
            .attr("y", 0);

        that.initAxes(top_alerts, bottom_alerts);
        that.initNavBox();
    };

    this.initAxes = function (top_alerts, bottom_alerts) {
        let presentAlerts = [];
        if (top_alerts != null && top_alerts.length !== 0) {
            presentAlerts.push(top_alerts);
        }
        if (bottom_alerts != null && bottom_alerts.length !== 0) {
            presentAlerts.push(bottom_alerts);
        }

        let xExtent = d3.extent(presentAlerts[0], d => new Date(d["created_day"] * 1000));
        if (presentAlerts.length > 1) {
            let otherXExtent = d3.extent(presentAlerts[1], d => new Date(d["created_day"] * 1000));
            if (otherXExtent[0] < xExtent[0]) {
                xExtent[0] = otherXExtent[0];
            }
            if (otherXExtent[1] > xExtent[1]) {
                xExtent[1] = otherXExtent[1];
            }
        }
        let timePadding = ((xExtent[1].getTime() - xExtent[0].getTime()) * .05);
        xExtent[0] = new Date(xExtent[0].getTime() - timePadding);
        xExtent[1] = new Date(xExtent[1].getTime() + timePadding);
        // xExtent[1] = new Date(xExtent[1].getTime());

        that.graphXData = d3.scaleTime().range([0, that.chartWidth]);
        that.navXData = d3.scaleTime().range([0, that.chartWidth]);
        that.y = d3.scaleBand()
            .range([0, that.height])
            .padding(0.4);
        that.navY = d3.scaleBand()
            .range([0, that.navHeight])
            .padding(0.3);

        that.graphXData.domain(xExtent);
        that.y.domain(["Network", "Individual"]);

        that.navXData.domain(that.graphXData.domain());
        that.navY.domain(that.y.domain());

        that.graphXAxis = d3.axisBottom(that.graphXData);
        that.yAxis = d3.axisLeft(that.y);

        that.navXAxis = d3.axisBottom(that.navXData);

        that.axesElem = that.graphRootSvg.append("g")
            .attr("class", "focus")
            .attr("transform", "translate(" + that.margin.left + "," + that.margin.top + ")");

        that.axesElem.append("g")
            .attr("class", "axis x-axis")
            .attr("transform", "translate(0," + that.height + ")")
            .call(that.graphXAxis);

        let yAxis = that.axesElem.append("g")
            .attr("class", "axis y-axis0")
            .call(that.yAxis);
        let ticks = yAxis.selectAll(".tick");
        ticks.attr("stroke", (d, i) => i === 0 ? networkColor : individualColor);
        let axisTexts = yAxis.selectAll("text");
        axisTexts.attr("fill", null);
    };

    this.initNavBox = function () {
        that.navElem = that.graphRootSvg.append("g")
            .attr("class", "context")
            .attr("transform", "translate(" + that.navMargin.left + "," + (that.height + 32) + ")");

        that.navElem.append("g")
            .attr("class", "axis x-axis")
            .attr("transform", "translate(0," + that.navHeight + ")")
            .call(that.navXAxis);

        that.navElem.append("g")
            .attr("class", "brush")
            .call(that.brush)
            .call(that.brush.move, that.navXData.range());
    };

    this.brushed = function () {
        if (d3.event.sourceEvent && d3.event.sourceEvent.type === "zoom") return; // ignore brush-by-zoom
        let s = d3.event.selection || that.navXData.range();
        that.graphXData.domain(s.map(that.navXData.invert, this.navXData));
        that.axesElem.select(".x-axis").call(that.graphXAxis);
        that.graphRootSvg.select(".zoom").call(that.zoom.transform, d3.zoomIdentity
            .scale(that.chartWidth / (s[1] - s[0]))
            .translate(-s[0], 0));
        that.updateTicks(that.networkTicks, that.networkLines);
        that.updateTicks(that.indivTicks, that.indivLines);
    };

    this.zoomed = function () {
        if (d3.event.sourceEvent && d3.event.sourceEvent.type === "brush") return; // ignore zoom-by-brush
        let t = d3.event.transform;
        that.graphXData.domain(t.rescaleX(that.navXData).domain());
        that.axesElem.select(".x-axis").call(that.graphXAxis);
        that.navElem.select(".brush").call(that.brush.move, that.graphXData.range().map(t.invertX, t));
        that.updateTicks(that.networkTicks, that.networkLines);
        that.updateTicks(that.indivTicks, that.indivLines);
    };

    that.initGraph(top_alerts, bottom_alerts);
    that.displayData();
    that.isInit = true;

    return ({
        clearHighlight: () => {
            that.highlightCircle.attr("display", "none");
            that.highlightFollow = null;
        }
    })
}