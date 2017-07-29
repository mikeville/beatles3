var data = {
  master: {}
}

// COLORS, FROM CSS =====================================
var colorText =  '#fff8cd';



// ******************************************************
// ******************************************************
// ======================================================
// SET UP BACKBONE ======================================
// ======================================================
// ******************************************************
// ******************************************************


var App = Backbone.Router.extend({
  routes: {
    // this is the root route
    "": "home",
    "songstructure": "songStructure",
    "authorship" : "authorship",
    "selfreference" : "selfReference",
    "schedule" : "schedule",
    "tonality" : "tonality",
    "shop" : "shop"
  },

  home: function(){
    app.currentPage = "home"
    if (ui) ui.remove()
    var ui = new UI()
  },

  songStructure: function(){
    app.currentPage = "songstructure"
    if (ui) ui.remove()
    var ui = new UI()

    loadSongStructureGraphic();
  },

  authorship: function(){
    app.currentPage = "authorship"
    if (ui) ui.remove()
    var ui = new UI()

    loadAuthorshipGraphic();
  },

  selfReference: function(){
    app.currentPage = "selfreference"
    if (ui) ui.remove()
    var ui = new UI()
  },

  schedule: function(){
    app.currentPage = "schedule"
    if (ui) ui.remove()
    var ui = new UI()
  },

  tonality: function(){
    app.currentPage = "tonality"
    if (ui) ui.remove()
    var ui = new UI()
  },

  shop: function(){
    app.currentPage = "shop"
    if (ui) ui.remove()
    var ui = new UI()
  }

})


var UI = Backbone.View.extend({ 

  initialize: function(attributes){
    this.renderHeader()
    this.renderBodyContent()
    this.renderIndex()
    this.renderShop()
    // this.renderFooter()

    initSticky();
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
      case "selfreference":
        var templateBodyContent = Handlebars.compile( $('#template__page__selfreference').html() )
        $('#test-body').html( templateBodyContent )
        break;
      case "schedule":
        var templateBodyContent = Handlebars.compile( $('#template__page__schedule').html() )
        $('#test-body').html( templateBodyContent )
        break;
      case "tonality":
        var templateBodyContent = Handlebars.compile( $('#template__page__tonality').html() )
        $('#test-body').html( templateBodyContent )
        break;
      case "shop":
        var templateBodyContent = Handlebars.compile( $('#template__page__shop').html() )
        $('#test-body').html( templateBodyContent )
        break;
      default: //not sure if i did this right
        var templateBodyContent = Handlebars.compile( $('#template__page__home').html() )
        $('#test-body').html( templateBodyContent )
        break;
    }


  },

  renderIndex: function() {
    pageName = app.currentPage
    console.log("rendering index on page: " + pageName)

    var templateIndex = Handlebars.compile( $('#template__index-module').html() )
    $('#index-module').html( templateIndex )   

    this.scrollToTop();
  },

  renderShop: function() {
      var templateShop = Handlebars.compile( $('#template__shop-module').html() )
      $('#shop-module').html( templateShop )   
  },

  scrollToTop: function() {
    document.body.scrollTop = document.documentElement.scrollTop = 0;
  }




  // renderFooter: function(){
  //   var templateFooter = Handlebars.compile( $('#test-footer').html() )
  //   $('#site-footer').html( templateFooter )
  // }
})



// ******************************************************
// ******************************************************
// ======================================================
// SET UP D3 ===============================
// ======================================================
// ******************************************************
// ******************************************************

var maxTime,
    svgWrapperWidth,
    width,
    height,
    chordVizHeightRange,
    xScale,
    yScale,
    animationDuration

var albumContainers,
    trackContainers,
    trackTitles,
    graphicContainer,
    trackGraphics,
    axisAuthorship



