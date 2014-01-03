/** @jsx React.DOM */

define([
  'react',
  'nvd3',
  'd3'
], function(React, nv, d3) {
  'use strict';

  var PieChart = React.createClass({displayName: 'PieChart',
    componentDidMount: function(rootNode) {
      this.buildChart(rootNode);
    },
    
    componentDidUpdate: function(prevProps, prevState, rootNode) {
      this.buildChart(rootNode);
    },

    buildChart: function(el) {
      var self = this,
          sourceData = this.props.data;

      if (sourceData.length === 0) {
        return;
      }

      if (this.chart) {
        d3.select(el)
          .datum(sourceData)
          .transition()
          .call(this.chart);

        return;
      }

      nv.addGraph(function() {
        var chart = nv.models.pieChart()
          .x(function(d) { return d.label; })
          .y(function(d) { return d.value; })
          .showLabels(true)
          .labelThreshold(0.05)
          .donut(true);

          d3.select(el)
            .datum(sourceData)
            .transition()
            .call(chart);

        self.chart = chart;

        return chart;
      });
    },

    render: function() {
      if (this.props.data.length === 0) {
        return (
          React.DOM.p( {className:"text-center"}, "No data")
        );
      }

      return (
        React.DOM.svg( {style:{height: this.props.height, width: this.props.width}} )
      );
    }
  });

  return PieChart;
});