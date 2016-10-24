// dependencies
var d3 = require('./d3'),
    semitones = require('semitones'),
    scale = require('music-scale'),
    chord = require('tonal-chord'),
    interval = require('tonal-interval');

/*
 * Scale
 */

// map scale degree semitones to pixel offset
var scaleRoot = d3.select('#scale').select('svg'),
    scaleWidth = scaleRoot.attr('width'),
    scaleHeight = scaleRoot.attr('height'),
    scaleXScale = d3.scaleLinear()
        .domain([0,12])
        .range([10, scaleWidth - 10]);

// lines indicate that a scale contains a note at that interval from the scaleRoot
var chromaticScale;
var drawScaleChart = function(data) {
    var notes = scaleRoot.selectAll('.note').data(data);

    notes.exit()
      .transition()
        .duration(500)
        .style('opacity', 0)
        .remove();
    notes.enter()
      .append('line')
        .attr('x1', scaleXScale)
        .attr('x2', scaleXScale)
        .attr('y1', 0)
        .attr('y2', scaleHeight - 25)
        .attr('stroke', 'black')
        .attr('stroke-width', '2px')
        .classed('note', true)
        .style('opacity', 0)
      .merge(notes)
      .transition()
        .duration(750)
        .style('opacity', 1)
        .attr('x1', scaleXScale)
        .attr('x2', scaleXScale);
};

var chordRoot = d3.select('#chord').select('svg'),
    barLayer = chordRoot.append('g'),
    textLayer = chordRoot.append('g'),
    chordWidth = chordRoot.attr('width'),
    chordHeight = chordRoot.attr('height'),
    chordYScale = d3.scaleLinear()
        .domain([0, 21])
        .range([chordHeight - 10, 10])
    chordHeightScale = d3.scaleLinear()
        .domain([0, 21])
        .range([0, chordHeight - 10 - 10]),
    // map interval consonance to color (0 is consonant, 10 is dissonant)
    chordColorScale = d3.scaleLinear()
        .domain([0, 5, 8, 10])
        .range(["green", "yellow", "orange", "red"]);

var semitonesToConsonance = function(sem) {
    var i = sem;
        cons = [0, 10, 7, 5, 3, 2, 7, 1, 4, 3, 7, 9];
    if (sem >= 12) {
        i -= 12;
    }
    return cons[i];
};

var drawChordChart = function(data) {
    var intervalData = [],
        i, j;

    for (i = 0; i < data.length; i++) {
        for (j = i + 1; j < data.length; j++) {
            intervalData.push([data[i], data[j] - data[i]]);
        }
    }

    var intervals = barLayer.selectAll('.interval').data(intervalData);

    intervals.exit()
      .transition()
        .duration(500)
        .style('opacity', 0)
        .remove();
    intervals.enter()
      .append('rect')
        .attr('width', 30)
        .attr('height', function(d) { return chordHeightScale(d[1]);} )
        .attr('y', function(d) { return chordYScale(d[0]) - chordHeightScale(d[1]); })
        .attr('stroke', 'black')
        .attr('stroke-width', '2px')
        .classed('interval', true)
        .style('opacity', 0)
      .merge(intervals)
        .attr('x', function(d, i) { return i * 30; })
      .transition()
        .duration(750)
        .attr('height', function(d) { return chordHeightScale(d[1]);} )
        .attr('y', function(d) { return chordYScale(d[0]) - chordHeightScale(d[1]); })
        .attr('fill', function(d) { return chordColorScale(semitonesToConsonance(d[1])) })
        .style('opacity', 1);

    var labels = textLayer.selectAll('.labels').data(intervalData);
    labels.exit()
      .transition()
        .duration(500)
        .style('opacity', 0)
        .remove();
    labels.enter()
      .append('text')
        .attr('text-anchor', 'middle')
        .attr('y', function(d) { return chordYScale(d[0]) - chordHeightScale(d[1]) / 2 + 6; })
        .classed('labels', true)
        .style('opacity', 0)
      .merge(labels)
        .attr('x', function(d, i) { return i * 30 + 15; })
        .text(function(d) { return interval.fromSemitones(d[1]); })
      .transition()
        .duration(750)
        .attr('y', function(d) { return chordYScale(d[0]) - chordHeightScale(d[1]) / 2 + 6; })
        .style('opacity', 1);
};

// dropdown menus
d3.select('#scale').select('select')
    .on('change', function() {
        drawScaleChart(scale(event.target.value, false).map(semitones));
    })
  .selectAll('option').data(scale.names(true).sort()).enter()
  .append('option')
    .attr('value', function(d) { return d; })
    .each(function(d) { if (d === 'major') { d3.select(this).property('selected', 'selected'); }})
    .text(function(d) { return d;});

d3.select('#chord').select('select')
    .on('change', function() {
        drawChordChart(chord.build(event.target.value, false).map(semitones));
    })
  .selectAll('option').data(chord.names(true).sort()).enter()
  .append('option')
    .attr('value', function(d) { return d; })
    .each(function(d) { if (d === 'M') { d3.select(this).property('selected', 'selected'); }})
    .text(function(d) { return d;});

// labels
chromaticScale = ['R', 'b2', '2', 'b3', '3', '4', 'b5', '5', 'b6', '6', 'b7', '7'];
scaleRoot.selectAll('text').data(chromaticScale).enter()
  .append('text')
    .attr('y', scaleHeight - 10)
    .attr('text-anchor', 'middle')
    .attr('x', function(d, i) { return scaleXScale(i); })
    .text(function(d) { return d; });

// start off displaying the major scale
drawScaleChart(scale('major', false).map(semitones));
drawChordChart(chord.build('M', false).map(semitones));

////////////////////////////////////////////////////////////////////////////////

/*
// roughness function - http://www.acousticslab.org/learnmoresra/moremodel.html
var roughness = function(wave1, wave2) {
    var fmin = Math.min(wave1.f, wave2.f),
        fmax = Math.max(wave1.f, wave2.f),
        Amin = Math.min(wave1.A, wave2.A),
        Amax = Math.max(wave1.A, wave2.A),
        X = Amin * Amax,
        Y = 2 * Amin / (Amin + Amax),
        s = 0.24 / (0.0207 * fmin + 18.96),
        Z = Math.pow(Math.E, -3.5 * s * (fmax - fmin)) - Math.pow(Math.E, -5.75 * s * (fmax - fmin)),
        R = Math.pow(X, 0.1) * 0.5 * Math.pow(Y, 3.11) * Z;
    return R;
};

// map interval size to
for (var i = 440; i < 880; i++) {
    console.log(roughness({f: 440, A: 1}, {f: i, A: 1}), i);
}
*/
