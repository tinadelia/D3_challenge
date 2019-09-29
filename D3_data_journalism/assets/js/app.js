// chart params
var svgWidth = 800;
var svgHeight = 400;

var margin = { top: 75, right: 75, bottom: 75, left: 75 };

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// svg wrapper
var svg = d3
    .select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight)

// svg append to scatter plot
var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

// data from the csv file
d3.csv("assets/data/data.csv").then(function(data) {

    // console log to determine needed fields
    console.log(data);

    // data cast we need as numbers
    data.forEach(function(data) {
        data.smokes = +data.smokes;
        data.poverty = +data.poverty;
        data.obesity = +data.obesity;
        data.healthcare = +data.healthcare;
        data.income = +data.income;
    });

    // scale function
    var xLinearScale = d3.scaleLinear()
        // define domain
        .domain([8, d3.max(data, d => d.poverty)])
        // define range 
        .range([0, width]);

    var yLinearScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.healthcare)])
        .range([height, 0]);

    // axis functions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // append axixes to chartGroup 
    chartGroup.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);

    chartGroup.append("g")
        .call(leftAxis);

    // circle creations on the axis
    var scatterCircles = chartGroup.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", data => xLinearScale(data.poverty))
        .attr("cy", data => yLinearScale(data.healthcare))
        .attr("r", "10")
        .attr("fill", "purple")
        .attr("opacity", ".5");

    // circle state abbr.
    chartGroup.selectAll("text")
        .data(data)
        .enter()
        .append("text")
        .attr("text-anchor", "middle")
        .attr("x", data => xLinearScale(data.poverty-0.01))
        .attr("y", data => yLinearScale(data.healthcare-0.2))
        .attr("font-size",8)
        .attr("class", "axisText")
        .text(data => data.abbr)
    

    // circle tooltips
    var toolTip = d3.tip()
        .attr("class", "d3-tip")
        .offset([80, -60])
        .html(function(data) {
            return (`${data.state}<br>In Poverty (%): ${data.poverty}<br>Lacks Healthcare (%): ${data.healthcare}`);
        });
    
    // tooltip in chartplane
    chartGroup.call(toolTip);

    // event listeners 
    scatterCircles.on("mouseover", function(data) {
      toolTip.show(data, this);
    })
      // onmouseout events
      .on("mouseout", function(data, i) {
        toolTip.hide(data);
      });
      
    // axes labels
    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .attr("class", "axisText")
      .text("Lacks Healthcare (%)");

    chartGroup.append("text")
      .attr("transform", `translate(${width / 2}, ${height + margin.top - 20})`)
      .attr("class", "axisText")
      .text("In Poverty (%)");
})