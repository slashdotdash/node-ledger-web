/*global Ledger */
'use strict';

Ledger.module('Spending.Views', function (Views, App, Backbone, Marionette, $, _) {
  // Expenditure Chart View
  // -----------
  Views.ExpenditureChartView = Backbone.Marionette.ItemView.extend({
    template: '#template-spending-chart-view',
		
    initialize: function() {
      this.listenTo(this.collection, 'all', this.buildChart, this);
    },
    
    onRender: function() {
      this.buildChart();
    },
        
    buildChart: function() {
      var dateRange = this.collection.getDateRange();
      var sourceData = this.chartData(dateRange);
      if (sourceData.length === 0) return;
     
      nv.addGraph(function() {
        var chart = nv.models.multiBarChart()
          .x(function(d) { return d.date })
          .y(function(d) { return d.total });

        chart.xAxis
          .axisLabel('Date')
          .showMaxMin(true)
          .tickFormat(function(d) { return d3.time.format('%d/%m/%Y')(new Date(d)); });

        chart.yAxis
          .axisLabel('Amount')
          .tickFormat(d3.format(',.1f'));

        d3.select("#chart svg")
          .datum(sourceData)
          .transition().duration(1200)
          .call(chart);

        return chart;
      });
    },
    
    chartData: function(dateRange) {
      if (this.collection.length == 0) { 
        return []; 
      }

      var expenses = this.collection.models;
      
      expenses = this.totalByDate(dateRange, expenses, 'Expenses');
      
      return [
        { key: 'Spending', values: expenses }
      ];
    },
    
    // Total amount for each date in the given range
    totalByDate: function(dateRange, entries, type) {
      return _.map(dateRange, function(date) {
        return {
          date: date,
          total: this.totalByDateAndAccount(entries, date, type)
        };
      }, this);
    },
    
    totalByDateAndAccount: function(entries, date, account) {
      var total = 0;
      
      _.each(entries, function(entry) {
        if (new Date(entry.get('date')).getTime() === date.getTime()) {
          total += entry.totalByAccount(account);
        }
      });

      return total;
		}
  });
});