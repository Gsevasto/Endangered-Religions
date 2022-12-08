//=========================================================================================================================================//
//  INITIALIZATION OF GRAPH    
//=========================================================================================================================================//

// Source Code Referenced from: https://d3-graph-gallery.com/graph/lollipop_cleveland.html
// Selects the created SVG and sets width and height
var margin = {left: 100, right: 80, top: 50, bottom: 50 }, 
    width = 1800 - margin.left -margin.right,
    height = 950 - margin.top - margin.bottom;

// Define the SVG
var svg = d3.select("body") // NOTE: SVG is storing the pointer data to the selected body
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

//Create the tooltip
var tooltip = d3.select("body").append("div")
.attr("class", "tooltip")
.style("opacity", 0)
.classed("hidden", true);

//=========================================================================================================================================//
//  INITIAL GRAPHIC    
//=========================================================================================================================================//

// variables for csv filenames
var startName = "CulturesListV9.csv";
var endName = "CulturesListV9EndOrder.csv";
var regionName = "CulturesListV9RegionOrder.csv";
var nameName = "CulturesListV9NameOrder.csv";
var religionName = "CulturesListV9ReligionOrder.csv";
// state var for files
var curFile = startName;

// dot filter types
var defaultDotFilter = "d";
var dateDotFilter = "dF";
// state var for dot filter type
var curDotFilter = defaultDotFilter;

// line filter types
var defaultLineFilter = "l";
var regionLineFilter = "rf";
// state var for line filter
var curLineFilter = defaultLineFilter;

