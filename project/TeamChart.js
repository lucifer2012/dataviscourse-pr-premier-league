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

TeamChart.prototype.tooltip_render = function (tooltip_data) {
    var self = this;
    return tooltip_data;
}

TeamChart.prototype.update = function(value){
    var self = this;

    //load csv file
    d3.csv(value + ".csv", function (data) {
        self.data = data
    });

    //to get names of the clubs
    var teams = [];
    var counter = 0;
    while (teams.length != 20){
        if(teams.indexOf(self.data[counter].HomeTeam) == -1){
            teams.push(self.data[counter].HomeTeam);
        }
        counter++;
    }
    teams = teams.sort();

    //To add tooltips
    tip = d3.tip().attr('class', 'd3-tip')
        .direction('s')
        .offset(function() {
            return [0,150];
        })
        .html(function (d) {
            return self.tooltip_render(d);
        });


    //To add badges of teams
    var svg = d3.select("#team-chart").select("svg").node().getBoundingClientRect();
    var svgWidth = svg.width;
    var svgHeight = svg.height;

    var imgs = d3.select("#team-chart").select("svg").selectAll("image").data(teams);

    imgs.exit().remove();

    imgs = imgs.enter().append("image").merge(imgs);
    imgs
        .attr("x",function (d,i) {
            return svgWidth / 20 * i + 25;
        })
        .attr("y", 30)
        .attr("height", 50)
        .attr("width", 50)
        .attr("xlink:href", function (d) {
            return "figs/" + d + ".png";
        });
    d3.select("#team-chart").select("svg").call(tip);
    imgs
        .on("mouseover", tip.show)
        .on("mouseout",tip.hide);

}

