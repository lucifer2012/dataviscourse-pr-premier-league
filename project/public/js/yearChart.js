/**
 * Constructor for the Year Chart
 *
 * @param electoralVoteChart instance of ElectoralVoteChart
 * @param tileChart instance of TileChart
 * @param votePercentageChart instance of Vote Percentage Chart
 * @param electionInfo instance of ElectionInfo
 * @param electionWinners data corresponding to the winning parties over mutiple election years
 */
function YearChart(electoralVoteChart, tileChart, votePercentageChart, electionWinners) {
    var self = this;

    self.electoralVoteChart = electoralVoteChart;
    self.tileChart = tileChart;
    self.votePercentageChart = votePercentageChart;
    self.electionWinners = electionWinners;
    self.init();
};

/**
 * Initializes the svg elements required for this chart
 */
YearChart.prototype.init = function(){
    self.margin = {top: 10, right: 20, bottom: 30, left: 50};
    var divyearChart = d3.select("#year-chart").classed("fullView", true);

    //Gets access to the div element created for this chart from HTML
    self.svgBounds = divyearChart.node().getBoundingClientRect();
    self.svgWidth = self.svgBounds.width - self.margin.left - self.margin.right;
    self.svgHeight = 100;

    //creates svg element within the div
    self.svg = divyearChart.append("svg")
        .attr("width",self.svgWidth)
        .attr("height",self.svgHeight)

};

/**
 * Returns the class that needs to be assigned to an element.
 *
 * @param party an ID for the party that is being referred to.
 */
YearChart.prototype.chooseClass = function (party) {
    var self = this;
    if (party == "R") {
        return "yearChart republican";
    }
    else if (party == "D") {
        return "yearChart democrat";
    }
    else if (party == "I") {
        return "yearChart independent";
    }
}


/**
 * Creates a chart with circles representing each election year, populates text content and other required elements for the Year Chart
 */
