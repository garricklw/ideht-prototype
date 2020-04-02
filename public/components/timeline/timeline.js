// import * as d3 from "/public/javascripts/d3";

import {SizingUtils} from "../../javascripts/SizingUtils.js";

function appendDotToChart(chartSel, pathSel, xScaler, dotX, dotColor) {
    chartSel.append("circle")
        .attr("class", "dot")
        .attr("cx", xScaler(dotX))
        .attr("cy", yValueForX(pathSel, xScaler, dotX))
        .attr("r", 5)
        .style("fill", dotColor)
        .style("stroke", "black")
        .style("stroke-width", "2")
}

function yValueForX(pathSel, xScaler, xCor) {
    let x = xScaler(xCor);
    let pathEl = pathSel.node();
    let pathLength = pathEl.getTotalLength();

    let beginning = x, end = pathLength, target, pos;
    while (true) {
        target = Math.floor((beginning + end) / 2);
        pos = pathEl.getPointAtLength(target);
        if ((target === end || target === beginning) && pos.x !== x) {
            break;
        }
        if (pos.x > x) end = target;
        else if (pos.x < x) beginning = target;
        else break; //position found
    }

    return pos.y;
}

export function Timeline(parentNode, htmlDepends, lines, alerts, dateFormat) {

    let that = this;
    this.isInit = false;
    this.parseDate = d3.timeParse(dateFormat);
    this.parent = parentNode;
    this.lines = lines;

    let widget = htmlDepends.dependencies["Timeline"];
    that.shadow = parentNode.attachShadow({mode: 'open'});
    that.shadow.append(widget.documentElement.cloneNode(true));

    this.displayData = function (lines) {
        for (let i = 0; i < lines.length; i++) {
            let data = lines[i];
            that.chart.append("path")
                .datum(data)
                .attr("class", "line" + i)
                .attr("d", that.lineScalers[i]);

            that.navElem.append("path")
                .datum(data)
                .attr("class", "line" + i)
                .attr("d", that.navLineScalers[i]);
        }

        that.axesElem.select(".x-axis").call(that.graphXAxis);
        that.navElem.select(".x-axis").call(that.navXAxis);
        // that.updateYAxes();
    };

    /**
     * @param alerts map of x value -> alert_color
     */
    this.displayAlerts = function (alerts) {
        that.alerts = alerts;
        that.updateAlertDots(alerts);

        for (let alert of Object.keys(that.alerts)) {
            let severity = that.alerts[alert];
            appendDotToChart(that.navElem, that.navElem.select(".line"), that.navXData, alert, severity);
        }
    };

    this.updateAlertDots = function () {
        if (!that.isInit) {
            return;
        }
        that.chart.selectAll(".dot").remove();
        for (let alert of Object.keys(that.alerts)) {
            let severity = that.alerts[alert];

            appendDotToChart(that.chart, that.chart.select(".line"), that.graphXData, alert, severity);
        }
    };

    this.initGraph = function (lines) {
        that.graphRootSvg = d3.select(that.shadow.querySelector("svg"));
        that.margin = {top: 10, right: 40, bottom: 0, left: 40};
        that.navMargin = {top: 0, right: 40, bottom: 0, left: 40};
        that.chartWidth = +that.parent.offsetWidth - that.margin.left - that.margin.right;
        that.height = +that.parent.offsetHeight * 0.6;
        that.navHeight = +that.parent.offsetHeight * 0.18;

        that.brush = d3.brushX()
            .extent([[0, 0], [that.chartWidth, that.navHeight]])
            .on("brush end", that.brushed);

        that.zoom = d3.zoom()
            .scaleExtent([1, Infinity])
            .translateExtent([[0, 0], [that.chartWidth, that.height]])
            .extent([[0, 0], [that.chartWidth, that.height]])
            .on("zoom", that.zoomed);

        that.chart = that.graphRootSvg.append("g")
            .attr("class", "focus")
            .attr("transform", "translate(" + that.margin.left + "," + that.margin.top + ")")
            .attr("clip-path", "url(#clip)");

        that.graphRootSvg.append("defs").append("svg:clipPath")
            .attr("id", "clip")
            .append("svg:rect")
            .attr("width", that.chartWidth)
            .attr("height", that.height)
            .attr("x", 0)
            .attr("y", 0);

        that.graphRootSvg.append("rect")
            .attr("class", "zoom")
            .attr("width", that.chartWidth)
            .attr("height", that.height)
            .attr("transform", "translate(" + that.margin.left + "," + that.margin.top + ")")
            .call(that.zoom);

        that.initAxes();
        that.initNavBox();
    };

    this.initAxes = function () {
        let xExtent = d3.extent(lines[0], d => that.parseDate(d[0]));
        for (let lineData of lines) {
            let lineXExtent = d3.extent(lineData, d => that.parseDate(d[0]));
            if (lineXExtent[0] < xExtent[0]) {
                xExtent[0] = lineXExtent[0];
            }
            if (lineXExtent[1] > xExtent[1]) {
                xExtent[1] = lineXExtent[1];
            }
        }

        that.graphXData = d3.scaleTime().range([0, that.chartWidth]);
        that.navXData = d3.scaleTime().range([0, that.chartWidth]);
        that.ys = [
            d3.scaleLinear().range([that.height, 0]),
            d3.scaleLinear().range([that.height, 0]),
        ];
        that.navYs = [
            d3.scaleLinear().range([that.navHeight, 0]),
            d3.scaleLinear().range([that.navHeight, 0])
        ];
        that.graphXData.domain(xExtent);
        that.ys[0].domain([0, d3.max(lines[0], d => +d[1])]);
        that.ys[1].domain([0, d3.max(lines[1], d => +d[1])]);

        that.navXData.domain(that.graphXData.domain());
        that.navYs[0] = that.navYs[0].domain(that.ys[0].domain());
        that.navYs[1] = that.navYs[1].domain(that.ys[1].domain());

        that.graphXAxis = d3.axisBottom(that.graphXData);
        that.yAxes = [
            d3.axisLeft(that.ys[0]),
            d3.axisRight(that.ys[1]),
        ];
        that.navXAxis = d3.axisBottom(that.navXData);
        that.lineScalers = [
            d3.line()
                .x(d => that.graphXData(that.parseDate(d[0])))
                .y(d => that.ys[0](+d[1])),
            d3.line()
                .x(d => that.graphXData(that.parseDate(d[0])))
                .y(d => that.ys[1](+d[1])),
        ];

        that.navLineScalers = [
            d3.line()
                .x(d => that.navXData(that.parseDate(d[0])))
                .y(d => that.navYs[0](+d[1])),
            d3.line()
                .x(d => that.navXData(that.parseDate(d[0])))
                .y(d => that.navYs[1](+d[1])),
        ];

        that.axesElem = that.graphRootSvg.append("g")
            .attr("class", "focus")
            .attr("transform", "translate(" + that.margin.left + "," + that.margin.top + ")");

        that.axesElem.append("g")
            .attr("class", "axis x-axis")
            .attr("transform", "translate(0," + that.height + ")")
            .call(that.graphXAxis);

        that.axesElem.append("g")
            .attr("class", "axis y-axis0")
            .call(that.yAxes[0]);
        that.axesElem.append("g")
            .attr("transform", "translate(" + that.chartWidth + ")")
            .attr("class", "axis y-axis1")
            .call(that.yAxes[1]);
        that.updateYAxes();
    };

    this.initNavBox = function () {
        that.navElem = that.graphRootSvg.append("g")
            .attr("class", "context")
            .attr("transform", "translate(" + that.navMargin.left + "," + (that.height + 36) + ")");

        that.navElem.append("g")
            .attr("class", "axis x-axis")
            .attr("transform", "translate(0," + that.navHeight + ")")
            .call(that.navXAxis);

        that.navElem.append("g")
            .attr("class", "brush")
            .call(that.brush)
            .call(that.brush.move, that.graphXData.range());
    };

    this.brushed = function () {
        if (d3.event.sourceEvent && d3.event.sourceEvent.type === "zoom") return; // ignore brush-by-zoom
        let s = d3.event.selection || that.navXData.range();
        that.graphXData.domain(s.map(that.navXData.invert, this.navXData));
        that.updateLines();
        that.axesElem.select(".x-axis").call(that.graphXAxis);
        that.graphRootSvg.select(".zoom").call(that.zoom.transform, d3.zoomIdentity
            .scale(that.chartWidth / (s[1] - s[0]))
            .translate(-s[0], 0));
        that.updateAlertDots();
    };

    this.zoomed = function () {
        if (d3.event.sourceEvent && d3.event.sourceEvent.type === "brush") return; // ignore zoom-by-brush
        let t = d3.event.transform;
        that.graphXData.domain(t.rescaleX(that.navXData).domain());
        that.updateLines();
        that.axesElem.select(".x-axis").call(that.graphXAxis);
        that.navElem.select(".brush").call(that.brush.move, that.graphXData.range().map(t.invertX, t));
        that.updateAlertDots();
    };

    this.updateLines = function () {
        for (let i = 0; i < that.lines.length; i++) {
            that.chart.select(".line" + i).attr("d", that.lineScalers[i]);
        }
    };

    this.updateYAxes = function () {
        for (let i = 0; i < that.lines.length; i++) {
            that.chart.select(".y-axis" + i).call(that.yAxes[i]);
        }
    };

    that.initGraph();
    that.displayData(lines);
    this.isInit = true;
    that.displayAlerts(alerts);
}