// updater functions
// filterType values: d = default, dF = date filter
function update (filename, dotFilterType, lineFilter) {
    
svg.selectAll("*").remove();    

//Data is parsed and sent back as an data array
d3.csv(filename, conversor).then( function(data) {
    
    // Log checking
    console.log(data); // Check data parsed correctly
    
   /* var scatterdataset= 
                data.map(function (d) {
                    return { name:d.name, found: d.found, origin: d.origin, end: d.end, type:d.type};
                });*/

    //data=scatterdataset;
    
    // Define X axis
    var x  = d3.scaleLinear()
        .domain([ d3.min(data, function(d) {return d.found; }) - 100, d3.max(data, function(d) {return d.end; } )])
        .range([0, width-200])
    svg.append("g") // Appends a shape group to the pointed body
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x).tickFormat(""))
        .style("color", "white")
        .transition()
            .duration(200);
    
    // Define Y Axis
    var y = d3.scaleBand()
        .range([ 0, height ])
        .domain(data.map(function(d) { return d.name; }))
        .padding(1);
    
    // Create group inside of SVG
    svg.append("g")
        .call(d3.axisLeft(y))
        .style("color", "white");
    
    // add the X gridlines to graph
    svg.append("g")			
        .attr("class", "grid")
        .attr("transform", "translate(" + 0 + "," + (height) + ")")
        .call(make_x_gridlines(x)
              .tickSize(-height)
              .tickPadding(15)
              .tickFormat(function (d) {
                    return date_converter(d);
                })
        )
        .style("color", "white");
    
    // add the Y gridlines to graph
    svg.append("g")			
        .attr("class", "grid")
        .attr("transform", "translate(" + 0 + "," + 0 + ")")
        .call(make_y_gridlines(y)
              .tickSize(-(width-200))
              .tickFormat("")
        )
    
    
    // Lines
    svg.selectAll("myline")
        .data(data)
        .join("line")
            .attr("class", function(d) { if (lineFilter == defaultLineFilter) {return d.type+"Line";} else {return d.origin;} })
            .attr("x1", function(d) { return x(d.found); })
            .attr("x2", function(d) { return x(d.end); })
            .attr("y1", function(d) { return y(d.name); })
            .attr("y2", function(d) { return y(d.name); })
            .attr("stroke", "steelblue")
            .attr("stroke-width", "4px") // Controls Width
/*------------------------------------------------------------------------------------------------------------------------------------------------------
Mouseover and mouseout events for tooltips
------------------------------------------------------------------------------------------------------------------------------------------------------*/
        //.attr("d", data)
        .on("mouseover", function(event, d){
                        tt_mouseover(d);
                        d3.select(this).attr("stroke-width", "8px");
                        //hover_line(d);
			       })
        .on("mouseout", function(d) {
/*------------------------------------------------------------------------------------------------------------------------------------------------------
Hide tooltip on mouseout
------------------------------------------------------------------------------------------------------------------------------------------------------*/
                        tt_mouseout(d);
                        d3.select(this).attr("stroke-width", "4px");
			       })
    
    // Circles of variable 1
    svg.selectAll("mycircle")
        .data(data)
        .join("circle")
            .attr("class", function(d) { if (dotFilterType == dateDotFilter) {return "StartDot";} else {return d.type+"Found";} }) // 
            .attr("cx", function(d) { return x(d.found); })
            .attr("cy", function(d) { return y(d.name); })
            .attr("r", "6") // Controls Radius
            //.style("fill", "#69b3a2")
/*------------------------------------------------------------------------------------------------------------------------------------------------------
Mouseover and mouseout events for tooltips
------------------------------------------------------------------------------------------------------------------------------------------------------*/
        //.attr("d", data)
        .on("mouseover", function(event, d){
                        tt_mouseover(d);
                        d3.select(this).attr("r", "10");
			       })
       .on("mouseout", function(d) {
/*------------------------------------------------------------------------------------------------------------------------------------------------------
Hide tooltip on mouseout
------------------------------------------------------------------------------------------------------------------------------------------------------*/
                        tt_mouseout(d);
                        d3.select(this).attr("r", "6");
			       })

    // Circles of variable 2
    svg.selectAll("mycircle")
        .data(data)
        .join("circle")
            .attr("class", function(d) {
                                        if (dotFilterType == dateDotFilter) {
                                            if (d.end == 2022) {
                                                return "CurrentDot";
                                            }
                                            return "EndDot";
                                        } else {
                                            return d.type+"End";
                                        }
                                    })
            .attr("cx", function(d) { return x(d.end); })
            .attr("cy", function(d) { return y(d.name); })
            .attr("r", "6") // Controls Radius
            //.style("fill", "#4C4082")
/*------------------------------------------------------------------------------------------------------------------------------------------------------
Mouseover and mouseout events for tooltips
------------------------------------------------------------------------------------------------------------------------------------------------------*/
        //.attr("d", data)
        .on("mouseover", function(event, d){
                        tt_mouseover(d); 
                        d3.select(this).attr("r", "10");
			       })
       .on("mouseout", function(d) {
/*------------------------------------------------------------------------------------------------------------------------------------------------------
Hide tooltip on mouseout
------------------------------------------------------------------------------------------------------------------------------------------------------*/
                        tt_mouseout(d);
                        d3.select(this).attr("r", "6");
			       })
    
/*------------------------------------------------------------------------------------------------------------------------------------------------------
Legend
------------------------------------------------------------------------------------------------------------------------------------------------------*/
    // legend box
    svg.append("rect")
        .attr("x", 1450)
        .attr("y", 95)
        .attr("height", 630)
        .attr("width", 200)
        .attr("fill", "#d4d4d4");
    svg.append("text")
        .text("Legend")
        .attr("class", "label")
        .attr("x", 1505)
        .attr("y", 120)
        .attr("fill", "#28282a")
        .style("text-anchor", "left")
        .style("font-weight", "bold")
        .attr("font-size", "25px");
    // animism
    svg.append("rect")
        .attr("x", 1465)
        .attr("y", 130)
        .attr("height", 20)
        .attr("width", 20)
        .attr("fill", "#9c3587");
    svg.append("text")
        .text("Animism")
        .attr("class", "label")
        .attr("x", 1500)
        .attr("y", 145)
        .attr("fill", "black")
        .style("text-anchor", "left")
        .attr("font-size", "17px");
    // dualism
    svg.append("rect")
        .attr("x", 1465)
        .attr("y", 155)
        .attr("height", 20)
        .attr("width", 20)
        .attr("fill", "#7ea310");
    svg.append("text")
        .text("Dualism")
        .attr("class", "label")
        .attr("x", 1500)
        .attr("y", 170)
        .attr("fill", "black")
        .style("text-anchor", "left")
        .attr("font-size", "17px");
    // monotheism
    svg.append("rect")
        .attr("x", 1465)
        .attr("y", 180)
        .attr("height", 20)
        .attr("width", 20)
        .attr("fill", "steelblue");
    svg.append("text")
        .text("Monotheism")
        .attr("class", "label")
        .attr("x", 1500)
        .attr("y", 195)
        .attr("fill", "black")
        .style("text-anchor", "left")
        .attr("font-size", "17px");
    // nontheistic
    svg.append("rect")
        .attr("x", 1465)
        .attr("y", 205)
        .attr("height", 20)
        .attr("width", 20)
        .attr("fill", "#8a8a8a");
    svg.append("text")
        .text("Nontheistic")
        .attr("class", "label")
        .attr("x", 1500)
        .attr("y", 220)
        .attr("fill", "black")
        .style("text-anchor", "left")
        .attr("font-size", "17px");
    // polytheism
    svg.append("rect")
        .attr("x", 1465)
        .attr("y", 230)
        .attr("height", 20)
        .attr("width", 20)
        .attr("fill", "#e3534c");
    svg.append("text")
        .text("Polytheism")
        .attr("class", "label")
        .attr("x", 1500)
        .attr("y", 245)
        .attr("fill", "black")
        .style("text-anchor", "left")
        .attr("font-size", "17px");
    // shamanism
    svg.append("rect")
        .attr("x", 1465)
        .attr("y", 255)
        .attr("height", 20)
        .attr("width", 20)
        .attr("fill", "#e38931");
    svg.append("text")
        .text("Shamanism")
        .attr("class", "label")
        .attr("x", 1500)
        .attr("y", 270)
        .attr("fill", "black")
        .style("text-anchor", "left")
        .attr("font-size", "17px");
    // timeline rect
    svg.append("rect")
        .attr("x", 1500)
        .attr("y", 295)
        .attr("height", 4)
        .attr("width", 100)
        .attr("fill", "black");
    // timeline dots
    svg.append("circle")
        .attr("cx", 1500)
        .attr("cy", 297)
        .attr("r", 6)
        .attr("fill", "black");
    svg.append("circle")
        .attr("cx", 1600)
        .attr("cy", 297)
        .attr("r", 6)
        .attr("fill", "black");
    // timeline labels
    svg.append("text")
        .text("Start Date")
        .attr("class", "label")
        .attr("x", 1465)
        .attr("y", 320)
        .attr("fill", "black")
        .style("text-anchor", "left")
        .attr("font-size", "17px");
    svg.append("text")
        .text("End Date")
        .attr("class", "label")
        .attr("x", 1565)
        .attr("y", 320)
        .attr("fill", "black")
        .style("text-anchor", "left")
        .attr("font-size", "17px");
    
});
    
}

