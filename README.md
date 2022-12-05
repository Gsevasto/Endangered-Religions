#UCSC

#CSE 163 - Fall 2022

#Supervisor: Suresh Lodha

#Members: Greg Sevaston, Andre Dion, Samik Pradhan, Sree Chinta

#Project: Endangered-Religions

Planned Features
=========

Legend:
    -Missing legend.
    
Features:
    -Zoom + Pan/scale feature needed. Graph is too big on its own.
    -Possible reorginizing of the data to allow this to work. 

Menu box:
    -Sort by founding/ending
    -Show by specific culture [Drop Down possibly]
    -Colorize by specific culture

Tooltip Box:
    [X]Show culture name, found and end date [If 2022, display instead still practiced], and type
    -Alow clickability feature [Planned]
        -Mouseover heightlights only the visualization
        -Click on bar will "toggle" the tootip to stay
    
Possible data required:
    -Defintions / Descriptions of culure when clicked?[Optional]
    -Some more fact checking required for the data/data pruning


==========
Known Challange:
    -Data parsing needs reorginization/rewriting
    -Reorginization of the graph drawing to allow for easier editing.
    -Unknown myline function used
    -Need to add updater functions to allow for updating graphic for interactivity
    -Data requires to be refetched everytime the graph wants to be updated
    
==========
Possible solutions:
    -Diffrent CSVs for diffrent data. 
    -Possible force/bubble graph
    
==========
Sources/Refrences:
    -https://observablehq.com/@d3/dot-plot
    -https://observablehq.com/@d3/multi-line-chart
    -https://observablehq.com/@d3/zoomable-scatterplot?collection=@d3/d3-zoom
    -https://observablehq.com/@will-r-chase/scrollable-bar-chart
