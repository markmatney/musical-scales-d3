// dependencies
var d3 = require('./d3'),
    semitones = require('semitones'),
    scale = require('music-scale');

// map scale degree semitones to pixel offset
var root = d3.select('svg'),
    width = root.attr('width'),
    height = root.attr('height'),
    xScale = d3.scaleLinear()
        .domain([0,12])
        .range([10, width - 10]);

// lines indicate that a scale contains a note at that interval from the root
var chromaticScale;
var drawChart = function(data) {
    var notes = root.selectAll('.note').data(data);

    notes.exit()
      .transition()
        .duration(750)
        .style('opacity', 0)
        .remove();
    notes.enter()
      .append('line')
        .attr('x1', xScale)
        .attr('x2', xScale)
        .attr('y1', 0)
        .attr('y2', height - 25)
        .attr('stroke', 'black')
        .attr('stroke-width', '2px')
        .classed('note', true)
        .style('opacity', 0)
      .merge(notes)
      .transition()
        .duration(750)
        .style('opacity', 1)
        .attr('x1', xScale)
        .attr('x2', xScale);
};

// dropdown menu
d3.select('select')
    .on('change', function() {
        drawChart(scale(event.target.value, false).map(semitones));
    })
  .selectAll('option').data(scale.names(true).sort()).enter()
  .append('option')
    .attr('value', function(d) { return d; })
    .attr('selected', function(d) { return d === 'major' ? 'selected' : ''; })
    .text(function(d) { return d;});

// labels
chromaticScale = ['R', 'b2', '2', 'b3', '3', '4', 'b5', '5', 'b6', '6', 'b7', '7'];
root.selectAll('text.month').data(chromaticScale).enter()
  .append('text')
    .attr('y', height - 10)
    .attr('text-anchor', 'middle')
    .attr('x', function(d, i) { return xScale(i); })
    .text(function(d) { return d; });

// start off displaying the major scale
drawChart(scale('major', false).map(semitones));
