// import * as d3 from "/public/javascripts/d3";

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

function Timeline(parentNode, data, alerts) {

    let that = this;
    this.isInit = false;
    this.parseDate = d3.timeParse("%m/%d/%Y %H:%M");

    fetch('components/timeline/timeline.html')
        .then(data => data.text())
        .then((html) => {
            let doc = new DOMParser().parseFromString(html, "text/html");

            that.shadow = parentNode.attachShadow({mode: 'open'});
            that.shadow.append(doc.documentElement);
            that.initGraph();
            that.displayData(data);
            this.isInit = true;
            that.displayAlerts(alerts);
        });

    this.displayData = function (data) {
        that.graphXData.domain(d3.extent(data, function (d) {
            return that.parseDate(d[0]);
        }));
        that.graphYData.domain([0, d3.max(data, function (d) {
            return +d[1];
        })]);
        that.navXData.domain(that.graphXData.domain());
        that.navYData.domain(that.graphYData.domain());

        that.chart.append("path")
            .datum(data)
            .attr("class", "line")
            .attr("d", that.lineScaler);

        that.navElem.append("path")
            .datum(data)
            .attr("class", "line")
            .attr("d", that.navLineScaler);

        that.axesElem.select(".x-axis").call(that.graphXAxis);
        that.navElem.select(".x-axis").call(that.navXAxis);

        console.log(data);
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

    this.initGraph = function () {
        that.graphRootSvg = d3.select(that.shadow.querySelector("svg"));
        that.margin = {top: 20, right: 20, bottom: 110, left: 40};
        that.navMargin = {top: 430, right: 20, bottom: 30, left: 40};
        that.chartWidth = +that.graphRootSvg.attr("width") - that.margin.left - that.margin.right;
        that.height = +that.graphRootSvg.attr("height") - that.margin.top - that.margin.bottom;
        that.navHeight = +that.graphRootSvg.attr("height") - that.navMargin.top - that.navMargin.bottom;

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
        that.graphXData = d3.scaleTime().range([0, that.chartWidth]);
        that.navXData = d3.scaleTime().range([0, that.chartWidth]);
        that.graphYData = d3.scaleLinear().range([that.height, 0]);
        that.navYData = d3.scaleLinear().range([that.navHeight, 0]);

        that.graphXAxis = d3.axisBottom(that.graphXData);
        that.graphYAxis = d3.axisLeft(that.graphYData);
        that.navXAxis = d3.axisBottom(that.navXData);

        that.lineScaler = d3.line()
            .x(function (d) {
                return that.graphXData(that.parseDate(d[0]));
            })
            .y(function (d) {
                return that.graphYData(parseFloat(d[1]));
            });

        that.navLineScaler = d3.line()
            .x(function (d) {
                return that.navXData(that.parseDate(d[0]));
            })
            .y(function (d) {
                return that.navYData(parseFloat(d[1]));
            });

        that.axesElem = that.graphRootSvg.append("g")
            .attr("class", "focus")
            .attr("transform", "translate(" + that.margin.left + "," + that.margin.top + ")");

        that.axesElem.append("g")
            .attr("class", "axis x-axis")
            .attr("transform", "translate(0," + that.height + ")")
            .call(that.graphXAxis);

        that.axesElem.append("g")
            .attr("class", "axis y-axis")
            .call(that.graphYAxis);
    };

    this.initNavBox = function () {
        that.navElem = that.graphRootSvg.append("g")
            .attr("class", "context")
            .attr("transform", "translate(" + that.navMargin.left + "," + that.navMargin.top + ")");

        that.navElem.append("g")
            .attr("class", "axis x-axis")
            .attr("transform", "translate(0," + that.navHeight + ")")
            .call(that.navXAxis);

        that.navElem.append("g")
            .attr("class", "brush")
            .call(that.brush)
            .call(that.brush.move, that.graphXData.range());
    };

    // d3 changes the context to the event when calling these methods, so we must preserve the 'this' reference
    this.brushed = function () {
        if (d3.event.sourceEvent && d3.event.sourceEvent.type === "zoom") return; // ignore brush-by-zoom
        let s = d3.event.selection || that.navXData.range();
        that.graphXData.domain(s.map(that.navXData.invert, this.navXData));
        that.chart.select(".line").attr("d", that.lineScaler);
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
        that.chart.select(".line").attr("d", that.lineScaler);
        that.axesElem.select(".x-axis").call(that.graphXAxis);
        that.navElem.select(".brush").call(that.brush.move, that.graphXData.range().map(t.invertX, t));
        that.updateAlertDots();
    };
}