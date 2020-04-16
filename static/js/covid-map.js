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
const states_file = "static/data/states_coords.csv";

async function getData(url) {
    let response = await fetch(url);
    let json = await response.json();
    return json;
}

var slider = document.getElementById("myRange");
var output = document.getElementById("value");
output.innerHTML = slider.value;

getData(mapfile).then(mapdata => {

d3.csv(states_file).then(data => {

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


    var g = svg.append('g').attr('class', 'marker_layer');

    var div = d3.select("#US-map").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0)

    // console.log(typeof(parseFloat(data[18].latitude)))

    // console.log(data)
    var nodes = g.selectAll('g.node')
        .data(data)
        .enter().append('g').attr('class', 'node')
        .attr('transform', function(d) { 
            coordinates = projection([parseFloat(d.longitude), parseFloat(d.latitude)])
            if (coordinates) {
                return 'translate(' + (coordinates[0]-12) + ',' + (coordinates[1]-30) + ')';

            }
         
        })
        
        // New
        .on("mouseover", function(d) {
            // console.log('hi')
            div.transition()
                .duration(200)
                // .text(function(d) {return "hi"})
                .style("opacity", 9);
            div	.html(d.state)	
                .style("left", (d3.event.pageX) + "px")		
                .style("top", (d3.event.pageY - 28) + "px")	
        })
        .on("mouseout", function(d) {
            div.transition()
                .duration(200)
                .style("opacity", 0)
          })  
        
        // Drawing the icons
        nodes.append('path')
        .attr('d', 'M16,0C9.382,0,4,5.316,4,12.001c0,7,6.001,14.161,10.376,19.194   C14.392,31.215,15.094,32,15.962,32c0.002,0,0.073,0,0.077,0c0.867,0,1.57-0.785,1.586-0.805   c4.377-5.033,10.377-12.193,10.377-19.194C28.002,5.316,22.619,0,16,0z M16.117,29.883c-0.021,0.02-0.082,0.064-0.135,0.098   c-0.01-0.027-0.084-0.086-0.129-0.133C12.188,25.631,6,18.514,6,12.001C6,6.487,10.487,2,16,2c5.516,0,10.002,4.487,10.002,10.002   C26.002,18.514,19.814,25.631,16.117,29.883z')
        // .attr('fillrule', 'evenodd')
        // .attr('cliprule', 'evenodd')
        .attr('fill', '#333333')
        .attr("stroke-width", 100000);
        nodes.append('path')
        .attr('d', 'M16.002,17.746c3.309,0,6-2.692,6-6s-2.691-6-6-6   c-3.309,0-6,2.691-6,6S12.693,17.746,16.002,17.746z M16.002,6.746c2.758,0,5,2.242,5,5s-2.242,5-5,5c-2.758,0-5-2.242-5-5   S13.244,6.746,16.002,6.746z')
        // .attr('fillrule', 'evenodd')
        // .attr('cliprule', 'evenodd')
        .attr('fill', '#333333')
        // .on("mouseover", console.log('ok'))
        // .on("mouseout", console.log('out'));

        g.selectAll('path')
        .data(topojson.feature(mapdata, mapdata.objects.states).features)
        .enter()
        .append('path')
        .attr('d', path);
        
    });

    




      
//     getData(covid_confirm_file).then(response => {

//         var data = Object.values(response)[0];
//         var slider_max = Object.keys(response).length;
//         d3.select(".slider").attr("max", slider_max-1);

//         var confirmLayer = d3.select(".map-svg").append('g').attr('class', "layers")
//         confirmLayer.selectAll(".covid-confirmed")
//         .data(data)
//         .enter().append("circle")
//         .attr("class", "covid-confirmed")
//         .attr("r", d => d.Cases)
//         .attr("cx", d => {
//             var coords = projection([d.Lon, d.Lat]);
//             console.log(coords)
//             if (coords) {return coords[0];}
//         })
//         .attr("cy", d => {
//             var coords = projection([d.Lon, d.Lat])
//             if (coords) {return coords[1];}
//         });
//         var track_date;    
//         slider.oninput = function() {
//             track_date = this.value;
//             output.innerHTML = this.value;
//             let index = this.value;
//             let data = Object.values(response)[index];
//             drawCircleLayer(confirmLayer, data, "covid-confirmed", projection)
//             // console.log(track_date);          
//         };
//         console.log(slider.value);
//         playSlider(track_date, response, projection);

//         playSlider(11, response, projection);
// });
})

// colorScale function
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
    let x = slider.value/slider.max * 100;
    let color = `linear-gradient(90deg, rgb(255, 51, 51) ${x}%, rgb(214,214,214) ${x}%)`;
    slider.style.background = color;
});

async function playSlider(startday, response, projection) {
    // var startday = await function() {
    //     if (!track_date) {
    //         console.log(track_date);
    //         return track_date;
    //     }
    // };
    setInterval(() => {
        moveSlider(startday, response, projection);
        startday += 1;
    }, 1000);  
}

async function moveSlider(input, response, projection) {
    slider.value = input;
    output.innerHTML = slider.value;
    let index = slider.value;
    console.log(index);
    // console.log(response);
    let data = Object.values(response)[index];
    // let dates = Object.keys(response);    
    d3.selectAll(".layers").html('');
    let confirmLayer = d3.select(".layers")
    drawCircleLayer(confirmLayer, data, "covid-confirmed", projection)

    let x = slider.value/slider.max * 100;
    let color = `linear-gradient(90deg, rgb(255, 51, 51) ${x}%, rgb(214,214,214) ${x}%)`;
    slider.style.background = color;
    
}