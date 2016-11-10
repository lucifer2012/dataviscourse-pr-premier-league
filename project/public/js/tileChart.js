/**
 * Constructor for the TileChart
 */
function TileChart(){

    var self = this;
    self.init();
};

/**
 * Initializes the svg elements required to lay the tiles
 * and to populate the legend.
 */
TileChart.prototype.init = function(){
    var self = this;

    //Gets access to the div element created for this chart and legend element from HTML
    var divTileChart = d3.select("#tiles").classed("content", true);
    var legend = d3.select("#legend").classed("content",true);
    self.margin = {top: 30, right: 20, bottom: 30, left: 50};

    var svgBounds = divTileChart.node().getBoundingClientRect();
    self.svgWidth = svgBounds.width - self.margin.left - self.margin.right;
    self.svgHeight = self.svgWidth/2;
    var legendHeight = 150;

    //creates svg elements within the div
    self.legendSvg = legend.append("svg")
        .attr("width",self.svgWidth)
        .attr("height",legendHeight)
        .attr("transform", "translate(" + self.margin.left + ",0)");


    self.svg = divTileChart.append("svg")
        .attr("width",self.svgWidth)
        .attr("height",self.svgHeight)
        .attr("transform", "translate(" + self.margin.left + ",0)")
        .style("bgcolor","green");

    self.svg.append("g").attr("id", "state");
    self.svg.append("g").attr("id", "info");
};

/**
 * Returns the class that needs to be assigned to an element.
 *
 * @param party an ID for the party that is being referred to.
 */
TileChart.prototype.chooseClass = function (party) {
    var self = this;
    if (party == "R"){
        return "republican";
    }
    else if (party== "D"){
        return "democrat";
    }
    else if (party == "I"){
        return "independent";
    }
}

/**
 * Renders the HTML content for tool tip.
 *
 * @param tooltip_data information that needs to be populated in the tool tip
 * @return text HTML content for tool tip
 */
TileChart.prototype.tooltip_render = function (tooltip_data) {
    var self = this;
    var text = "<h2 class ="  + self.chooseClass(tooltip_data.winner) + " >" + tooltip_data.state + "</h2>";
    text +=  "Electoral Votes: " + tooltip_data.electoralVotes;
    text += "<ul>"
    tooltip_data.result.forEach(function(row){
        text += "<li class = " + self.chooseClass(row.party)+ ">" + row.nominee+":\t\t"+row.votecount+"("+row.percentage+"%)" + "</li>"
    });
    text += "</ul>";
    return text;
}

/**
 * Creates tiles and tool tip for each state, legend for encoding the color scale information.
 *
 * @param electionResult election data for the year selected
 * @param colorScale global quantile scale based on the winning margin between republicans and democrats
 */
