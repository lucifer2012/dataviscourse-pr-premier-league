
/**
 * Constructor for the ShiftChart
 */
function ShiftChart(){
    var self = this;
    self.init();
};

/**
 * Initializes the svg elements required for this chart;
 */
ShiftChart.prototype.init = function(){
    var self = this;
    self.divShiftChart = d3.select("#shiftChart").classed("sideBar", true);
};

/**
 * Creates a list of states that have been selected by brushing over the Electoral Vote Chart
 *
 * @param selectedStates data corresponding to the states selected on brush
 */
ShiftChart.prototype.update = function(selectedStates){
    var self = this;

    // ******* TODO: PART V *******
    //Display the names of selected states in a list
    var statenames = d3.select("#stateList").append("ul");
    statenames = statenames.selectAll("li").data(selectedStates);
    d3.select("#stateList").selectAll("li").remove();
    statenames = statenames.enter().append("li").merge(statenames);
    d3.select("#stateList").selectAll("text").remove();

    statenames.append("text")
        .text(function (d) {
            return d;
        })
        .attr("class", "brushtext");
    //******** TODO: PART VI*******
    //Use the shift data corresponding to the selected years and sketch a visualization
    //that encodes the shift information

    //******** TODO: EXTRA CREDIT I*******
    //Handle brush selection on the year chart and sketch a visualization
    //that encodes the shift informatiomation for all the states on selected years

    //******** TODO: EXTRA CREDIT II*******
    //Create a visualization to visualize the shift data
    //Update the visualization on brush events over the Year chart and Electoral Vote Chart

};
