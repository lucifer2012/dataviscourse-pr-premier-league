/**
 * Created by Chen on 11/9/16.
 */
// function print() {
//     console.log(document.getElementById('season').value);
// }

function TeamChart(data) {
    var self = this;
    self.data = data;
    self.init();
};

TeamChart.prototype.init = function(){
    self.margin = {top: 10, right: 20, bottom: 30, left: 50};
    var divyearChart = d3.select("#team-chart").classed("fullView", true);

    //Gets access to the div element created for this chart from HTML
    self.svgBounds = divyearChart.node().getBoundingClientRect();
    self.svgWidth = self.svgBounds.width - self.margin.left - self.margin.right;
    self.svgHeight = 100;

    //creates svg element within the div
    self.svg = divyearChart.append("svg")
        .attr("width",self.svgWidth)
        .attr("height",self.svgHeight)
}

TeamChart.prototype.update = function(value){
    var self = this;
    d3.csv(value + ".csv", function (data) {
        self.data = data
    });
    var teams = [];

    for(var i = 0; i < 20; i++){
        teams[i] = self.data[i].HomeTeam;
    }
    teams = teams.sort();
    console.log(teams);
    var svg = d3.select("#team-chart").select("svg").node().getBoundingClientRect();
    var svgWidth = svg.width;
    var svgHeight = svg.height;

    var imgs = d3.select("#team-chart").select("svg").selectAll("image").data(teams);

    imgs.enter()
        .append("image")
        .attr("x",function (d,i) {
            return svgWidth / 20 * i + 25;
        })
        .attr("y", 30)
        .attr("height", 50)
        .attr("width", 50)
        .attr("xlink:href", function (d) {
            return "figs/" + d + ".png";
        });

}

