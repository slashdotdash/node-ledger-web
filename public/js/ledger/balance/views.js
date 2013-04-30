/*global Ledger */
'use strict';

Ledger.module('Balance.Views', function (Views, App, Backbone, Marionette, $) {
  Views.FilterChartItemView = Marionette.ItemView.extend({
    template: '#template-balance-chart-filter-item-view',
    tagName: 'li',
    events: {
      'click': 'filter'
    },
    
    filter: function(e) {
      App.vent.trigger('balance:filter', {name: this.model.fullname()});
      e.preventDefault();
    }
  });

  // Chart View
  // -----------
  //
  // Display an nvd3 chart of the balance
  Views.ChartView = Backbone.Marionette.CompositeView.extend({
    template: '#template-balance-chart-view',
    itemView: Views.FilterChartItemView,
    itemViewContainer: '#filter',
		
    initialize: function() {
      this.listenTo(this.collection, 'all', this.buildChart, this);
      this.listenTo(App.vent, 'balance:filter', this.magnify.bind(this));
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
          .showLabels(true)
          .labelThreshold(.05)
          .donut(true);

          d3.select("#chart svg")
            .datum(sourceData)
            .transition().duration(1200)
            .call(chart);

        return chart;
      });
    },
    
    chartData: function() {
      var values = this.collection
        .map(function(entry) {
          return {
            'label': entry.get('account').shortname,
            'value': Math.abs(entry.get('total').amount)
          };
        });

      return [{
        map: function() { },
        key: 'Balance',
        values: values
      }];
    }
  });
});