YearChart.prototype.update = function(){
    var self = this;

    //Domain definition for global color scale
    var domain = [-60,-50,-40,-30,-20,-10,0,10,20,30,40,50,60 ];

    //Color range for global color scale
    var range = ["#0066CC", "#0080FF", "#3399FF", "#66B2FF", "#99ccff", "#CCE5FF", "#ffcccc", "#ff9999", "#ff6666", "#ff3333", "#FF0000", "#CC0000"];

    //Global colorScale to be used consistently by all the charts
    self.colorScale = d3.scaleQuantile()
        .domain(domain).range(range);

    // ******* TODO: PART I *******

    // Create the chart by adding circle elements representing each election year
    //The circles should be colored based on the winning party for that year
    //HINT: Use the .yearChart class to style your circle elements
    //HINT: Use the chooseClass method to choose the color corresponding to the winning party.

    //Append text information of each year right below the corresponding circle
    //HINT: Use .yeartext class to style your text elements

    //Style the chart by adding a dashed line that connects all these years.
    //HINT: Use .lineChart to style this dashed line

    //Clicking on any specific year should highlight that circle and  update the rest of the visualizations
    //HINT: Use .highlighted class to style the highlighted circle

    //Election information corresponding to that year should be loaded and passed to
    // the update methods of other visualizations

    // dashed lines
    d3.select("#year-chart").select("svg")
        .append("line")
        .attr("x1", 10)
        .attr("y1", self.svgHeight / 2)
        .attr("x2", 1600)
        .attr("y2", self.svgHeight / 2)
        .attr("stroke-dasharray", (5,5))
        .attr("stroke", "black");

    //console.log(this.electionWinners);

    var year_circles = d3.select("#year-chart").select("svg").selectAll().data(this.electionWinners);

    year_circles
        .enter()
        .append("circle")
        .attr("cx",function (d,i){
            return 60 + i * 80;
        })
        .attr("cy", self.svgHeight / 2)
        .attr("r",8)
        .attr("class", function (d) {
            if(d.PARTY == "D"){
                return "democrat";
            } else if (d.PARTY == "R") {
                return "republican";
            } else {
                return "independent";
            }
        })
        .on("mouseover", function (d,i) {
            d3.select("#year-chart")
                .select("svg")
                .selectAll("circle")
                .attr("class",function (d,m) {
                    if(d.PARTY == "D" && m == i){
                        return "democrat highlighted";
                    } else if (d.PARTY == "R" && m == i) {
                        return "republican highlighted";
                    } else if (d.PARTY == "I" && m == i){
                        return "independent highlighted";
                    } else if (d.PARTY == "D"){
                        return "democrat";
                    } else if (d.PARTY == "R"){
                        return "republican";
                    } else {
                        return "independent";
                    }
                });
        })
        .on("click", function (d,i) {
            d3.select("#year-chart")
                .select("svg")
                .selectAll("circle")
                .attr("class",function (d,m) {
                    // circles.classed("selected", false);
                    // d3.select(this).classed("selected", true);
                    if(d.PARTY == "D" && m == i){
                        return "democrat selected";
                    } else if (d.PARTY == "R" && m == i) {
                        return "republican selected";
                    } else if (d.PARTY == "I" && m == i){
                        return "independent selected";
                    } else if (d.PARTY == "D"){
                        return "democrat";
                    } else if (d.PARTY == "R"){
                        return "republican";
                    } else {
                        return "independent";
                    }
                });

            //load the corresponding csv
            csv_file = "./data/Year_Timeline_" + d.YEAR + ".csv";

            d3.csv(csv_file, function (data) {

                data.forEach(function (d) {
                    d.D_EV_Total = +d.D_EV_Total;
                    d.Total_EV = +d.Total_EV;
                    d.RD_Difference = +d.RD_Difference;
                    d.D_PopularPercentage = parseFloat(d.D_PopularPercentage);
                    d.I_PopularPercentage = parseFloat(d.I_PopularPercentage) || 0;
                    d.R_PopularPercentage = parseFloat(d.R_PopularPercentage);
                    d.D_Votes_Total = +d.D_Votes_Total;
                    d.R_Votes_Total = +d.R_Votes_Total;
                    d.I_Votes_Total = +d.I_Votes_Total || 0;
                    d.Row = +d.Row || 0;
                    d.Space = +d.Space || 0;
                    d.Winner_Percentage = +d.Winner_Percentage || 0;
                    d.Last_RD_Difference = +d.Last_RD_Difference || 0;
                });
                self.electoralVoteChart.update(data,self.colorScale);
                self.votePercentageChart.update(data);
                self.tileChart.update(data, self.colorScale);
            });
        });

    //text in year tiles
    year_texts = d3.select("#year-chart").select("svg").selectAll("text").data(this.electionWinners);

    year_texts
        .enter()
        .append("text")
        .attr("dx", function (d,i) {
            return 40 + i * 80;
        })
        .attr("dy", self.svgHeight / 2 + 40)
        .text(function (d) {
            return d.YEAR;
        })
        .attr("class", "tiletext");




    //******* TODO: EXTRA CREDIT *******

    //Implement brush on the year chart created above.
    //Implement a call back method to handle the brush end event.
    //Call the update method of shiftChart and pass the data corresponding to brush selection.
    //HINT: Use the .brush class to style the brush.


    //The brush function is only applied on the text, namely the years in the chart. So it
    //will only work when you select on the years text. I hope this is what you want as the
    // question never asks to do it on the whole chart.
    var election_data = this.electionWinners
    var brushed = function () {
        self.shiftchart = new ShiftChart;
        var start = d3.event.selection[0];
        var end = d3.event.selection[1];
        console.log(start,end);
        var years = [];
        //console.log(new_stateData);
        for (var i = 0; i < election_data.length; i++){
            var year_start = 40 + i * 80;
            var year_end = 80 + i * 80;
            if((year_start >= start && year_start <= end) ||
                (year_end >= start && year_end <= end)||
                (year_start <= start && year_end  >= end)){
                years.push(1940 + 4 * i);
            }
        }
        self.shiftchart.update(years);
    }
    var brush = d3.brushX().extent([[0, self.svgHeight * 0.75], [self.svgWidth, self.svgHeight]])
        .on('end', brushed);

    self.svg.append('g').attr('class', 'brush').call(brush);
};
