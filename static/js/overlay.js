states_file = "static/data/states_coords.csv"

// getData(mapfile).then(mapdata => {

d3.csv(states_file).then(data => {

    var projection = d3.geoAlbersUsa()
        .translate([svgWidth / 2, svgHeight / 2])
        .scale(900)

    var path = d3.geoPath()
        .projection(projection)

    // var counties = topojson.feature(mapdata, mapdata.objects.counties).features

    // svg.selectAll(".county")
    // .data(counties)
    // .enter().append("path")
    // .attr("class", "county")
    // .attr("d", path)
    // var states = topojson.feature(mapdata, mapdata.objects.states).features

    // svg.selectAll(".state")
    // .data(states)
    // .enter().append("path")
    // .attr("class", "state")
    // .attr("d", path)

    var g = svg.append('g').attr('class', 'marker_layer');

    var div = d3.select("#US-map").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0)
    // console.log(data)
    var nodes = g.selectAll('g.node')
        .data(data)
        .enter().append('g').attr('class', 'node')
        .attr('transform', function (d) {
            coordinates = projection([parseFloat(d.longitude), parseFloat(d.latitude)])
            if (coordinates) {
                return 'translate(' + (coordinates[0] - 12) + ',' + (coordinates[1] - 30) + ')';

            }

        })

        // New
        .on("mouseover", function (d) {
            div.transition()
                .duration(200)
                .style("opacity", 9);
            div.html(d.state)
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY - 28) + "px")
        })
        .on("mouseout", function (d) {
            div.transition()
                .duration(200)
                .style("opacity", 0)
        })

    // Drawing the icons
    nodes.append('path')
        .attr('d', 'M16,0C9.382,0,4,5.316,4,12.001c0,7,6.001,14.161,10.376,19.194   C14.392,31.215,15.094,32,15.962,32c0.002,0,0.073,0,0.077,0c0.867,0,1.57-0.785,1.586-0.805   c4.377-5.033,10.377-12.193,10.377-19.194C28.002,5.316,22.619,0,16,0z M16.117,29.883c-0.021,0.02-0.082,0.064-0.135,0.098   c-0.01-0.027-0.084-0.086-0.129-0.133C12.188,25.631,6,18.514,6,12.001C6,6.487,10.487,2,16,2c5.516,0,10.002,4.487,10.002,10.002   C26.002,18.514,19.814,25.631,16.117,29.883z')
        .attr('fillrule', 'evenodd')
        .attr('cliprule', 'evenodd')
        .attr('fill', '#333333')
        .attr("stroke-width", 100000);
    nodes.append('path')
        .attr('d', 'M16.002,17.746c3.309,0,6-2.692,6-6s-2.691-6-6-6   c-3.309,0-6,2.691-6,6S12.693,17.746,16.002,17.746z M16.002,6.746c2.758,0,5,2.242,5,5s-2.242,5-5,5c-2.758,0-5-2.242-5-5   S13.244,6.746,16.002,6.746z')
        .attr('fillrule', 'evenodd')
        .attr('cliprule', 'evenodd')
        .attr('fill', '#333333')
    // .on("mouseover", console.log('ok'))
    // .on("mouseout", console.log('out'));

    g.selectAll('path')
        .data(topojson.feature(mapdata, mapdata.objects.states).features)
        .enter()
        .append('path')
        .attr('d', path);

});