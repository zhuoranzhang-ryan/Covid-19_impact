// try to move the map drawing code inside the .then functions. Then everything should work.

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
            // .attr("cursor", "pointer")
            .append('g')
            .attr("class", "map-layer")

// file directories/urls.
const mapfile = "static/data/us.json";
const covid_confirm_file = "static/data/covid_us_confirmed.json";
const covid_deaths_file = "static/data/covid_us_deaths.json";
const covid_recovered_file = "static/data/covid_us_recovered.json";
const unemploymentCases = "./static/data/unemployment_claims.json";

async function getData(url) {
    let response = await fetch(url);
    let json = await response.json();
    return json;
}

var slider = document.getElementById("myRange");
var output = document.getElementById("value");
output.innerHTML = '';
var button = document.getElementById("play-button");
    
    getData(mapfile).then(mapdata => {
    getData(covid_confirm_file).then(response => {
    getData(covid_deaths_file).then(deathsData => {
    getData(covid_recovered_file).then (recoveredData => {
    getData(unemploymentCases).then(function (claimsData) {

        // creating the map
        var projection = d3.geoAlbersUsa()
                       .translate([svgWidth/2, svgHeight/2])
                       .scale(900)

        var path = d3.geoPath()
                    .projection(projection)
        
        var counties = topojson.feature(mapdata, mapdata.objects.counties).features

        counties_map = svg.append('g').attr('class', 'county-layer')
        counties_map.selectAll(".county")
                    .data(counties)
                    .enter().append("path")
                    .attr("class", "county")
                    .attr("cursor", "pointer")
                    .attr("d", path)
                    .on("click", clicked)    

        var states = topojson.feature(mapdata, mapdata.objects.states).features

        states_map = svg.append('g').attr('class', 'state-layer')
        states_map.selectAll(".state")
                    .data(states)
                    .enter().append("path")
                    .attr("cursor", "pointer")
                    .style("opacity", "0.7")
                    .attr("class", "state")
                    .attr("d", path)
                    .on("click", clicked)
        // Setting up correct values for slider bar.
        var slider_max = Object.keys(response).length;
        d3.select(".slider").attr("max", slider_max);

        // Setting up legend. only the color scale function is needed.
        const legend_covid = d3.select(".map-svg").append('g')
                    .attr('class', 'legend-covid')
                    .attr('fill', "#777")
                    .attr('transform', 'translate(550, 525)')
                    .style('font', '10px sans-serif')
                    .selectAll('g')
                    .data([100000, 10000, 1000, 50])
                    .join('g');

        legend_covid.append("circle")
                    .attr("fill", d => colorScale(d))
                    // .style("opacity", "1")
                    .attr("stroke", "#ccc")
                    .attr("cy", d => -Math.log2(d))
                    .attr("r", d => Math.log2(d));

        legend_covid.append('text')
                    .style("text-align", "center")
                    .attr('width', '10em')
                    .attr("y", d => -2.5 * Math.log2(d))
                    .attr('dy', "1.4em")
                    .attr('dx', "1.8em")
                    .text(d3.format(".1s"));

        // Initializeing the graphs with day-1 data.
        const confirmLayer = d3.select(".map-svg").append('g').attr('class', "layers").attr("cursor", "pointer")
                                .on('click', clicked)
        let data = Object.values(response)[0];
        let date_scatter = Object.keys(response)[2];
        drawCircleLayer(confirmLayer, data, "covid-confirmed", projection);
        initializeBarchart(0, response, recoveredData, deathsData);
        initializeScatter(claimsData, response, date_scatter);

        // Enable the sliding functionality.
        let track_date = 0;
        slider.oninput = function() {
            track_date = +this.value - 1;
            let index = this.value - 1;
            let data = Object.values(response)[index];
            let dates = Object.keys(response);  
            output.innerHTML = `${dates[index]} (Day: ${index + 1})`;
            drawCircleLayer(confirmLayer, data, "covid-confirmed", projection);
            initializeBarchart(index, response, recoveredData, deathsData);
            initializeScatter(claimsData, response, dates[index]);
        };
        
        // Enable the play button functionality.
        var play_flag = false;
        button.addEventListener("click", function() {
            track_date = +slider.value;
            let dates = Object.keys(response);
            if (!play_flag) {
                play_flag = true;
                console.log("It is playing, change button text to pause");
                console.log("Current date:", play_flag);
                button.innerHTML = 'pause';
                timer = setInterval(() => {
                    if (track_date == slider_max + 1) {
                        clearInterval(timer);
                        console.log("Max date reached");
                        button.innerHTML = 'play';
                        play_flag = false;
                    } else {
                        moveSlider(track_date, response, projection);
                        initializeBarchart(track_date - 1, response, recoveredData, deathsData);
                        initializeScatter(claimsData, response, dates[track_date]);
                        
                        track_date += 1;
                    }      
            }, 200);
            } else if (play_flag) {
                play_flag = false;
                console.log("It is not playing, change button text to play");
                button.innerHTML = 'play'
                clearInterval(timer);
            }

        });
        // gg.call(zoom);
        var zoomSettings = {
            duration: 1000,
            ease: d3.easeCubicOut,
            zoomLevel: 5
        };
    
        function clicked(d) {
            var x;
            var y;
            var zoomLevel;
            var centered;
    
            if (d && centered !== d) {
                var centroid = path.centroid(d);
                x = centroid[0];
                y = centroid[1];
                zoomLevel = zoomSettings.zoomLevel;
                centered = d;
            } else {
                x = width/2;
                y = height/2;
                zoomLevel = 1;
                centered = null;
            }
            counties_map.transition()
                    .duration(zoomSettings.duration)
                    .ease(zoomSettings.ease)
                    .attr('transform', 'translate(' + width/2 + ',' + height/2 + ')scale(' + zoomLevel + ')translate(' + -x + ',' + -y + ')');
            states_map.transition()
                    .duration(zoomSettings.duration)
                    .ease(zoomSettings.ease)
                    .attr('transform', 'translate(' + width/2 + ',' + height/2 + ')scale(' + zoomLevel + ')translate(' + -x + ',' + -y + ')');
            confirmLayer.transition()
                    .duration(zoomSettings.duration)
                    .ease(zoomSettings.ease)
                    .attr('transform', 'translate(' + width/2 + ',' + height/2 + ')scale(' + zoomLevel + ')translate(' + -x + ',' + -y + ')');         
        };
    });
    });      
    });
    });
});

