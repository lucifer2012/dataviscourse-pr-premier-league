/**
 * Created by Chen on 2016/11/26.
 */
function GlobalChart() {
    var self = this;
    self.init();
}

GlobalChart.prototype.init = function () {
    var self = this;
    d3.select("#global-chart").select("svg").remove();
    self.svg = d3.select("#global-chart").append("svg")
        .attr("width", "900")
        .attr("height", "500");
    self.svg.append("g").attr("id", "xAxis");
    self.svg.append("g").attr("id", "yAxis");
    self.svg.append("g").attr("id", "circles")
}

GlobalChart.prototype.update = function (teamsData, attack_rank, defense_rank) {
    var self = this;
    var final_ranking = {};
    var counter = 0;
    while(Object.keys(final_ranking).length != 20){
        if(!(final_ranking.hasOwnProperty(teamsData[counter].HomeTeam))){
            final_ranking[teamsData[counter].HomeTeam] = teamsData[counter].Ranking;
        }
        counter++;
    }
    
    var sorted_final_ranking = Object.keys(final_ranking).sort(function (a,b) {
        return final_ranking[a] - final_ranking[b];
    })


    //create the axis
    var svg = d3.select("#global-chart").select("svg");

    var yscale = d3.scaleLinear().domain([0,20]).range([450, 50]);
    var yAxis = d3.axisLeft().scale(yscale);
    var xscale = d3.scaleLinear().domain([0,20]).range([70, 850]);
    var xAxis = d3.axisBottom(xscale);

    d3.select("#xAxis")
        .attr("transform", "translate(0,450)")
        .call(xAxis)
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", "-.3em")
        .attr("transform", "rotate(-90)");

    d3.select("#yAxis").attr("transform", "translate(70,0)").call(yAxis);

    //create circles, which represent the rankings.
    var circles = d3.select("#circles").selectAll("circle").data(sorted_final_ranking);

    //relation between final ranking and attach capability
    circles.enter()
        .append("circle")
        .attr("cx", function (d) {
            return xscale(sorted_final_ranking.indexOf(d));
        })
        .attr("cy", function (d) {
            return yscale(attack_rank.indexOf(d));
        })
        .attr("r", 10)
        .attr("fill", "gold");

    //relation between final ranking and defense capability
    circles.enter()
        .append("circle")
        .attr("cx", function (d) {
            return xscale(sorted_final_ranking.indexOf(d));
        })
        .attr("cy", function (d) {
            return yscale(defense_rank.indexOf(d));
        })
        .attr("r", 10)
        .attr("fill", "steelblue");

}