/**
 * Constructor for the Vote Percentage Chart
 */
function VotePercentageChart(){

    var self = this;
    self.init();
};

/**
 * Initializes the svg elements required for this chart
 */
VotePercentageChart.prototype.init = function(){
    var self = this;
    self.margin = {top: 30, right: 20, bottom: 30, left: 50};
    var divvotesPercentage = d3.select("#votes-percentage").classed("content", true);

    //Gets access to the div element created for this chart from HTML
    self.svgBounds = divvotesPercentage.node().getBoundingClientRect();
    self.svgWidth = self.svgBounds.width - self.margin.left - self.margin.right;
    self.svgHeight = 200;

    //creates svg element within the div
    self.svg = divvotesPercentage.append("svg")
        .attr("width",self.svgWidth)
        .attr("height",self.svgHeight)
};

/**
 * Returns the class that needs to be assigned to an element.
 *
 * @param party an ID for the party that is being referred to.
 */
VotePercentageChart.prototype.chooseClass = function (party) {
    var self = this;
    if (party == "R"){
        return "republican";
    }
    else if (party == "D"){
        return "democrat";
    }
    else if (party == "I"){
        return "independent";
    }
}

/**
 * Renders the HTML content for tool tip
 *
 * @param tooltip_data information that needs to be populated in the tool tip
 * @return text HTML content for toop tip
 */
VotePercentageChart.prototype.tooltip_render = function (tooltip_data) {
    var self = this;
    var text = "<ul>";
    tooltip_data.result.forEach(function(row){
        text += "<li class = " + self.chooseClass(row.party)+ ">" + row.nominee+":\t\t"+row.votecount+"("+row.percentage+"%)" + "</li>"
    });

    return text;
}

/**
 * Creates the stacked bar chart, text content and tool tips for Vote Percentage chart
 *
 * @param electionResult election data for the year selected
 */