// colorScale function
var colorScale = d3.scaleLinear()
    .domain(d3.ticks(0, 100000, 75))
    // .range([ "#FF9999", "#FF6666", "#FF3333", "#FF0000"]);
    .range(["#92D254", "#FF8503", "#FF5959", "#FF0000"]);

// Function to draw the circle layers for confirm case data.
function drawCircleLayer(layer, layerdata, layerClass, projection) {
    layer.html('');
    layer.append('g').attr("class", layerClass).selectAll(`.${layerClass}`)
        .data(layerdata)
        .enter()
        .append('circle')
        .attr("class", layerClass)
        .attr("r", d => Math.log10(d.Cases)*1.7 + 0.7)
        // .attr("r", d => {retutn (Math.log2(d.Cases)+2)})
        .attr("cx", d => {
            var coords = projection([d.Lon, d.Lat]);
            if (coords) { return coords[0];}
        })
        .attr("fill", d => colorScale(d.Cases))
        .attr("cy", d => {
            var coords = projection([d.Lon, d.Lat])
            if (coords) {return coords[1];}
        });
}

// Setting the slider color chasing effect.
slider.addEventListener("input", function() {
    let x = slider.value/slider.max * 100;
    let color = `linear-gradient(90deg, rgb(255, 51, 51) ${x}%, rgb(214,214,214) ${x}%)`;
    slider.style.background = color;
});

// Automatic slider movement
function moveSlider(input, response, projection) {
    slider.value = input;
    let index = slider.value - 1;
    console.log(index);
    let data = Object.values(response)[index];
    let dates = Object.keys(response);  
    output.innerHTML = `${dates[index]} (Day: ${input})`;
  
    d3.selectAll(".layers").html('');
    let confirmLayer = d3.select(".layers")
    drawCircleLayer(confirmLayer, data, "covid-confirmed", projection)

    let x = slider.value/slider.max * 100;
    let color = `linear-gradient(90deg, rgb(255, 51, 51) ${x}%, rgb(214,214,214) ${x}%)`;
    slider.style.background = color;
}