TileChart.prototype.update = function(electionResult, colorScale){
    var self = this;
    //Calculates the maximum number of columns to be laid out on the svg
    self.maxColumns = d3.max(electionResult,function(d){
        return parseInt(d["Space"]);
    });

    //Calculates the maximum number of rows to be laid out on the svg
    self.maxRows = d3.max(electionResult,function(d){
        return parseInt(d["Row"]);
    });
    //for reference:https://github.com/Caged/d3-tip
    //Use this tool tip element to handle any hover over the chart
    tip = d3.tip().attr('class', 'd3-tip')
        .direction('se')
        .offset(function() {
            return [0,0];
        })
        .html(function(d) {
            /* populate data in the following format
             * tooltip_data = {
             * "state": State,
             * "winner":d.State_Winner
             * "electoralVotes" : Total_EV
             * "result":[
             * {"nominee": D_Nominee_prop,"votecount": D_Votes,"percentage": D_Percentage,"party":"D"} ,
             * {"nominee": R_Nominee_prop,"votecount": R_Votes,"percentage": R_Percentage,"party":"R"} ,
             * {"nominee": I_Nominee_prop,"votecount": I_Votes,"percentage": I_Percentage,"party":"I"}
             * ]
             * }
             * pass this as an argument to the tooltip_render function then,
             * return the HTML content returned from that method.
             * */
            var tip_helper = d[d.length - 1];
            if (tip_helper.I_Percentage != 0){
                var tooltip_data = {
                    "state": tip_helper.State,
                    "winner": tip_helper.State_Winner,
                    "electoralVotes": tip_helper.Total_EV,
                    "result": [
                        {"nominee": tip_helper.D_Nominee,"votecount": tip_helper.D_Votes,"percentage":tip_helper.D_Percentage,"party":"D"},
                        {"nominee": tip_helper.R_Nominee,"votecount": tip_helper.R_Votes,"percentage":tip_helper.R_Percentage,"party":"R"},
                        {"nominee": tip_helper.I_Nominee,"votecount": tip_helper.I_Votes,"percentage":tip_helper.I_Percentage,"party":"I"}
                    ]
                }
            } else {
                var tooltip_data = {
                    "state": tip_helper.State,
                    "winner": tip_helper.State_Winner,
                    "electoralVotes": tip_helper.Total_EV,
                    "result": [
                        {"nominee": tip_helper.D_Nominee,"votecount": tip_helper.D_Votes,"percentage":tip_helper.D_Percentage,"party":"D"},
                        {"nominee": tip_helper.R_Nominee,"votecount": tip_helper.R_Votes,"percentage":tip_helper.R_Percentage,"party":"R"}
                    ]
                }
            }

            return self.tooltip_render(tooltip_data);
        });

    //Creates a legend element and assigns a scale that needs to be visualized
    self.legendSvg.append("g")
        .attr("class", "legendQuantile");

    var legendQuantile = d3.legendColor()
        .shapeWidth(90)
        .cells(10)
        .orient('horizontal')
        .scale(colorScale);

    // ******* TODO: PART IV *******
    //Tansform the legend element to appear in the center and make a call to this element for it to display.

    //Lay rectangles corresponding to each state according to the 'row' and 'column' information in the data.

    //Display the state abbreviation and number of electoral votes on each of these rectangles

    //Use global color scale to color code the tiles.

    //HINT: Use .tile class to style your tiles;
    // .tilestext to style the text corresponding to tiles

    //Call the tool tip on hover over the tiles to display stateName, count of electoral votes
    //then, vote percentage and number of votes won by each party.
    //HINT: Use the .republican, .democrat and .independent classes to style your elements.
    self.legendSvg.select(".legendQuantile")
        .call(legendQuantile);

    //use Row and space to index the tile
    var tile_width = 90;
    var tile_height = 65;
    var tile_data = [];
    for(var i = 0; i < electionResult.length; i++){
        tile_data[i] = [electionResult[i].Row, electionResult[i].Space, electionResult[i].RD_Difference,
        electionResult[i].Abbreviation, electionResult[i].Total_EV, electionResult[i]];
    }
    var tiles = d3.select("#state").selectAll("rect").data(tile_data);

    tiles.exit().remove();
    tiles = tiles.enter().append("rect").merge(tiles);

    tiles
        .attr("x",function (d) {
            return d[1] * tile_width;
        })
        .attr("y", function (d) {
            return d[0]* tile_height;
        })
        .attr("width", tile_width)
        .attr("height", tile_height)
        .attr("class", "tile")
        .attr("fill", function (d) {
            if (d[5].RD_Difference == 0 && d[5].State_Winner == "I"){
                return "green";
            }else {
                return colorScale(d[2]);
            }
        });

    var texts = d3.select("#info").selectAll("text").data(tile_data);
    texts.exit().remove();
    texts = texts.enter().append("text").merge(texts);
    texts.selectAll("tspan").remove();

    texts
        .append("tspan")
        .attr("x", function (d) {
            return d[1] * tile_width + tile_width / 2 - 5;
        })
        .attr("y", function (d) {
            return d[0] * tile_height + tile_height / 2;
        })
        .html(function (d,i) {
            return d[3];
        })
        .attr("class", "tilestext");

    texts
        .append("tspan")
        .attr("x", function (d) {
            return d[1] * tile_width + tile_width / 2 - 5;
        })
        .attr("y", function (d) {
            return d[0] * tile_height + tile_height / 2 + 20;
        })
        .html(function (d) {
            return d[4];
        })
        .attr("class", "tilestext");

    d3.select("#tiles").select("svg").call(tip);
    tiles.on("mouseover", tip.show)
        .on("mouseout", tip.hide);
    texts.on("mouseover", tip.show)
        .on("mouseout", tip.hide);
};