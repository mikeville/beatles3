var data = {
  master: {}
}

var d3Sketch1 = function(){
  console.log(data.master[0].albumKey);
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