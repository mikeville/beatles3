var data = {
  master: {}
}


var App = Backbone.Router.extend({
  routes: {
    // this is the root route
    "": "home",
    "songstructure": "songStructure",
    "authorship" : "authorship",
    "selfreference" : "selfReference",
    "schedule" : "schedule",
    "tonality" : "tonality",
    "shop" : "shop",
    "test" : "test",
    "test2" : "test2"
  },

  test: function(){
    app.currentPage = "test"
    if (ui) ui.remove()
    var ui = new UI()
  },


  test2: function(){
    app.currentPage = "test"
    if (ui) ui.remove()
    var ui = new UI2()
  },


  home: function(){
    app.currentPage = "home"
    if (ui) ui.remove()
    var ui = new UI2()
  },

  songStructure: function(){
    app.currentPage = "songstructure"
    if (ui) ui.remove()
    var ui = new UI2()
  },

  authorship: function(){
    app.currentPage = "authorship"
    if (ui) ui.remove()
    var ui = new UI2()
  },

  selfReference: function(){
    app.currentPage = "selfreference"
  },

  schedule: function(){
    app.currentPage = "schedule"
  },

  tonality: function(){
    app.currentPage = "tonality"
  },

  shop: function(){
    app.currentPage = "shop"
  }

})


var UI2 = Backbone.View.extend({ 

  initialize: function(attributes){
    this.renderHeader()
    this.renderBodyContent()
    this.renderFooter()
  },

  renderHeader: function(){
    if (app.currentPage === "home") {
      var templateHeader = Handlebars.compile( $('#template__site-header--home').html() )
      $('#site-header').html( templateHeader )
    } else {
      var templateHeader = Handlebars.compile( $('#template__site-header').html() )
      $('#site-header').html( templateHeader )     
    }
  },

  renderBodyContent: function(){
    pageName = app.currentPage
    console.log(pageName)

    switch (pageName) {
      case "home":
        var templateBodyContent = Handlebars.compile( $('#template__page__home').html() )
        $('#test-body').html( templateBodyContent )
        break;
      case "songstructure":
        var templateBodyContent = Handlebars.compile( $('#template__page__songstructure').html() )
        $('#test-body').html( templateBodyContent )
        break;
      case "authorship":
        var templateBodyContent = Handlebars.compile( $('#template__page__authorship').html() )
        $('#test-body').html( templateBodyContent )
        break;
      default: //not sure if i did this right
        var templateBodyContent = Handlebars.compile( $('#template__page__home').html() )
        $('#test-body').html( templateBodyContent )
        break;
    }


  },

  renderFooter: function(){
    var templateFooter = Handlebars.compile( $('#test-footer').html() )
    $('#site-footer').html( templateFooter )
  }
})



var UI = Backbone.View.extend({

  initialize: function(attributes){

    this.render({
      header: new UI.Header(),
      body: new UI.Body()
      // footer: new UI.Footer(),
      // footer: new UI.Test()
    });

  },

  el: function(){
    return $('#page-wrapper')
  },


  render: function(sub_views){
    var self = this;
    this.$el.empty()
    
    _.each(this.sub_views, function(view){
      view.remove()
    })

    this.sub_views = sub_views

    _.each(this.sub_views, function(view){
      var view_el = view.render().$el
      self.$el.append(view_el)
    })
    return this;
  }


})

UI.Test = Backbone.View.extend({
  initialize: function(){
    
  },
  render: function(){
    this.$el.html(this.template({
      page_name: app.currentPage
    }))
    return this;
  },
  template: function(attributes){
    var source = $('#test-template').html()
    var template = Handlebars.compile(source)
    return template(attributes)
  }
})


UI.Header = Backbone.View.extend({
  initialize: function(){
    
  },
  render: function(){
    this.$el.html(this.template({
      page_name: app.currentPage
    }))
    return this;
  },
  template: function(attributes){
    var source = $('#template__site-header').html()
    var template = Handlebars.compile(source)
    return template(attributes)
  }
})


UI.Body = Backbone.View.extend({
  initialize: function(){
    
  },
  render: function(){
    this.$el.html(this.template({
      page_name: app.currentPage
    }))
    return this;
  },
  template: function(attributes, template_name){
    switch (template_name) {
      case "home":
        var source = $('#template__page__home').html();
        break;
      case "songstructure":
        var source = $('#template__page__songstructure').html();
        break;
      case "authorship":
        var source = $('#template__page__authorship').html();
        break;
      default:
        var source = $('#template__page__home').html(); //not sure if this is right
        break;
    }
    
    var template = Handlebars.compile(source)
    return template(attributes)
  }
})



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
    .append('h3')  
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
      // .attr('font-size', '10px')

  // segmentsSortDefault();

}


