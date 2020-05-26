var svgWidth = 960;
var svgHeight = 500;
var margin = {
    top: 20,
    right: 40,
    bottom: 60,
    left: 100
};
var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;
// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3.select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);
var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);
// Import Data
(async function() {
    var url = "assets/data/data.csv"
    var censusData = await d3.csv(url).catch(function(error) {
        console.log(error);
    });
    console.log(censusData)
        // Parse Data/Cast as numbers
        // ==============================
    censusData.forEach(d => {
            d.poverty = +d.poverty
            d.healthcare = +d.healthcare
        })
        // Create scale functions
        // ==============================
    var xScale = d3.scaleLinear()
        .domain([(d3.min(censusData, d => d.poverty)) - 1, d3.max(censusData, d => d.poverty) + 2])
        .range([0, width])
    var yScale = d3.scaleLinear()
        .domain([(d3.min(censusData, d => d.healthcare)) - 0.8, d3.max(censusData, d => d.healthcare) + 2])
        .range([height, 0])

    // Create axis functions
    // ==============================
    var xAxis = d3.axisBottom(xScale)
    var yAxis = d3.axisLeft(yScale)

    // Append Axes to the chart
    // ==============================
    chartGroup.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(xAxis)
    chartGroup.append("g")
        .call(yAxis)
        // Create axes labels
    chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left + 40)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .attr("class", "axisText")
        .style("text-anchor", "middle")
        .text("Lacks Healthcare (%)");
    chartGroup.append("text")
        .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
        .attr("class", "axisText")
        .style("text-anchor", "middle")
        .text("In Poverty (%)");

    //  Create Circles
    // ==============================
    var circlesGroup = chartGroup.selectAll(".stateCircle")
        .data(censusData)
        .join("circle")
        .attr("cx", d => xScale(d.poverty))
        .attr("cy", d => yScale(d.healthcare))
        .attr("class", "stateCircle")
        .attr("r", "15")

    chartGroup.selectAll(".stateText")
        .data(censusData)
        .join("text")
        .classed("stateText", "true")
        .attr("x", data => xScale(data.poverty))
        .attr("y", data => yScale(data.healthcare))
        .attr("font-size", "9px")
        .text(data => data.abbr)

    // Initialize tool tip
    // ==============================
    var toolTip = d3.tip()
        .attr("class", "tooltip")
        .offset([80, -60])
        .html(function(d) {
            return (`${d.state}<br>Poverty: ${d.poverty}<br>Healthcare: ${d.healthcare}`);
        });
    chartGroup.call(toolTip)
        // Create tooltip in the chart
        // ==============================
        //  Create event listeners to display and hide the tooltip
        // ==============================
        // Create "mouseover" event listener to display tooltip
    circlesGroup.on("mouseover", function(data) {
            toolTip.show(data, this);
        })
        // onmouseout event
        .on("mouseout", function(data, index) {
            toolTip.hide(data);
        });

})()