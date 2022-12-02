//=========================================================================================================================================//
//  INITIALIZATION OF GRAPH    
//=========================================================================================================================================//

    // Source Code Refrenced from: https://d3-graph-gallery.com/graph/lollipop_cleveland.html
    // Selects the created SVG and sets width and height
    var margin = {left: 100, right: 80, top: 50, bottom: 50 }, 
        width = 1600 - margin.left -margin.right,
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
d3.csv("CulturesListV6.csv", conversor).then( function(data) {
    
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
        .range([0, width])
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
              .tickSize(-width)
              .tickFormat("")
        )
    
    
    // Lines
    svg.selectAll("myline")
        .data(data)
        .join("line")
            //.attr("class", function(d) { return d.type; })
            .attr("x1", function(d) { return x(d.found); })
            .attr("x2", function(d) { return x(d.end); })
            .attr("y1", function(d) { return y(d.name); })
            .attr("y2", function(d) { return y(d.name); })
            .attr("stroke", "steelblue")
            .attr("stroke-width", "2px")
    /*------------------------------------------------------------------------------------------------------------------------------------------------------
Mouseover and mouseout events for tooltips
------------------------------------------------------------------------------------------------------------------------------------------------------*/
        //.attr("d", data)
        .on("mouseover", function(event, d){
            
                        tt_mouseover(d);  
			       })
       .on("mouseout", function(d) {
/*------------------------------------------------------------------------------------------------------------------------------------------------------
Hide tooltip on mouseout
------------------------------------------------------------------------------------------------------------------------------------------------------*/
                        tt_mouseout(d);
			       })
    
    // Circles of variable 1
    svg.selectAll("mycircle")
        .data(data)
        .join("circle")
            //.attr("class", function(d) { return d.type; })
            .attr("cx", function(d) { return x(d.found); })
            .attr("cy", function(d) { return y(d.name); })
            .attr("r", "6")
            .style("fill", "#69b3a2")
        /*------------------------------------------------------------------------------------------------------------------------------------------------------
Mouseover and mouseout events for tooltips
------------------------------------------------------------------------------------------------------------------------------------------------------*/
        //.attr("d", data)
        .on("mouseover", function(event, d){
            
                        tt_mouseover(d); 
			       })
       .on("mouseout", function(d) {
/*------------------------------------------------------------------------------------------------------------------------------------------------------
Hide tooltip on mouseout
------------------------------------------------------------------------------------------------------------------------------------------------------*/
                        tt_mouseout(d);
			       })

    // Circles of variable 2
    svg.selectAll("mycircle")
        .data(data)
        .join("circle")
            //.attr("class", function(d) { return d.type; })
            .attr("cx", function(d) { return x(d.end); })
            .attr("cy", function(d) { return y(d.name); })
            .attr("r", "6")
            .style("fill", "#4C4082")
        /*------------------------------------------------------------------------------------------------------------------------------------------------------
Mouseover and mouseout events for tooltips
------------------------------------------------------------------------------------------------------------------------------------------------------*/
        //.attr("d", data)
        .on("mouseover", function(event, d){
             
                        tt_mouseover(d); 
			       })
       .on("mouseout", function(d) {
/*------------------------------------------------------------------------------------------------------------------------------------------------------
Hide tooltip on mouseout
------------------------------------------------------------------------------------------------------------------------------------------------------*/
                        tt_mouseout(d);
			       })
    
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

// Function That converts csv data into usable data, also formated like it was on the given scatterplotV2020.js file
/*function type(d, _, columns) {  
    for (var i = 1, n = columns.length, c; i < n; ++i) d[c = columns[i]] = +d[c];
    return d;
}*/