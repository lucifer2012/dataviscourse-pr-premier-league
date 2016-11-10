
/**
 * Constructor for the ElectoralVoteChart
 *
 * @param shiftChart an instance of the ShiftChart class
 */
function ElectoralVoteChart(){

    var self = this;
    self.init();
};

/**
 * Initializes the svg elements required for this chart
 */
ElectoralVoteChart.prototype.init = function(){
    var self = this;
    self.margin = {top: 30, right: 20, bottom: 30, left: 50};

    //Gets access to the div element created for this chart from HTML
    var divelectoralVotes = d3.select("#electoral-vote").classed("content", true);
    self.svgBounds = divelectoralVotes.node().getBoundingClientRect();
    self.svgWidth = self.svgBounds.width - self.margin.left - self.margin.right;
    self.svgHeight = 150;

    //creates svg element within the div
    self.svg = divelectoralVotes.append("svg")
        .attr("width",self.svgWidth)
        .attr("height",self.svgHeight)
};

/**
 * Returns the class that needs to be assigned to an element.
 *
 * @param party an ID for the party that is being referred to.
 */
ElectoralVoteChart.prototype.chooseClass = function (party) {
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
 * Creates the stacked bar chart, text content and tool tips for electoral vote chart
 *
 * @param electionResult election data for the year selected
 * @param colorScale global quantile scale based on the winning margin between republicans and democrats
 */

ElectoralVoteChart.prototype.update = function(electionResult, colorScale){
    var self = this;

    // ******* TODO: PART II *******

    //Group the states based on the winning party for the state;
    //then sort them based on the margin of victory

    //Create the stacked bar chart.
    //Use the global color scale to color code the rectangles.
    //HINT: Use .electoralVotes class to style your bars.

    //Display total count of electoral votes won by the Democrat and Republican party
    //on top of the corresponding groups of bars.
    //HINT: Use the .electoralVoteText class to style your text elements;  Use this in combination with
    // chooseClass to get a color based on the party wherever necessary

    //Display a bar with minimal width in the center of the bar chart to indicate the 50% mark
    //HINT: Use .middlePoint class to style this bar.

    //Just above this, display the text mentioning the total number of electoral votes required
    // to win the elections throughout the country
    //HINT: Use .electoralVotesNote class to style this text element

    //HINT: Use the chooseClass method to style your elements based on party wherever necessary.


    function sortStates(a,b) {
        return a - b;
    };


    var stateData = electionResult.sort(function (a, b) {
        return a.RD_Difference - b.RD_Difference;
    });

    var new_stateData = [];
    var counter = 0;
    var indepen_pos = -1;
    for (var i = 0; i <= stateData.length - 1; i++){
        if(stateData[i].State_Winner == "I"){
            new_stateData[counter] = stateData[i];
            counter++;
            indepen_pos++;
        }
    }
    var len = new_stateData.length;
    for (var i = 0; i <= stateData.length - 1; i++){
        if(stateData[i].State_Winner != "I"){
            new_stateData[counter] = stateData[i];
            counter++;
        }
    }

    var electBars = d3.select("#electoral-vote").select("svg").selectAll("rect").data(new_stateData);

    electBars.exit().remove();
    d3.select("#electoral-vote").select("svg").selectAll("text").remove();
    d3.select("#electoral-vote").select("svg").selectAll("line").remove();


    electBars = electBars.enter()
         .append("rect")
         .merge(electBars);

    //to compute x pos
    var x_pos = [0,];
    var padding = 2;

    for (var i = 0; i < new_stateData.length; i++){
            new_pos = x_pos[i] + new_stateData[i].Total_EV * 1.8 + padding;
            x_pos.push(new_pos);
    }

    electBars
        .attr("x",function (d,i) {
            return x_pos[i];
        })
        .attr("y", 40)
        .attr("width",function (d) {
            return d.Total_EV * 1.8;
        })
        .attr("height", 60)
        .attr("fill", function (d) {
            if(d.State_Winner == "R" || d.State_Winner == "D"){
                return colorScale(d.RD_Difference);
            } else{
                return "#45AD6A";
            }
        });


    var Width = parseInt(d3.select("#electoral-vote").select("svg").style("width"), 10);

    d3.select("#electoral-vote").select("svg")
        .append("line")
        .attr("x1", Width / 2)
        .attr("y1", 25)
        .attr("x2", Width / 2)
        .attr("y2", 115)
        .attr("stroke", "black")
        .attr("stroke-width", 2);

    var indepen_vote = 0;
    var demo_vote = 0;
    var repub_vote = 0;

    for (var i = 0; i <= new_stateData.length - 1; i++){
        if(new_stateData[i].State_Winner == "R"){
            repub_vote += new_stateData[i].Total_EV;
        } else if(new_stateData[i].State_Winner == "D"){
            demo_vote += new_stateData[i].Total_EV;
        } else if(new_stateData[i].State_Winner == "I"){
            indepen_vote += new_stateData[i].Total_EV;
        }
    }
    var half = Math.ceil((indepen_vote + demo_vote + repub_vote) / 2) + 1;

    d3.select("#electoral-vote").select("svg")
        .append("text")
        .attr("x", Width / 2 - 80)
        .attr("y", 20)
        .text("Electoral Vote:" + half + " needed to win");

    d3.select("#electoral-vote").select("svg")
        .append("text")
        .attr("x", function () {
            return x_pos[indepen_pos + 2];
        } )
        .attr("y", 30)
        .text(demo_vote)
        .attr("class", "democrat");

    if (indepen_pos >= 0){
        d3.select("#electoral-vote").select("svg")
            .append("text")
            .attr("x", function () {
                return 20;
            })
            .attr("y", 30)
            .text(indepen_vote)
            .attr("class", "independent");
    }


    d3.select("#electoral-vote").select("svg")
        .append("text")
        .attr("x",Width - 40)
        .attr("y", 30)
        .text(repub_vote)
        .attr("class", "republican");



    //******* TODO: PART V *******
    //Implement brush on the bar chart created above.
    //Implement a call back method to handle the brush end event.
    //Call the update method of shiftChart and pass the data corresponding to brush selection.
    //HINT: Use the .brush class to style the brush.

    var brushed = function () {
        //d3.event.selection
        self.shiftchart = new ShiftChart;
        var start = d3.event.selection[0];
        var end = d3.event.selection[1];
        var selectedStates = [];

        for (var i = 0; i < x_pos.length; i++){
            if((x_pos[i] >= start && x_pos[i] <= end) ||
                (x_pos[i+1] -2 >= start && x_pos[i+1] -2 <= end)||
                (x_pos[i] <= start && x_pos[i+1] >= end)){
                if(new_stateData[i] != undefined){
                    selectedStates.push(new_stateData[i].State);
                }
            }
        }
        self.shiftchart.update(selectedStates);
    }

    var brush = d3.brushX().extent([[0, 30], [self.svg.attr('width'), 110]])
        .on('end', brushed);

    self.svg.append('g').attr('class', 'brush').call(brush);
};