var d3Sketch2_divs = function(){

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

  var trackGraphics = graphicContainer.append('div')
      .attr('class', 'track-container__graphic-container__graphic-wrapper')
      .style('height', height)
      .style('width', width)

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




  var trackSegments = trackGraphics.selectAll('div')
      .data(function(d, i) { return d['segments'] })
    .enter().append('div')
        .style('width', function(d) { 
          var widthy = xScale(d.end-d.start);
          widthy = widthy.toString() + 'px';
          return widthy;
        })
        .style('height', height + 'px')
        // .style('width', function(d) { return xScale(d.end-d.start) })
        // .style('height', height)
        .attr('class', function(d) { return 'segment segment_'+d.segType })


  // Add notes containers =============
  // graphicContainer.append('div')
  //     .attr('class', 'track-container__graphic-container__notes-container')
  //   .append('p')
  //     .text(function(d) { return d['notes']; })

  var noteLists = graphicContainer.append('div')
      .attr('class', 'track-container__graphic-container__notes-container')
    .append('ul')
      .attr('class', 'track-container__graphic-container__notes-container__note-list')
    .selectAll('li')
      .data(function(d, i) { return d['notes'] })
    .enter().append('li')
      .attr('class', 'note-list__note')
      .text(function(d) { return d; })

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
      // var output = minutes + 1 + ':00'
      var output = minutes + 1
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


// var setEventsTest = function() {
//   $('.track-container__graphic-container__notes-container').hide();

//   $('.track-container').click(function(){
//       $(this).find('.track-container__graphic-container__notes-container').toggle();
//       if  ($(this).hasClass('track-container--collapsed')) {
//         $(this).addClass('track-container--expanded');
//         $(this).removeClass('track-container--collapsed');
//       } else {
//         $(this).addClass('track-container--collapsed');
//         $(this).removeClass('track-container--expanded');       
//       }
//     }
//   )
// }


var setEventsTest = function() {
  $('.track-container__graphic-container__notes-container').hide();


  $('.track-container').click(function(){
    $('.track-container__graphic-container__notes-container').hide();

    var thisNotes = $(this).find('.track-container__graphic-container__notes-container')
    thisNotes.toggle("fast");

     // $(this).find('.track-container__graphic-container__notes-container').toggle();
      // if  ($(this).hasClass('track-container--collapsed')) {
      //   $(this).addClass('track-container--expanded');
      //   $(this).removeClass('track-container--collapsed');
      // } else {
      //   $(this).addClass('track-container--collapsed');
      //   $(this).removeClass('track-container--expanded');       
      // }

    }
  )
}

  // ======================================================
  // Highlight instances of segment names in notes ========
  // ======================================================


var addSegmentSpanClasses = function(){

  var segmentClasses = {
    i_ntro: ['intro', 'outro'],
    c_horus: ['choruses', 'chorus', 'refrains', 'refrain'],
    v_erse: ['verses', 'verse'],
    b_ridge: ['bridges', 'two-bridge', 'bridge'],
  }

  function replaceAny(targetList, spanClass) {
    targetList = targetList;
    spanClass = spanClass;

    function replaceAnySub(target) {
      // var string = $('.track-container__graphic-container__notes-container__note-list').html();
      // var stringWithHTML = string.replace(target, "<span class='span--"+spanClass+"'>"+target+"</span>")
      // $('.track-container__graphic-container__notes-container__note-list').html(stringWithHTML);

      $('.track-container__graphic-container__notes-container__note-list').each(function(noteList) {
        var noteString = $(this).html()
        var noteStringWithSpans = noteString.replace(target, "<span class='span--"+spanClass+"'>"+target+"</span>")
        $(this).html(noteStringWithSpans)
      })   
 
    }
    _.each( targetList, replaceAnySub)
   }

  _.each( segmentClasses, replaceAny )

//// -------------------


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


    // instantiates app Router
    window.app = new App();

    // required code to use Router
    Backbone.history.start();




    // Clear loading message
    $('#loading-message').empty();

    // Draw D3
    // d3Sketch1();
    d3Sketch2_divs();

    // Set Events
    setEventsTest();

    // Initialize stickiness
    // $("#context-container").sticky();
    $("#context-container").sticky();

    // Highlight instances of segment names in notes
    addSegmentSpanClasses();


  })
  
})