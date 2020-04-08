var margin = {
    top: 50,
    left: 50,
    right: 50,
    bottom: 50
};
var svgHeight = 600;
var svgWidth = 800;
var height = svgHeight - margin.top - margin.bottom;
var width = svgWidth - margin.left - margin.right;
var count=0;
var svg = d3.select("#US-map")
            .append("svg")
            .attr("height", svgHeight)
            .attr("width", svgWidth)
            .append('g')
            .attr("transform","translate(50, 50)")

d3.json("static/data/us.json").then(mapdata => {
    d3.json(filepath).then(response => {

            var projection = d3.geoAlbersUsa()
                            .translate([svgWidth/2, svgHeight/2])
                            .scale(900)

            var path = d3.geoPath()
                        .projection(projection)
            
            var counties = topojson.feature(mapdata, mapdata.objects.counties).features

            svg.selectAll(".county")
                .data(counties)
                .enter().append("path")
                .attr("class", "county")
                .attr("d", path)
            var states = topojson.feature(mapdata, mapdata.objects.states).features

            svg.selectAll(".state")
                .data(states)
                .enter().append("path")
                .attr("class", "state")
                .attr("d", path)

        
            var data = Object.values(response)[0];
            console.log(response);
            var dates = Object.keys(response);
            var slider_max = dates.length;
            d3.select(".slider").attr("max", slider_max-1)

            var confirmLayer = svg.append('g').attr("class", "confirm-layer")
            confirmLayer.selectAll(".covid-confirmed")
            .data(data)
            .enter().append("circle")
            .attr("class", "covid-confirmed")
            .attr("r", d => d.Cases)
            .attr("cx", d => {
                var coords = projection([d.Lon, d.Lat]);
                console.log(coords);
                count = count+1;
                console.log(count);
                if (coords) {return coords[0];}
            })
            .attr("cy", d => {
                var coords = projection([d.Lon, d.Lat])
                if (coords) {return coords[1];}
            });
});
})

var slider = document.getElementById("myRange");
var output = document.getElementById("value");
output.innerHTML = slider.value;

var filepath = "static/data/covid_us_confirmed.json";


var index;
slider.oninput = function() {
    d3.json(filepath).then(response => {
    output.innerHTML = this.value;
    index = this.value;

    var projection = d3.geoAlbersUsa()
                            .translate([svgWidth/2, svgHeight/2])
                            .scale(900)

    var data = Object.values(response)[index];
    var dates = Object.keys(response);
    var slider_max = dates.length;
    d3.select(".slider").attr("max", slider_max-1)
    
    d3.selectAll(".confirm-layer").html('');
    var confirmLayer = svg.append('g').attr("class", "confirm-layer")

    confirmLayer.selectAll(".covid-confirmed")
    .data(data)
    .enter().append("circle")
    .attr("class", "covid-confirmed")
    .attr("r", d => d.Cases)
    .attr("cx", d => {
        var coords = projection([d.Lon, d.Lat]);
        console.log(coords);
        count = count+1;
        console.log(count);
        if (coords) {return coords[0];}
    })
    .attr("cy", d => {
        var coords = projection([d.Lon, d.Lat])
        if (coords) {return coords[1];}
    });
})};

slider.addEventListener("input", function() {
    var x = slider.value/slider.max * 100;
    var color = `linear-gradient(90deg, rgb(117,252,117) ${x}%, rgb(214,214,214) ${x}%)`;
    slider.style.background = color;
});

