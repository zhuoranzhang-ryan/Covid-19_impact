// http://bl.ocks.org/activeshadow/86f232f4b1ca485dfd91

var world = d3.select('#US-map')
      .append('svg:svg')
      .attr('width',  '1000px')
      .attr('height', '500px');

    var projection = d3.geo.mercator()
      .center([0,50])
      .scale(150)
      .rotate([0,0]);

    var path = d3.geo.path()
      .projection(projection);

    var g = world.append('g');

    d3.json('world.json', function(error, topology) {
      d3.csv('states_coords.csv', function(error, data) {
        var nodes = g.selectAll('g.node')
          .data(data)
          .enter().append('g').attr('class', 'node')
          .attr('transform', function(d) { return 'translate(' + projection([d.longitude, d.latitude])[0] + ',' + projection([d.longitude, d.latitude])[1] + ')'; });

        nodes.append('path')
          .attr('d', 'M16,0C9.382,0,4,5.316,4,12.001c0,7,6.001,14.161,10.376,19.194   C14.392,31.215,15.094,32,15.962,32c0.002,0,0.073,0,0.077,0c0.867,0,1.57-0.785,1.586-0.805   c4.377-5.033,10.377-12.193,10.377-19.194C28.002,5.316,22.619,0,16,0z M16.117,29.883c-0.021,0.02-0.082,0.064-0.135,0.098   c-0.01-0.027-0.084-0.086-0.129-0.133C12.188,25.631,6,18.514,6,12.001C6,6.487,10.487,2,16,2c5.516,0,10.002,4.487,10.002,10.002   C26.002,18.514,19.814,25.631,16.117,29.883z')
          .attr('fillrule', 'evenodd')
          .attr('cliprule', 'evenodd')
          .attr('fill', '#333333');
        nodes.append('path')
          .attr('d', 'M16.002,17.746c3.309,0,6-2.692,6-6s-2.691-6-6-6   c-3.309,0-6,2.691-6,6S12.693,17.746,16.002,17.746z M16.002,6.746c2.758,0,5,2.242,5,5s-2.242,5-5,5c-2.758,0-5-2.242-5-5   S13.244,6.746,16.002,6.746z')
          .attr('fillrule', 'evenodd')
          .attr('cliprule', 'evenodd')
          .attr('fill', '#333333');
      });

      g.selectAll('path')
        .data(topojson.feature(topology, topology.objects.countries).features)
        .enter()
        .append('path')
        .attr('d', path);
    });

    var zoom = d3.behavior.zoom().on('zoom', function() {
      g.attr('transform', 'translate(' + d3.event.translate.join(',') + ') scale(' + d3.event.scale + ')');
      nodes.selectAll('path').attr('transform', 'scale(' + (1 / d3.event.scale) + ')');
    });

    world.call(zoom);