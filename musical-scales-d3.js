// include D3, tonal, semitones

var d3 = require('d3');
var semitones = require('semitones');
var tonal = require('tonal');

// only really need tonal.scale from tonal

var scale = tonal.scale;

// sort the array of the names of all scales that we can render

var scales = scale.names(true).sort();

// start off displaying the major scale

var data = scale('major', false).map(semitones);

// use this as the xAxis labels

var chromaticScale = ['R', 'b2', '2', 'b3', '3', '4', 'b5', '5', 'b6', '6', 'b7', '7'];

// dimensions of the svg element

var width = 300;
var height = 50;
var root = d3.select('.scales').append('svg')
    .attr({
      'width': width,
      'height': height
    });
d3.select('.scales').append('br');

// map scale degree semitones to pixel offset

var xScale = d3.scale.linear()
    .domain([0,12])
    .range([10, width - 10]);

// bind the chosen scale's data, and draw lines to indicate if a scale contains a note at the given interval from the root

var drawChart = function() {
    var notes = root.selectAll('.note').data(data);
    notes.enter().append('line')
        .attr({
          'class': 'note',
          'x1': xScale,
          'x2': xScale,
          'y1': 0,
          'y2': height - 25,
          'stroke': 'black',
          'stroke-width': '2px'
        });
    notes.transition()
        .attr({
          'x1': xScale,
          'x2': xScale
        });
    notes.exit().remove();
};
drawChart();

// create option DOM element to append to <select>

var makeOption = function(name) {
  returnVal = d3.select('select').append('option')
      .attr('value', name)
      .text(name);
  if (name === 'major') {
      returnVal.attr('selected', 'selected');
  }
  return returnVal;
};

// make dropdown menu

d3.select('.scales').append('select')
      .on('change', function() {
        data = scale(d3.event.target.value, false).map(semitones);
        drawChart();
      });
for (var j of scales) {
    makeOption(j).text(j);
}

// labels

var labels = root.selectAll('text.month').data(chromaticScale);
labels.enter().append('text')
    .attr('y', height - 10)
    .attr('text-anchor', 'middle')
    .attr('x', function(d, i) { return xScale(i); })
    .text(function(d) { return d; });