function setUpD3() {

 // ======================================================
// SET UP D3 VARIABLES ===================
// ======================================================

  maxTime = 510

  svgWrapperWidth = ( $('#timeline-container').width() * 0.75 );

  width = svgWrapperWidth;
  height = 20;

  

  chordVizHeightRange = 2000

  xScale = d3.scale.linear()
      .domain([0, maxTime])
      .range([0, width]);  

 yScale = d3.scale.linear()
      .domain([0, maxTime])
      .range([0, chordVizHeightRange]);

  animationDuration = 1000;


// ======================================================
// DRAW GRAPHIC CONTAINERS AND LABELS ===================
// ======================================================

  // Make album containers =============
  albumContainers = d3.select('#timeline-container')
    .selectAll('.album-container')
      .data(data.master)
    .enter().append('div')
      .attr('class', 'album-container')
      .attr('data-albumindex', function(d, i) { return i });

  // Add album labels =============
  albumContainers.append('div')
      .attr('class', 'album-container__label-container')
    .append('h3')
      .attr('class', 'album-container__label-container__label')
    .html(function(d) { return d['albumTitle'] + ' <span class="album-container__label-container__year">' + d['releaseDate']['year'] + '</span>'; });


   // Add Axis ================

  // axisAuthorship = albumContainers.append('div')
  //     .attr('class', 'track-container axis--authorship')

  // axisAuthorship.append('div')   
  //     .attr('class', 'track-container__label-container')
  //   .append('h4')  
  //     .attr('class', 'track-container__label-container__label')

  // axisAuthorship.append('div')
  //     .attr('class', 'track-container__graphic-container')
  //         .append('h4')  
  //     .attr('class', 'track-container__label-container__label')
  //     .html('<img class="image" src="images/axis-authorship.png">')


  // Make track containers =============
  trackContainers = albumContainers.selectAll('.track-container')
      .data(function(d, i) { return d['tracks']; })
    .enter().append('div')
      .attr('class', 'track-container track-container--collapsed')
      .attr('id', function(d) { return 'track-container--'+d['trackIndex']; })
      .attr('data-trackindex', function(d) { return d['trackIndex']; });

  // Add track labels =============
  trackTitles = trackContainers.append('div')
      .attr('class', 'track-container__label-container')
    .append('h4')  
      .attr('class', 'track-container__label-container__label')
    .text(function(d) { return d['trackTitle']; });


  // Add SVG container =============

  graphicContainer = trackContainers.append('div')
      .attr('class', 'track-container__graphic-container')

  trackGraphics = graphicContainer.append('div')
      .attr('class', 'track-container__graphic-container__graphic-wrapper')
      .style('height', height)
      .style('width', width)

}


// ******************************************************
// ******************************************************
// ======================================================
// SONG STRUCTURE GRAPHIC ===============================
// ======================================================
// ******************************************************
// ******************************************************




