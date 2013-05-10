/*global Ledger */
'use strict';

Ledger.module('Spending.Views', function (Views, App, Backbone, Marionette, $, _) {
  // Layout
  // -----------
  Views.Layout = Backbone.Marionette.Layout.extend({
    template: "#template-spending-layout",

    regions: {
      chart: "#chart",
      controls: "#controls"
    }
  });
  
  // Expenditure Chart View
  // -----------
  Views.ExpenditureChartView = Backbone.Marionette.ItemView.extend({
    template: '#template-spending-chart-view',
		
    initialize: function() {
      this.listenTo(this.collection, 'all', this.buildChart, this);
      this.listenTo(App.vent, 'spending:groupby', this.groupBy.bind(this));
    },
    
    onRender: function() {
      this.buildChart();
    },
    
    // Group the chart data by the given date period (day, month, year)
    groupBy: function(groupBy) {
      this.options.groupBy = groupBy.name;
      this.buildChart();
    },

    buildChart: function() {
      if (this.collection.length == 0) { 
        return;
      }
      
      var dateRange = this.collection.getDateRange(),
          sourceData = this.chartData(dateRange),
          dateFormatting = this.dateFormatString(this.options.groupBy);
      
      nv.addGraph(function() {
        var chart = nv.models.multiBarChart()
          .x(function(d) { return d.date })
          .y(function(d) { return d.total });

        chart.xAxis
          .axisLabel('Date')
          .showMaxMin(true)
          .tickFormat(function(d) { return d3.time.format(dateFormatting)(new Date(d)); });

        chart.yAxis
          .axisLabel('Amount')
          .tickFormat(d3.format(',.1f'));

        d3.select("#chart svg")
          .datum(sourceData)
          .transition().duration(100)
          .call(chart);

        return chart;
      });
    },
    
    dateFormatString: function(granularity) {
      switch (granularity) {
        case 'day': return '%d/%m/%Y';
        case 'month': return '%B %Y';
        case 'year': return '%Y';
      }
      
      throw 'Date range granularity "' + granularity + '" is not supported';		  
    },
    
    chartData: function(dateRange) {
      var expenses = this.totalByDate(dateRange.between(this.options.groupBy), this.collection.models);
      
      return [
        { key: 'Spending', values: expenses }
      ];
    },
    
    // Total amount for each date in the given range
    totalByDate: function(dateRange, entries) {
      return _.map(dateRange, function(date) {
        return {
          date: date,
          total: this.totalByDateAndAccount(entries, date)
        };
      }, this);
    },
    
    totalByDateAndAccount: function(entries, date) {
      var total = 0;

      _.each(entries, function(entry) {
        if (entry.groupBy(this.options.groupBy) === date.getTime()) {
          total += entry.totalAmount()
        }
      }, this);

      return total;
		}
  });
  
  // Grouping Control Item View
  // -----------
  Views.GroupingControlItemView = Backbone.Marionette.ItemView.extend({
    template: '#template-spending-grouping-item',
    tagName: 'li',
    events: {
      'click': 'select'
    },

		initialize: function() {	
		  this.listenTo(this.model, 'all', this.render, this);
		},

		onRender: function() {
      if (this.model.get('active')) {
        $(this.el).addClass('active');
      } else {
        $(this.el).removeClass('active');
      }
    },    
		
		select: function(e) {
		  this.model.select();
		  App.vent.trigger('spending:groupby', {name: this.model.get('name')});
		  
		  e.preventDefault();
		  return false;
		}		
  });
  
  // Grouping Control View
  // -----------  
  Views.GroupingControlView = Backbone.Marionette.CompositeView.extend({
    template: '#template-spending-grouping-control',
    itemView: Views.GroupingControlItemView,
    itemViewContainer: '#groupby'
  });
});