// call update function for first time when page loaded
update(curFile, curDotFilter, curLineFilter);

//=========================================================================================================================================//
//  FUNCTIONS    
//=========================================================================================================================================//

//Data parsing and conversion
function conversor(d){
    d.name = d.name;
    d.found = +d.found;
    d.origin = d.origin;
    d.end = +d.end;
    d.type = d.type;
    return d;
}


// gridlines in x axis function
function make_x_gridlines(x) {		
    return d3.axisBottom(x);
}

// gridlines in x axis function
function make_y_gridlines(y) {		
    return d3.axisLeft(y);
}

// tooltip functions
function tt_mouseover(d) {
    tooltip.transition()
    .duration(200)
    .style("opacity", .9);
    tooltip.html(
        d.name +
        '<br>' +                          
        'Start Date: ' + date_converter(d.found)+ '<br>'+
        'End Date: ' + tt_dateender(d.end)+ '<br>'+
        'Region Founded: ' + d.origin+ '<br>'+ 
        'Religion Type: ' + d.type)
    .style("left", (event.pageX) + "px")
    .style("top", (event.pageY - 28) + "px");
}
function tt_mouseout(d) {
    tooltip.transition()
    .duration(500)
    .style("opacity", 0);
    //.style("left", (d3.event.pageX + 10) + "px")
    //.style("top", (d3.event.pageY - 28) + "px");
}

// date conversion function
function date_converter(num) {
    if (num < 0) {
        return (0 - num) + " BC";
    } else if (num == 0) {
        return 0;
    } else {
        return num + " AD";
    }
}
function tt_dateender(num) {
    if (num < 0) {
        return (0 - num) + " BC";
    } else if (num == 0) {
        return 0;
    } else if (num == 2022) {
        return "Currently Practiced"
    } else {
        return num + " AD";
    }
}

// core button functions
function startFilter() {
    curFile = startName;
    update(curFile, curDotFilter, curLineFilter);
}
function endFilter() {
    curFile = endName;
    update(curFile, curDotFilter, curLineFilter);
}
function regionFilter() {
    curFile = regionName;
    update(curFile, curDotFilter, curLineFilter);
}
function nameFilter() {
    curFile = nameName;
    update(curFile, curDotFilter, curLineFilter);
}
function religionFilter() {
    curFile = religionName;
    update(curFile, curDotFilter, curLineFilter);
}

// aux button functions
function defFilterSwitch() {
    curDotFilter = defaultDotFilter;
    update(curFile, curDotFilter, curLineFilter);
}
function dateFilterSwitch() {
    curDotFilter = dateDotFilter;
    update(curFile, curDotFilter, curLineFilter);
}
function defLineSwitch() {
    curLineFilter = defaultLineFilter;
    update(curFile, curDotFilter, curLineFilter);
}
function regionLineSwitch() {
    curLineFilter = regionLineFilter;
    update(curFile, curDotFilter, curLineFilter);
}