function drawSongStructureD3(){


  // ======================================================
  // DRAW GRAPHICS =====================
  // ======================================================


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




  // ======================================================
  // ADD NOTES =====================
  // ======================================================


  // Add notes containers =============
  // graphicContainer.append('div')
  //     .attr('class', 'track-container__graphic-container__notes-container')
  //   .append('p')
  //     .text(function(d) { return d['notes']; })

  var noteContainers = graphicContainer.append('div')
      .attr('class', 'track-container__graphic-container__notes-container')
    
  var noteLists = noteContainers.append('ul')
      .attr('class', 'track-container__graphic-container__notes-container__note-list')
    .selectAll('li')
      .data(function(d, i) { return d['notes'] })
    .enter().append('li')
      .attr('class', 'note-list__note')
      .html(function(d) { return d; })

  var videoContainers = noteContainers.append('div')
    .attr('class', 'track-container__graphic-container__notes-container__video-container')


  // ======================================================
  // DRAW AXIS =================================================
  // ======================================================

  function formatMinutes(d) { 
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
      .attr('fill', 'none')
      .call(segmentsAxis)
    .selectAll('text') 
      .attr('transform', 'translate(2, 0)')
      .attr('fill', colorText)


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


function setEventsTest() {


  $('.track-container__graphic-container__notes-container').hide();


  $('.track-container').click(function(){

    $('.track-container--expanded').find('.track-container__graphic-container__notes-container').hide();
    $('.track-container--expanded').toggleClass('track-container--expanded');
    $('.track-container--expanded').toggleClass('track-container--collapsed');

    var thisNotes = $(this).find('.track-container__graphic-container__notes-container')
    thisNotes.slideToggle("fast");

    $(this).toggleClass('track-container--expanded');
    $(this).toggleClass('track-container--collapsed');


    })

  $('.track-container').click(function(){ 
    var albumIndex = $('#track-container--0').parent().data('albumindex');
    var trackIndex = $(this).data('trackindex');
    var videoLink = data.master[albumIndex].tracks[trackIndex].links.video;
    var lyrics = data.master[albumIndex].tracks[trackIndex].links.lyrics2;

    // $(this).find('.track-container__graphic-container__notes-container__video-container').html(
    //   "<iframe class='video-container__video' src='"+videoLink+"' frameborder='0' allowfullscreen></iframe>"
    // )

    // $(this).find('.track-container__graphic-container__notes-container__video-container').html(
    //   // lyricsLink
    //   "<div id='"+lyrics.id+"' class='rg_embed_link'><a href='"+lyrics.link+"'>Annotated Lyrics</div><script src='"+lyrics.source+"''></script>"
    // )

// <div id='rg_embed_link_112197' class='rg_embed_link'>Read <a href='http://rock.genius.com/The-beatles-i-saw-her-standing-there-lyrics'>“I Saw Her Standing There” by The Beatles</a> on Genius</div><script src='//rock.genius.com/songs/112197/embed.js?dark=1'></script>


  })


}




// function lyricsDisplayer(){
//     $('.lyrics-test').click(function(){
//       console.log('clicked')
//       $('.lyrics-test-container').addClass('hidden');
//       $('.lyrics-test-container').hide();
//       $('.index__signup-box').addClass('hidden');
//     })
// }


  // ======================================================
  // Highlight instances of segment names in notes ========
  // ======================================================


function addSegmentSpanClasses(){

  var segmentClasses = {
    i_ntro: ['intro', 'outro'],
    c_horus: ['choruses', 'chorus', 'refrains', 'mini-refrain', 'refrain'],
    v_erse: ['verses', 'verse'],
    b_ridge: ['bridges', 'two-bridge', 'double-bridge', 'mini-bridge', 'bridge'],
    i_nstrumental: ['solos', 'solo', 'break', 'breaks'],
    v_ariant: ['variant', 'variations', 'variation']
  }

  function replaceAny(targetList, spanClass) {
    targetList = targetList;
    spanClass = spanClass;

    function replaceAnySub(target) {
      $('.track-container__graphic-container__notes-container__note-list').each(function(noteList) {
        var noteString = $(this).html()
        var regex = new RegExp(target, "gi")

        var noteStringWithSpans = noteString.replace(regex, "<span class='span--"+spanClass+"'>"+target+"</span>")
        $(this).html(noteStringWithSpans)

      })   
 
    }
    _.each( targetList, replaceAnySub)
   }

  _.each( segmentClasses, replaceAny )


}


// ******************************************************
// ******************************************************
// ======================================================
// AUTHORSHIP GRAPHIC ===============================
// ======================================================
// ******************************************************
// ******************************************************


function drawAuthorshipD3() {

  // ======================================================
  // DRAW GRAPHICS =====================
  // ======================================================


  // var trackSegments = trackGraphics.selectAll('div')
  //     .data(function(d, i) { return d['segments'] })
  //   .enter().append('div')
  //       .style('width', function(d) { 
  //         var widthy = xScale(d.end-d.start);
  //         widthy = widthy.toString() + 'px';
  //         return widthy;
  //       })
  //       .style('height', height + 'px')
  //       // .style('width', function(d) { return xScale(d.end-d.start) })
  //       // .style('height', height)
  //       .attr('class', function(d) { return 'segment segment_'+d.segType })


  var trackSegments = trackGraphics.selectAll('div')
      .data(function(d, i) { return d['authorship'] })
    .enter().append('div')
      .style('width', function(d) { return d + '%'; })
      .style('height', height + 'px')
      .attr('class', function(d, i) { 
        if (d) {
          return 'segment author--'+i 
        } else {
          return 'segment segment--empty'
        }
      })

}



// ******************************************************
// ******************************************************
// ======================================================
// INITIALIZE THE SITE ==================================
// ======================================================
// ******************************************************
// ******************************************************


// Initialize sticky legends
function initSticky() {
    $("#context-container").sticky();
}


function loadSongStructureGraphic() {
    // Draw D3
    setUpD3();
    drawSongStructureD3();

    // Set Events
    setEventsTest();

    // Highlight instances of segment names in notes
    addSegmentSpanClasses();
}



function loadAuthorshipGraphic() {
    // Draw D3
    setUpD3();
    drawAuthorshipD3();
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


    // lyricsDisplayer();

  })
  
})