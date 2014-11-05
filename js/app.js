var data = {
  master: {}
}


// ======================================================
// COLORS, FROM CSS ===================
// ======================================================


var colorText =  '#fff8cd';

// ======================================================
// DRAW GRAPHIC CONTAINERS AND LABELS ===================
// ======================================================



var d3Sketch1 = function(){

  // Set up D3 =============

  var maxTime = 510

  var svgWrapperWidth = ( $('#timeline-container').width() * 0.75 );

  var width = svgWrapperWidth;
  var height = 20;

  

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
      .attr('class', 'track-container track-container--collapsed')
      .attr('id', function(d) { return 'track-container--'+d['trackIndex']; });

  // Add track labels =============
  var trackTitles = trackContainers.append('div')
      .attr('class', 'track-container__label-container')
    .append('h4')  
      .attr('class', 'track-container__label-container__label')
    .text(function(d) { return d['trackTitle']; });


  // Add SVG container =============

  var graphicContainer = trackContainers.append('div')
      .attr('class', 'track-container__graphic-container')

  var trackSVGs = graphicContainer.append('div')
      .attr('class', 'track-container__graphic-container__svg-wrapper')
    .append('svg')
      .attr('class', 'track-container__graphic-container__svg-wrapper__svg')
      .attr('height', height)
      .attr('width', width)

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
  graphicContainer.append('div')
      .attr('class', 'track-container__graphic-container__notes-container')
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

  formatMinutes = function(d) { 
      var minutes = Math.floor((d / 60) - 1)
      var output = minutes + 1 + ':00'
      return output;
      // via https://stackoverflow.com/questions/24541296/d3-js-time-scale-nicely-spaced-ticks-at-minute-intervals-when-data-is-in-second/24544067#24544067?newreg=46ad3f09119d40aebcec630921f68c47
  };

  var segmentsAxis = d3.svg.axis()
    .scale(xScale)
    .orient('top')
    .tickFormat(formatMinutes)
    .tickValues(d3.range(0, maxTime, 60));

  d3.select('#context-container__axis-container__axis')
    .append('svg')
      .attr('height', 25)
      .attr('width', width)
    .append('g')
      .attr('class', 'axis')
      .attr('transform', 'translate(1, 20)')
      .attr('stroke', colorText)
      // .attr('fill', colorText)
      .call(segmentsAxis)
    .selectAll('text') 
      .attr('transform', 'translate(2, 0)')
      .attr('fill', colorText)

  // segmentsSortDefault();

}






  // ======================================================
  // EVENTS =================================================
  // ======================================================


var setEventsTest = function() {
  $('.track-container__graphic-container__notes-container').hide();

  $('.track-container').click(function(){
      $(this).find('.track-container__graphic-container__notes-container').toggle();
      if  ($(this).hasClass('track-container--collapsed')) {
        $(this).addClass('track-container--expanded');
        $(this).removeClass('track-container--collapsed');
      } else {
        $(this).addClass('track-container--collapsed');
        $(this).removeClass('track-container--expanded');       
      }
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