VotePercentageChart.prototype.update = function(electionResult){
    var self = this;
    var tooltip_data = electionResult[0];
    //Use this tool tip element to handle any hover over the chart
    tip = d3.tip().attr('class', 'd3-tip')
        .direction('s')
        .offset(function() {
            return [0,150];
        })
        .html(function(d) {
            /* populate data in the following format
             * tooltip_data = {
             * "result":[
             * {"nominee": D_Nominee_prop,"votecount": D_Votes,"percentage": D_Percentage,"party":"D"} ,
             * {"nominee": R_Nominee_prop,"votecount": R_Votes,"percentage": R_Percentage,"party":"R"} ,
             * {"nominee": I_Nominee_prop,"votecount": I_Votes,"percentage": I_Percentage,"party":"I"}
             * ]
             * }
             * pass this as an argument to the tooltip_render function then,
             * return the HTML content returned from that method.
             * */
            if (tooltip_data.I_PopularPercentage != 0){
                tooltip_render_data = {
                    "result":[
                        {"nominee": tooltip_data.D_Nominee, "votecount":tooltip_data.D_Votes, "percentage":tooltip_data.D_PopularPercentage, "party": "D"},
                        {"nominee": tooltip_data.R_Nominee, "votecount":tooltip_data.R_Votes, "percentage":tooltip_data.R_PopularPercentage, "party": "R"},
                        {"nominee": tooltip_data.I_Nominee, "votecount":tooltip_data.I_Votes, "percentage":tooltip_data.I_PopularPercentage, "party": "I"}
                    ]
                }
            } else {
                tooltip_render_data = {
                    "result":[
                        {"nominee": tooltip_data.D_Nominee, "votecount":tooltip_data.D_Votes_Total, "percentage":tooltip_data.D_PopularPercentage, "party": "D"},
                        {"nominee": tooltip_data.R_Nominee, "votecount":tooltip_data.R_Votes_Total, "percentage":tooltip_data.R_PopularPercentage, "party": "R"}
                    ]}
            }
            return self.tooltip_render(tooltip_render_data);
        });


    // ******* TODO: PART III *******

    //Create the stacked bar chart.
    //Use the global color scale to color code the rectangles.
    //HINT: Use .votesPercentage class to style your bars.

    //Display the total percentage of votes won by each party
    //on top of the corresponding groups of bars.
    //HINT: Use the .votesPercentageText class to style your text elements;  Use this in combination with
    // chooseClass to get a color based on the party wherever necessary

    //Display a bar with minimal width in the center of the bar chart to indicate the 50% mark
    //HINT: Use .middlePoint class to style this bar.

    //Just above this, display the text mentioning details about this mark on top of this bar
    //HINT: Use .votesPercentageNote class to style this text element

    //Call the tool tip on hover over the bars to display stateName, count of electoral votes.
    //then, vote percentage and number of votes won by each party.

    //HINT: Use the chooseClass method to style your elements based on party wherever necessary.

    //console.log(electionResult);
    var votes_svg = d3.select("#votes-percentage").select("svg");
    var svg_width = votes_svg.node().getBoundingClientRect().width;
    var svg_height = votes_svg.node().getBoundingClientRect().height;

    var mapScale = d3.scaleLinear().domain([0,100]).range([0, svg_width]);

    var indepen_pos = 0;
    var demo_pos = mapScale(electionResult[0].I_PopularPercentage);
    var repub_pos = mapScale(electionResult[0].D_PopularPercentage);

    var percent_data = [[indepen_pos, demo_pos], [demo_pos, repub_pos],
        [repub_pos + demo_pos, mapScale(electionResult[0].R_PopularPercentage)]];

    var percentage_bar = d3.select("#votes-percentage").select("svg").selectAll("rect").data(percent_data);

    percentage_bar.exit().remove();
    d3.select("#votes-percentage").select("svg").selectAll("text").remove();
    d3.select("#votes-percentage").select("svg").select("line").remove();

    percentage_bar = percentage_bar.enter().append("rect").merge(percentage_bar);

    percentage_bar.attr("x", function (d) {
        return d[0];
    })
        .attr("y", svg_height / 2 + 30)
        .attr("width", function (d) {
            return d[1];
        })
        .attr("height", 50)
        .attr("class", function (d,i) {
            if (i == 0){
                return "independent";
            } else if(i == 1){
                return "democrat";
            } else {
                return "republican";
            }
        });

    //console.log(electionResult[0]);
    var name_list = [];
    name_list[0] = electionResult[0].I_Nominee;
    name_list[1] = electionResult[0].D_Nominee;
    name_list[2] = electionResult[0].R_Nominee;

    //To display nominee
    var pos_list = [0, indepen_pos + demo_pos + 150, mapScale(100) - 50]
    d3.select("#votes-percentage").select("svg").selectAll("nominee").data(name_list)
        .enter()
        .append("text")
        .attr("x", function (d,i) {
            if (i == 1 && name_list[0] == ""){
                return 0;
            } else {
                return pos_list[i];
            }
        })
        .attr("y", svg_height / 2 - 20)
        .text(function (d) {
            return d;
        })
        .attr("class", function (d,i) {
            if (i == 0){
                return "independent";
            } else if(i == 1){
                return "democrat";
            } else {
                return "republican";
            }
        });

    d3.select("#votes-percentage")
        .select("svg")
        .append("text")
        .attr("x", svg_width / 2 - 60)
        .attr("y", svg_height / 2 -10)
        .text("Popular Vote (50%)");

    var percent_list = [electionResult[0].I_PopularPercentage, electionResult[0].D_PopularPercentage,
        electionResult[0].R_PopularPercentage];

    d3.select("#votes-percentage").select("svg").selectAll("percent")
        .data(percent_list)
        .enter()
        .append("text")
        .attr("x", function (d,i) {
            if (i == 1 && name_list[0] == ""){
                return 0;
            } else {
                return pos_list[i];
            }
        })
        .attr("y", svg_height / 2 + 10)
        .text(function (d) {
            if (d == 0){
                return "";
            } else {
                return d + "%";
            }
        })
        .attr("class", function (d,i) {
            if (i == 0){
                return "independent";
            } else if(i == 1){
                return "democrat";
            } else {
                return "republican";
            }
        });

    d3.select("#votes-percentage").select("svg")
        .append("line")
        .attr("x1", svg_width / 2)
        .attr("y1", svg_height / 2)
        .attr("x2", svg_width / 2)
        .attr("y2", svg_height)
        .attr("stroke", "black")
        .attr("stroke-width", "2px");

    d3.select("#votes-percentage").select("svg").call(tip);
    percentage_bar.on("mouseover", tip.show)
        .on("mouseout", tip.hide);
};
