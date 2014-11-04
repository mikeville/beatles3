var data = {
  master: {}
}


// ======================================================
// DRAW GRAPHIC CONTAINERS AND LABELS ===================
// ======================================================



var d3Sketch1 = function(){

  // Set up D3 =============
  var width = $('#timeline-container').width();
  var height = 40;

  maxTime = 540

  var chordVizHeightRange = 2000

  var xScale = d3.scale.linear()
      .domain([0, maxTime])
      .range([0, width]);  

  var yScale = d3.scale.linear()
      .domain([0, maxTime])
      .range([0, chordVizHeightRange]);

  var animationDuration = 1000;



  // Make album containers =============
  var albumContainers = d3.select('#timeline-container')
    .selectAll('.album-container')
      .data(data.master)
    .enter().append('div')
      .attr('class', 'album-container');

  // Add album labels =============
  albumContainers.append('div')
      .attr('class', 'album-container__label-container')
    .append('h3')
      .attr('class', 'album-container__label-container__label')
    .text(function(d) { return d['albumTitle']; });

  // Make track containers =============
  var trackContainers = albumContainers.selectAll('.track-container')
      .data(function(d, i) { return d['tracks']; })
    .enter().append('div')
      .attr('class', 'track-container')
      .attr('id', function(d) { return 'track-container--'+d['trackIndex']; });

  // Add track labels =============
  var trackTitles = trackContainers.append('div')
      .attr('class', 'track-container__label-container')
      .attr('id', function(d) { return 'track-container__label-container--'+d['trackIndex']; })
    .append('h4')  
      .attr('class', 'track-container__label-container__label')
    .text(function(d) { return d['trackTitle']; });


  // Add SVG container =============
  var trackSVGs = trackContainers.append('div')
      .attr('class', 'track-container__svg-wrapper')
      .attr('id', function(d) { return 'track-container__svg-wrapper--' + d['trackIndex'] })
    .append('svg')
      .attr('class', 'track-container__svg-wrapper__svg')
      .attr('height', height)
      // for responsive svgs that scale with outer div:
      // .attr('preserveAspectRatio', 'xMidYMid')
      // .attr('viewBox', '0 0 '+width+' '+height)

  // Add segment rectangles into SVG =============
  // var trackSegments = trackSVGs.selectAll('rect')
  //     .data(function(d, i) { return d['segments'] })
  //   .enter().append('rect')
  //     .attr('x', function(d, i) {return xScale(d.start) })
  //     .attr('y', 0)
  //     .style('width', function(d) { return xScale(d.end-d.start)+'px' })
  //     .style('height', height+'px')
  //     .attr('class', function(d) { return 'tooltip segment segment_'+d.segType })
  //     .attr('title', function(d) { return d.segType })


  var trackSegments = trackSVGs.selectAll('rect')
      .data(function(d, i) { return d['segments'] })
    .enter().append('rect')
        .attr('x', function(d, i) { return xScale(d.start) })
        .attr('y', 0)
        .attr('width', function(d) { return xScale(d.end-d.start) })
        .attr('height', '100%')
        .attr('class', function(d) { return 'segment_'+d.segType })


  // Add notes containers =============
  trackContainers.append('div')
      .attr('class', 'track-container__notes-container')
      .attr('id', function(d) { return 'track-container__notes-container--' + d['trackIndex'] })
    .append('p')
      .text(function(d) { return d['notes']; })

  // ======================================================
  // DRAW MAIN GRAPHICS + TRANSITIONS =====================
  // ======================================================




  var segmentsSortDefault = function(){
    trackSegments
        // .transition()
        //   .duration(animationDuration)
        // .attr('x', function(d, i) { return xScale(d.start) })
        // .attr('y', 0)
        .style('width', function(d) { return xScale(d.end-d.start)+'px' })
        .style('height', height+'px')
        .attr('class', function(d) { return 'tooltip segment segment_'+d.segType })
        .attr('title', function(d) { return d.segType })
  }


  // ======================================================
  // AXIS =================================================
  // ======================================================

  // formatMinutes = function(d) { 
  //     var hours = Math.floor(d / 3600),
  //         minutes = Math.floor((d - (hours * 3600)) / 60),
  //         seconds = d - (minutes * 60);
  //     var output = seconds + 's';
  //     if (minutes) {
  //         output = minutes + 'm ' + output;
  //     }
  //     if (hours) {
  //         output = hours + 'h ' + output;
  //     }
  //     return output;
  // };

  formatMinutes = function(d) { 
      var minutes = Math.floor((d / 60) - 1)
      var output = minutes + 1 + ':00'
      return output;
  };

  // -------------------------

  // formatMinutes = function(d) { 
  //     var hours = Math.floor(d / 3600),
  //         minutes = Math.floor((d - (hours * 3600)) / 60),
  //         seconds = d - (minutes * 60);
  //     var output = seconds + 's';
  //     if (minutes) {
  //         output = minutes + 'm ' + output;
  //     }
  //     if (hours) {
  //         output = hours + 'h ' + output;
  //     }
  //     return output;
  // };

  // -------------------------

  var segmentsAxis = d3.svg.axis()
    .scale(xScale)
    .orient('top')
    .tickFormat(formatMinutes)
    .tickValues(d3.range(0, maxTime, 60))
    // .ticks(5);

  // var segmentsAxis = d3.svg.axis()
  //   .scale(xScale)
  //   .orient('top')
  //   .ticks(5);

  d3.select('#context-container__axis-container-axis')
    .append('svg')
      .attr('height', height)
    .append('g')
      .attr('class', 'axis')
      .attr('transform', 'translate(1, 20)')
      .call(segmentsAxis)
    .selectAll('text') 
      .attr('transform', 'translate(2, 0)');


  // segmentsSortDefault();

}






  // ======================================================
  // EVENTS =================================================
  // ======================================================


var setEventsTest = function() {
  $('.track-container__notes-container').hide();

  $('.track-container').click(
    function(){
      $(this).children('.track-container__notes-container').toggle();
    }
  )
}


$(function(){

  // ======================================================
  // GET DATA ================================
  // ======================================================

  // Loading message
  $('#loading-message').html('loading data...');

  // 'API' call
  d3.json('/data/dataMaster.json', function(error, json) {
    if (error) return console.warn(error);
    data.master = json.beatlesData;

    // Clear loading message
    $('#loading-message').empty();

    // Draw D3
    d3Sketch1();

    // Set Events
    setEventsTest();

    // Initialize stickiness
    // $("#context-container").sticky();
    $("#context-container").sticky();


  })
  
})