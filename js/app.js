var data = {
  master: {}
}


// ======================================================
// DRAW GRAPHIC CONTAINERS AND LABELS ===================
// ======================================================



var d3Sketch1 = function(){

  // Set up D3 =============
  var width = $("#timeline-container").width();
  var height = 40;

  var chordVizHeightRange = 2000

  var xScale = d3.scale.linear()
      .domain([0, 512])
      .range([0, width]);

  var yScale = d3.scale.linear()
      .domain([0, 512])
      .range([0, chordVizHeightRange]);



  // Make album containers =============
  var albumContainers = d3.select("#timeline-container")
    .selectAll(".album-container")
      .data(data.master)
    .enter().append("div")
      .attr("class", "album-container");

  // Add album labels =============
  albumContainers.append("div")
      .attr("class", "album-container__label-container")
    .append("h3")
      .attr("class", "album-container__label-container__label")
    .text(function(d) { return d["albumTitle"]; });

  // Make track containers =============
  var trackContainers = albumContainers.selectAll(".track-container")
      .data(function(d, i) { return d["tracks"]; })
    .enter().append("div")
      .attr("class", "track-container")
      .attr("id", function(d) { return "track-container--"+d["trackIndex"]; });

  // Add track labels =============
  var trackTitles = trackContainers.append("div")
      .attr("class", "track-container__label-container")
      .attr("id", function(d) { return "track-container__label-container--"+d["trackIndex"]; })
    .append("h4")  
      .attr("class", "track-container__label-container__label")
    .text(function(d) { return d["trackTitle"]; });


  // Add SVG container =============
  var trackSVGs = trackContainers.append("div")
      .attr("class", "track-container__svg-wrapper")
      .attr("id", function(d) { return "track-container__svg-wrapper--" + d["trackIndex"] })
    .append("svg")
      .attr("class", "track-container__svg-wrapper__svg")
      .attr("height", height)
      // for responsive svgs that scale with outer div:
      // .attr("preserveAspectRatio", "xMidYMid")
      // .attr("viewBox", "0 0 "+width+" "+height)



}


$(function(){

  // ======================================================
  // GET DATA ================================
  // ======================================================

  // Loading message
  $("#loading-message").html("loading data...");

  // "API" call
  d3.json("/data/dataMaster.json", function(error, json) {
    if (error) return console.warn(error);
    data.master = json.beatlesData;

    // Clear loading message
    $("#loading-message").empty();

    d3Sketch1();


  })
  
})