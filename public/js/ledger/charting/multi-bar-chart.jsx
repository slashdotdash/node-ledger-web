/** @jsx React.DOM */

define([
  'dateRange',
  'underscore',
  'react',
  'nvd3',
  'd3'
], function(DateRange, _, React, nv, d3) {
  'use strict';

  var MultiBarChart = React.createClass({
    propTypes: {
      data: React.PropTypes.array.isRequired,
      dateFormatting: React.PropTypes.string.isRequired,

      // chart formatting options
      stacked: React.PropTypes.bool,
      showLegend: React.PropTypes.bool
    },

    getDefaultProps: function() {
      return {
        stacked: true,
        showLegend: true
      };
    },

    render: function() {
      if (this.props.data.length === 0) {
        return <p className="text-center">No data</p>;
      }

      return (
        <svg style={{height: this.props.height, width: this.props.width}} />
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
        var chart = nv.models.multiBarChart()
          .stacked(self.props.stacked)
          .showLegend(self.props.showLegend)          
          .x(function(d) { return d.date; })
          .y(function(d) { return d.total; });

        chart.xAxis
          .axisLabel('Date')
          .showMaxMin(true)
          .tickFormat(function(d) { return d3.time.format(dateFormatting)(new Date(d)); });

        chart.yAxis
          .axisLabel('Amount')
          .tickFormat(d3.format(',.1f'));

        d3.select(el)
          .datum(sourceData)
          .transition()
          .call(chart);

        self.chart = chart;

        return chart;
      });
    }    
  });

  return MultiBarChart;
});