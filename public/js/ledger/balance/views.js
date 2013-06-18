/*global define */

define([
    'tpl!balance/template-balance-chart-filter-item-view.html',
    'tpl!balance/template-balance-chart-view.html',
    'nvd3',
    'backbone', 'marionette', 'vent', 'jquery', 'underscore'], 
  function(FilterItemTemplate, ChartTemplate, nv, Backbone, Marionette, vent, $, _) {
  'use strict';

  var FilterChartItemView = Marionette.ItemView.extend({
    template: FilterItemTemplate,
    tagName: 'li',
    events: {
      'click': 'filter'
    },
    
    filter: function(e) {
      vent.trigger('balance:filter', {name: this.model.fullname()});
      e.preventDefault();
    }
  });

  // Chart View
  // -----------
  //
  // Display an nvd3 chart of the balance
  var ChartView = Backbone.Marionette.CompositeView.extend({
    template: ChartTemplate,
    itemView: FilterChartItemView,
    itemViewContainer: '#filter',
		
    initialize: function() {
      this.listenTo(this.collection, 'all', this.buildChart, this);
      this.listenTo(vent, 'balance:filter', this.magnify.bind(this));
    },
    
    onRender: function() {
      this.buildChart();
    },
    
    // zoom into a specific entry
    magnify: function(filter) {
      var name = filter.name;
      
      this.collection.where(function(entry) {
        return entry.filterByParentNameAndDepth(name);
      });
    },
    
    buildChart: function() {
      var sourceData = this.chartData();
      if (sourceData.length === 0) return;
     
      nv.addGraph(function() {
        var chart = nv.models.pieChart()
          .x(function(d) { return d.label })
          .y(function(d) { return d.value })
          .values(function(d) { return d })
          .showLabels(true)
          .labelThreshold(.05)
          .donut(true);

          d3.select("#chart svg")
            .datum([sourceData])
            .transition()
            .call(chart);

        return chart;
      });
    },
    
    chartData: function() {
      var values = this.collection
        .map(function(entry) {
          return {
            label: entry.get('account').shortname,
            value: Math.abs(entry.get('total').amount)
          };
        });

      return values;
    }
  });
  
  return {
    FilterChartItemView: FilterChartItemView,
    ChartView: ChartView
  };
});