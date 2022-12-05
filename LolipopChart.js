//=========================================================================================================================================//
//  INITIALIZATION OF GRAPH    
//=========================================================================================================================================//

    // Source Code Refrenced from: https://d3-graph-gallery.com/graph/lollipop_cleveland.html
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

//Data is parsed and sent back as an data array
d3.csv("CulturesListV8.csv", conversor).then( function(data) {
    
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
        .call(d3.axisBottom(x).tickFormat(""));
    
    // Define Y Axis
    var y = d3.scaleBand()
        .range([ 0, height ])
        .domain(data.map(function(d) { return d.name; }))
        .padding(1);
    
    // Create group inside of SVG
    svg.append("g")
        .call(d3.axisLeft(y));
    
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
            .attr("class", function(d) { return d.type+"Line"; })
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
                        hover_line(d);
			       })
       .on("mouseout", function(d) {
/*------------------------------------------------------------------------------------------------------------------------------------------------------
Hide tooltip on mouseout
------------------------------------------------------------------------------------------------------------------------------------------------------*/
                        tt_mouseout(d);
                        hover_line_out(d);
			       })
    
    // Circles of variable 1
    svg.selectAll("mycircle")
        .data(data)
        .join("circle")
            .attr("class", function(d) { return d.type+"Found"; })
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
                        circle_hover(d);
			       })
       .on("mouseout", function(d) {
/*------------------------------------------------------------------------------------------------------------------------------------------------------
Hide tooltip on mouseout
------------------------------------------------------------------------------------------------------------------------------------------------------*/
                        tt_mouseout(d);
                        circle_hover_out(d);
			       })

    // Circles of variable 2
    svg.selectAll("mycircle")
        .data(data)
        .join("circle")
            .attr("class", function(d) { return d.type+"End"; })
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
                        circle_hover(d);
			       })
       .on("mouseout", function(d) {
/*------------------------------------------------------------------------------------------------------------------------------------------------------
Hide tooltip on mouseout
------------------------------------------------------------------------------------------------------------------------------------------------------*/
                        tt_mouseout(d);
                        circle_hover_out(d);
			       })
    
/*------------------------------------------------------------------------------------------------------------------------------------------------------
Legend
------------------------------------------------------------------------------------------------------------------------------------------------------*/
    svg.append("rect")
        .attr("x", 1450)
        .attr("y", 500)
        .attr("height", 300)
        .attr("width", 200)
        .attr("fill", "rgb(218,220,217)");
    svg.append("text")
        .text("Legend")
        .attr("class", "label")
        .attr("x", 1515)
        .attr("y", 520)
        .attr("fill", "black")
        .style("text-anchor", "left")
        .attr("font-size", "21px");
    svg.append("rect")
        .attr("x", 1465)
        .attr("y", 530)
        .attr("height", 20)
        .attr("width", 20)
        .attr("fill", "#9c3587");
    svg.append("text")
        .text("Animism")
        .attr("class", "label")
        .attr("x", 1500)
        .attr("y", 545)
        .attr("fill", "black")
        .style("text-anchor", "left")
        .attr("font-size", "17px");
    svg.append("rect")
        .attr("x", 1465)
        .attr("y", 550)
        .attr("height", 20)
        .attr("width", 20)
        .attr("fill", "#7ea310");
    svg.append("text")
        .text("Dualism")
        .attr("class", "label")
        .attr("x", 1500)
        .attr("y", 565)
        .attr("fill", "black")
        .style("text-anchor", "left")
        .attr("font-size", "17px");
});

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
            'Start Date: '+ date_converter(d.found)+ '<br>'+
            'End Date : ' +tt_dateender(d.end)+ '<br>'+
            'Region Founded : '  + d.origin+ '<br>'+ 
            'Religion Type : '  + d.type)        
        .style("left", (event.pageX) + "px")
        .style("top", (event.pageY - 28) + "px");
    }
    function tt_mouseout(d) {
        tooltip.transition()		
        .duration(500)		
        .style("opacity", 0)
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

    
    // hover functions
    //changes line thickness when you hover over a line
    function hover_line(d){
        svg.selectAll("line")
            .attr("stroke-width", "8px");
    }
    //changes line thickness back to default when you move off a line
    function hover_line_out(d){
        svg.selectAll("line")
            .attr("stroke-width", "4px");
    }
    //changes circle radius when you hover over a circle
    function circle_hover(d){
        svg.selectAll("circle")
            .attr("r", "10")
    }
    //changes circle radius back to default when you move off a circle
    function circle_hover_out(d){
        svg.selectAll("circle")
            .attr("r", "6")
    }

// Function That converts csv data into usable data, also formated like it was on the given scatterplotV2020.js file
/*function type(d, _, columns) {  
    for (var i = 1, n = columns.length, c; i < n; ++i) d[c = columns[i]] = +d[c];
    return d;
}*/
