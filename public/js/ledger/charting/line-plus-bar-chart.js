/** @jsx React.DOM */

define([
  'dateRange',
  'underscore',
  'react',
  'nvd3',
  'd3'
], function(DateRange, _, React, nv, d3) {
  'use strict';

  var LinePlusBarChart = React.createClass({displayName: 'LinePlusBarChart',
    propTypes: {
      data: React.PropTypes.array.isRequired,
      dateRange: React.PropTypes.array.isRequired,
      dateFormatting: React.PropTypes.string.isRequired
    },

    render: function() {
      if (this.props.data.length === 0) {
        return React.DOM.p( {className:"text-center"}, "No data");
      }

      return (
        React.DOM.svg( {style:{height: this.props.height, width: this.props.width}} )
      );
    },

    componentDidMount: function(rootNode) {
      this.buildChart(rootNode);
    },
    
    componentDidUpdate: function(prevProps, prevState, rootNode) {
      this.buildChart(rootNode);
    },

    buildChart: function(el) {
      var self = this,
          sourceData = this.props.data,
          dateRange = this.props.dateRange,
          dateFormatting = this.props.dateFormatting;

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
        var chart = nv.models.linePlusBarChart()
          .x(function(d, i) { return i; });

        chart.xAxis
          .axisLabel('Date')
          .tickFormat(function(d) {
            if (parseInt(d, 10) === parseInt(d + 0.5, 10)) {
              return d3.time.format(dateFormatting)(dateRange[parseInt(d, 10)]);
            }
            return '';
          });

        chart.y1Axis
          .axisLabel('Amount')
          .tickFormat(function(d) { return '£' + d3.format(',.2f')(d); });

        chart.y2Axis
          .axisLabel('Amount')
          .tickFormat(function(d) { return '£' + d3.format(',.2f')(d); });

        d3.select(el)
          .datum(sourceData)
          .transition()
          .call(chart);

        self.chart = chart;

        return chart;
      });
    }
  });

  return LinePlusBarChart;
});