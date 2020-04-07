var myMap = L.map("map", {
  center: [20, 20],
  zoom: 2
});

L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href='https://www.openstreetmap.org/'>OpenStreetMap</a> contributors, <a href='https://creativecommons.org/licenses/by-sa/2.0/'>CC-BY-SA</a>, Imagery © <a href='https://www.mapbox.com/'>Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.light",
  accessToken: API_KEY
}).addTo(myMap);



// var url = "https://data.sfgov.org/resource/cuks-n6tp.json?$limit=10000";
var filepath = "static/data/covid_all.json"

d3.json(filepath, function (response) {

  console.log(response);

  // var heatArray = [];

  // for (var i = 0; i < response.length; i++) {
  //   // var location = response[i].location;

  //   if (response[i].Cases && response[i].Status == 'confirmed') {
  //     heatArray.push([response[i].Lat, response[i].Lon, response[i].Cases]);
  //   }
  // }

  // // var heat = L.heatLayer(heatArray
  // //   , {
  // //   // radius: 20,
  // //   blur: 40
  // // }
  // ).addTo(myMap);

});
