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
var svg = d3.select("#US-map")
            .append("svg")
            .attr("class", "map-svg")
            .attr("height", svgHeight)
            .attr("width", svgWidth)
            .append('g')
            .attr("class", "map-layer")

const mapfile = "static/data/us.json";
const covid_confirm_file = "static/data/covid_us_confirmed.json";

async function getData(url) {
    let response = await fetch(url);
    let json = await response.json();
    return json;
}

var slider = document.getElementById("myRange");
var output = document.getElementById("value");
output.innerHTML = slider.value;

getData(mapfile).then(mapdata => {

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

    getData(covid_confirm_file).then(response => {

        var data = Object.values(response)[0];
        var dates = Object.keys(response);
        var slider_max = dates.length;
        d3.select(".slider").attr("max", slider_max-1);

        var confirmLayer = d3.select(".map-svg").append('g').attr('class', "layers")
        confirmLayer.selectAll(".covid-confirmed")
        .data(data)
        .enter().append("circle")
        .attr("class", "covid-confirmed")
        .attr("r", d => d.Cases)
        .attr("cx", d => {
            var coords = projection([d.Lon, d.Lat]);
            if (coords) {return coords[0];}
        })
        .attr("cy", d => {
            var coords = projection([d.Lon, d.Lat])
            if (coords) {return coords[1];}
        });
        // playSlider(startday);    
        
        slider.oninput = function() {
            output.innerHTML = this.value;
            let index = this.value;
            var data = Object.values(response)[index];
            var dates = Object.keys(response);

            var slider_max = dates.length;
            d3.select(".slider").attr("max", slider_max-1)
            
            d3.selectAll(".layers").html('');
            var confirmLayer = d3.select(".layers")
            drawCircleLayer(confirmLayer, data, "covid-confirmed", projection)
            
        };
        
});
})

// colorScale
var colorScale = d3.scaleLinear()
    .domain(d3.ticks(0, 50000, 500))
    .range([ "#FF9999", "#FF6666", "#FF3333", "#FF0000"]);

function drawCircleLayer(layer, layerdata, layerClass, projection) {
    layer.html('');
    layer.append('g').attr("class", layerClass).selectAll(`.${layerClass}`)
        .data(layerdata)
        .enter().append('circle')
        .attr("class", layerClass)
        .attr("r", d => Math.log2(d.Cases))
        .attr("cx", d => {
            var coords = projection([d.Lon, d.Lat]);
            if (coords) {return coords[0];}
        })
        .attr("fill", d => colorScale(d.Cases))
        .attr("cy", d => {
            var coords = projection([d.Lon, d.Lat])
            if (coords) {return coords[1];}
        });
}

slider.addEventListener("input", function() {
    var x = slider.value/slider.max * 100;
    var color = `linear-gradient(90deg, rgb(255, 51, 51) ${x}%, rgb(214,214,214) ${x}%)`;
    slider.style.background = color;
});

function moveSlider(input) {
    slider.value = input;
    slider.oninput = function() {
        console.log(this.value);
        output.innerHTML = this.value;
        let index = this.value;
    
        var data = Object.values(response)[index];
        var dates = Object.keys(response);
        var slider_max = dates.length;
        d3.select(".slider").attr("max", slider_max-1)
        
        d3.selectAll(".layers").html('');
        var confirmLayer = d3.select(".layers")
        drawCircleLayer(confirmLayer, data, "covid-confirmed", projection)
};
    slider.addEventListener("input", function() {
        var x = slider.value/slider.max * 100;
        var color = `linear-gradient(90deg, rgb(255, 51, 51) ${x}%, rgb(214,214,214) ${x}%)`;
        slider.style.background = color;
    });
}

var startday = 1;

function playSlider(startday) {
    setInterval(() => {
        moveSlider(startday);
        startday += 1;
        // console.log(startday);
    }, 300);  
}
// playSlider(init);

// moveSlider(70);
