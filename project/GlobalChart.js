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
    console.log(sorted_final_ranking);

}