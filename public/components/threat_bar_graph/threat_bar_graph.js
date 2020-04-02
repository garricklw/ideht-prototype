/**
 *
 * @param parentNode
 * @param htmlDepends
 * @param data: Map of Threat Factor -> Count
 * @constructor
 */
import {networkColor} from "../../javascripts/ideht_colors.js";
import {individualColor} from "../../javascripts/ideht_colors.js";

export function ThreatBarGraph(parentNode, htmlDepends, indiv_data, network_data) {
    let that = this;

    that.shadow = htmlDepends.attachShadow("ThreatBarGraph", parentNode);

    let margin = {top: 20, right: 40, bottom: 30, left: 40};
    let width = parentNode.offsetWidth - margin.left - margin.right;
    let height = parentNode.offsetHeight - margin.top - margin.bottom;

    // set the ranges
    let x = d3.scaleBand()
        .range([0, width])
        .padding(0.4);
    let y = d3.scaleLinear()
        .range([height, 0]);
    let netY = d3.scaleLinear()
        .range([height, 0]);

    // append the svg object to the body of the page
    // append a 'group' element to 'svg'
    // moves the 'group' element to the top left margin
    let svg = d3.select(that.shadow).select("#bar-chart").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    // Scale the range of the data in the domains
    x.domain(["Proximity", "Installation", "Radical", "Violence"]);
    y.domain([0, d3.max(Object.values(indiv_data)) * 1.1]);
    netY.domain([0, d3.max(Object.values(network_data)) * 1.1]);

    let tooltip = d3.select(that.shadow).select("#bar-chart").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    function drawBars(data, idx, yAxis, color) {
        // append the rectangles for the bar chart
        svg.selectAll(".bar" + idx)
            .data(Object.entries(data))
            .enter().append("rect")
            .attr("class", "bar" + idx)
            .attr("x", function (d) {
                return x(d[0]) + ((x.bandwidth() / 2.0) * idx);
            })
            .attr("width", x.bandwidth() / 2.0 - 5)
            .attr("y", function (d) {
                return yAxis(d[1]);
            })
            .attr("height", function (d) {
                return height - yAxis(d[1]);
            })
            .attr("fill", color)
            .on("mouseover", (d) => {
                tooltip.transition()
                    .duration(200)
                    .style("opacity", .9);
                tooltip.html("" + d[1])
                    .style("left", (d3.event.pageX) + "px")
                    .style("top", (d3.event.pageY - 28) + "px");
            })
            .on("mouseout", function (d) {
                tooltip.transition()
                    .duration(500)
                    .style("opacity", 0);
            });
    }

    function drawLabels(data, idx) {
        svg.selectAll(".labels")
            .data(Object.entries(data))
            .enter().append("text")
            .attr("class", "labels")
            .attr("x", d => x(d[0]) + ((x.bandwidth() / 2.0) * idx))
            .attr("y", d => y(d[1]) - 8)
            .attr("text-anchor", "middle")
            .style("font-size", 12)
            .text(d => "" + d[1]);
    }

    drawBars(indiv_data, 0, y, individualColor);
    drawBars(network_data, 1, netY, networkColor);

    // drawLabels(indiv_data, 0);
    // drawLabels(network_data, 1);

    // add the x Axis
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

    // add the y Axis
    svg.append("g")
        .style("stroke", individualColor)
        .call(d3.axisLeft(y));

    svg.append("g")
        .style("stroke", networkColor)
        .attr("transform", "translate(" + width + ")")
        .call(d3.axisRight(netY));
}