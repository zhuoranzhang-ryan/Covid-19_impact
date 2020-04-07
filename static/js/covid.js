var myMap;
var light;
var filepath = "static/data/covid_us_confirmed.json"

var slider = document.getElementById("myRange");
var output = document.getElementById("value");

// Initializing the map
d3.json(filepath, function(response) {
  var light = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
          attribution: "Map data &copy; <a href='https://www.openstreetmap.org/'>OpenStreetMap</a> contributors, <a href='https://creativecommons.org/licenses/by-sa/2.0/'>CC-BY-SA</a>, Imagery © <a href='https://www.mapbox.com/'>Mapbox</a>",
          maxZoom: 18,
          id: "mapbox.light",
          accessToken: API_KEY
        });
  var data = Object.values(response).slice(-18)[0];
  var dates = Object.keys(response);
  var slider_max = dates.length;
  var heatArray = [];
  // resetting the slider range
  d3.select(".slider").attr("max", slider_max-1)
  
  for (var i = 0; i < data.length; i++) {
    heatArray.push([data[i].Lat, data[i].Lon, data[i].Cases]);
  };

  var heatLayer = L.heatLayer(heatArray, {
    radius: 20,
    blur: 20
  });
  myMap = L.map("map", {
    center: [38.82, -98.4386],
    zoom: 4,
    layers: [light, heatLayer]
  });
  L.control.layers()
           .addBaseLayer(light, 'light')
           .addOverlay(heatLayer, 'covid')
           .addTo(myMap);
    
  // var baseMaps = { light: light };
  
  // var overlayMaps = { heatmap: heatLayer };
  
  // L.control.layers(baseMaps, overlayMaps).addTo(myMap);
});

output.innerHTML = slider.value;
slider.oninput = function() {
    output.innerHTML = this.value;
    var index = this.value;

    d3.json(filepath, function(response) {
      var data = Object.values(response)[index];
      var dates = Object.keys(response);

      heatArray = [];
      for (var i = 0; i < data.length; i++) {
        heatArray.push([data[i].Lat, data[i].Lon, data[i].Cases]);
      };

      // L.control.layers()
      //          .removeLayer(heatLayer).addTo(myMap);

      heatLayer = L.heatLayer(heatArray, {
        radius: 20,
        blur: 20
      }).addTo(myMap);
      // displayMap();
      // cannot re-initialize the map using L.map()
      // tried to remove and readd the heatmapLayer, but still does not update

      // myMap.setView({center: [38.82, -98.4386],
      //   zoom: 4,
      //   layers: [light, heatLayer]})
      // var xlayer = 
      //          .addOverlay(heatLayer, 'covid2').addTo(myMap);
      // console.log(xlayer);
      // var baseMaps = {light: light};
      
      // var overlayMaps = {heatmap: heatLayer};
      // L.control.layers(baseMaps, overlayMaps).addTo(myMap);
    });
    
}

slider.addEventListener("input", function() {
    var x = slider.value/slider.max * 100;
    var color = `linear-gradient(90deg, rgb(117,252,117) ${x}%, rgb(214,214,214) ${x}%)`;
    slider.style.background = color;
}) 
// have a map initialized with the last day

// Use d3 event listner for slider value and use that to build map layers
