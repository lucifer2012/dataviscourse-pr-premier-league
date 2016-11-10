/**
 * Created by Chen on 11/8/16.
 */
(function () {
    var instance = null;

    function init() {
        //var teamChart = new TeamChart();
        // var calendarChart = new CalendarChart();
        // var singleTeamChart = new SingleTeamChart();
        // var globalChart = GlobalChart();
        // var brushChart = BrushChart();

        d3.csv("15-16.csv", function (data) {
            //pass the instances of all the charts that update on selection change in YearChart
            var teamchart = new TeamChart(data);
            teamchart.update();
        });
    }

    function Main(){
        if(instance  !== null){
            throw new Error("Cannot instantiate more than one Class");
        }
    }

    Main.getInstance = function(){
        var self = this
        if(self.instance == null){
            self.instance = new Main();

            //called only once when the class is initialized
            init();
        }
        return instance;
    }

    Main.getInstance();
})();