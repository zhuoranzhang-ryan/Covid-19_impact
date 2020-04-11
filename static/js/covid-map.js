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
var button = document.getElementById("play-button");

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
        var slider_max = Object.keys(response).length;
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

        let track_date = 0;
        slider.oninput = function() {
            track_date = +this.value;
            let index = this.value;
            let data = Object.values(response)[index];
            let dates = Object.keys(response);  
            output.innerHTML = dates[index];

            drawCircleLayer(confirmLayer, data, "covid-confirmed", projection)
            console.log(track_date);          
        };
        
        var play_flag = false;
        button.addEventListener("click", function() {
            track_date = +slider.value;
            if (!play_flag) {
                play_flag = true;
                console.log("It is playing, change text to pause");
                console.log("Current date:", play_flag);
                button.innerHTML = 'pause';
                timer = setInterval(() => {
                    moveSlider(track_date, response, projection);
                    // console.log(track_date);
                    track_date += 1;
            }, 100);
            } else if (play_flag) {
                play_flag = false;
                console.log("It is not playing, change text to play");
                button.innerHTML = 'play'
                clearInterval(timer);
            }
        })
});
})

// colorScale function
var colorScale = d3.scaleLinear()
    .domain(d3.ticks(0, 50000, 500))
    // .range([ "#FF9999", "#FF6666", "#FF3333", "#FF0000"]);
    .range(["green", "yellow", "red"]);

function drawCircleLayer(layer, layerdata, layerClass, projection) {
    layer.html('');
    layer.append('g').attr("class", layerClass).selectAll(`.${layerClass}`)
        .data(layerdata)
        .enter().append('circle')
        .attr("class", layerClass)
        .attr("r", d => Math.log2(d.Cases) + 1)
        // .attr("r", d => {retutn (Math.log2(d.Cases)+2)})
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
    let x = slider.value/slider.max * 100;
    let color = `linear-gradient(90deg, rgb(255, 51, 51) ${x}%, rgb(214,214,214) ${x}%)`;
    slider.style.background = color;
});

function moveSlider(input, response, projection) {
    slider.value = input;
    let index = slider.value;
    console.log(index);
    // console.log(response);
    let data = Object.values(response)[index];
    let dates = Object.keys(response);  
    output.innerHTML = dates[index];
  
    d3.selectAll(".layers").html('');
    let confirmLayer = d3.select(".layers")
    drawCircleLayer(confirmLayer, data, "covid-confirmed", projection)

    let x = slider.value/slider.max * 100;
    let color = `linear-gradient(90deg, rgb(255, 51, 51) ${x}%, rgb(214,214,214) ${x}%)`;
    slider.style.background = color;
    
}