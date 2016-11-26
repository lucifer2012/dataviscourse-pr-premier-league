/**
 * Created by Chen on 11/9/16.
 */
var data_set;
function TeamChart() {
    var self = this;
    //self.data = data;
    self.init();
};

TeamChart.prototype.init = function(){
    self.margin = {top: 10, right: 20, bottom: 30, left: 50};
    var divyearChart = d3.select("#team-chart").classed("fullView", true);

    //Gets access to the div element created for this chart from HTML
    self.svgBounds = divyearChart.node().getBoundingClientRect();
    self.svgWidth = self.svgBounds.width - self.margin.left - self.margin.right;
    self.svgHeight = 120;

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

    var pc = new PropertyChart();
    var year = value;
    //load csv file
    d3.csv(value + ".csv", function (data) {
        data.forEach(function (d) {
            d.FTHG = +d.FTHG;
            d.FTAG = +d.FTAG;
            d.HTHG = +d.HTHG;
            d.HTAG = +d.HTAG;
        })
        data_set = data;
        main_update();
    });

    function main_update() {
        //to get names of the clubs
        var teams = [];
        var counter = 0;
        while (teams.length != 20){
            if(teams.indexOf(data_set[counter].HomeTeam) == -1){
                teams.push(data_set[counter].HomeTeam);
            }
            counter++;
        }
        teams = teams.sort();
        console.log(teams);
        //To add tooltips
        tip = d3.tip()
            .attr('class', 'd3-tip')
            .direction("s")
            .offset(function() {
                return [0,0];
            })
            .html(function (d) {
                return self.tooltip_render(d);
            });


        //To add badges of teams
        var svg = d3.select("#team-chart").select("svg").node().getBoundingClientRect();
        var svgWidth = svg.width;
        //var svgHeight = svg.height;

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

        imgs.on("click", function (d,i) {
            //calendarChart.update(teams[i])
            pc.update(teams[i], data_set);

            imgs.classed("selectTeam", false)
                .attr("x",function (d,j) {
                    return svgWidth / 20 * j + 25;
                })
                .attr("y", 30);

            imgs.filter(function (d,j) {
                return j==i;
            })
                .attr("x",function (d,j) {
                    return svgWidth / 20 * i + 12.5;
                })
                .attr("y", 20)
                .classed("selectTeam", true);

        });

        d3.select("#team-chart").select("svg").call(tip);
        imgs
            .on("mouseover", tip.show)
            .on("mouseout",tip.hide);
    }
}

