
/**
 * Constructor for the ElectoralVoteChart
 *
 * @param shiftChart an instance of the ShiftChart class
 */
function MonthChart(){

    var self = this;
    self.selectedTeam = ""
    self.matchlist = self.parseMatches([],"");
    self.init();

};

MonthChart.prototype.parseMatches = function(data, selectedTeam){

    if (selectedTeam == "")
    {
        return [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37];
    }
    //parsedata
    //console.log(data);

    var teamMatchData = [];

    var count = 0;
    while(teamMatchData.length != 38) {
        //console.log(data[count]);
        if (data[count]["HomeTeam"] == selectedTeam || data[count]["AwayTeam"] == selectedTeam)
            teamMatchData.push(data[count]);
        count++;
    }
    return teamMatchData;
}
/**
 * Initializes the svg elements required for this chart
 */
MonthChart.prototype.init = function(){
    var self = this;

    self.margin = {top: 10, right: 20, bottom: 30, left: 50};

    //Gets access to the div element created for this chart from HTML
    var divmonthChart = d3.select("#month-chart").classed("fullView", true);
    self.svgBounds = divmonthChart.node().getBoundingClientRect();
    self.svgWidth = self.svgBounds.width - self.margin.left - self.margin.right;
    self.svgHeight = 50;
    //console.log(self.monthlist);
    self.rectWidth = self.svgWidth/(self.matchlist.length);
    //console.log(self.rectWidth)
    //creates svg element within the div
    divmonthChart.selectAll("svg").remove();
    self.svg = divmonthChart.append("svg")
        .attr("width",self.svgWidth)
        .attr("height",self.svgHeight);

    self.svg.append('g').attr('id', 'rects');
    self.svg.append('g').attr('id', 'months');
    self.svg.append('g').attr('id', 'string')
};

/**
 * Returns the class that needs to be assigned to an element.
 *
 * @param party an ID for the party that is being referred to.
 */

/*
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

*/
/**
 * Creates the stacked bar chart, text content and tool tips for electoral vote chart
 *
 * @param electionResult election data for the year selected
 * @param colorScale global quantile scale based on the winning margin between republicans and democrats
 */

MonthChart.prototype.update = function(selectedTeam, selectedData){
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
    //console.log("data");
    //console.log(selectedData);
    //console.log("team");
    //console.log(selectedTeam);
    self.matchlist = self.parseMatches(selectedData, selectedTeam);
    self.selectedTeam = selectedTeam;

    self.svg.select('#rects')
        .selectAll('rect')
        .remove();


    var rects = self.svg.select('#rects')
        .selectAll('rect')
        .data(self.matchlist)
        .enter()
        .append('rect');

    rects.attr('x', function(d,i) {return (i) * self.rectWidth;})
        .attr('y', 10)
        .attr('width', self.rectWidth)
        .attr('height', self.svgHeight - 20)
        .attr('class', 'tile')
        .attr('fill', function(d,i){
            console.log(d);
            if (d["HomeTeam"] == self.selectedTeam){
                if(d["FTR"] == "H")
                    return 'green';
                else if(d["FTR"] == "A")
                    return 'red'
                else
                    return 'gray'}
            else {
                if(d["FTR"] == "A")
                    return 'lightgreen';
                else if(d["FTR"] == "H")
                    return 'pink'
                else
                    return 'lightgray'
            };
        })
        //.on('click',function(d,i){displayMonth(i);});
/*
       displayMonth = function(j){
        var currentMonth = self.monthlist[j];

        self.svg.select('#rects')
            .selectAll('rect')
            .remove();
        //console.log(self.monthlist[i]);

        var newrects = self.svg.select('#rects')
            .selectAll('rect')
            .data(currentMonth)
            .enter()
            .append('rect');

        newrects.attr('x', function(d,i) {return (i) * self.svgWidth/currentMonth.length;})
            .attr('y', 10)
            .attr('width', self.svgWidth/currentMonth.length)
            .attr('height', self.svgHeight - 20)
            .attr('class', 'tile')
            .attr('fill', function(d,i){
                if (i % 2 == 0) return 'green';
                else return 'lightgreen';
            })
            .on('click', function(d,i){})
            .on('dblclick',function(d,i){
                console.log("here");
                self.svg.select('#rects')
                    .selectAll('rect')
                    .remove();

                displaySeason();} )

    }
    */

/*
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

*/

    //******* TODO: PART V *******
    //Implement brush on the bar chart created above.
    //Implement a call back method to handle the brush end event.
    //Call the update method of shiftChart and pass the data corresponding to brush selection.
    //HINT: Use the .brush class to style the brush.
/*
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
    */
}
