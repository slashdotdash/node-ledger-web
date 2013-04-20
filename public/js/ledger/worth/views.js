/*global Ledger */
'use strict';

Ledger.module('Worth.Views', function (Views, App, Backbone, Marionette, $, _) {
  // Net Worth Chart View
  // --------------------
  //
  // Display an nvd3 chart of assets and liabilities (total = net worth).
  Views.NetWorthChartView = Backbone.Marionette.ItemView.extend({
    template: '#template-net-worth-chart-view',
		
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
        var chart = nv.models.linePlusBarChart()
          .x(function(d, i) { return i; });

        chart.xAxis
          .axisLabel('Date')
          .tickFormat(function(d) {
            return d3.time.format('%d/%m/%Y')(dateRange[d]); 
          });

        chart.y1Axis
          .axisLabel('Amount')
          .tickFormat(function(d) { return '£' + d3.format(',.2f')(d) });

        chart.y2Axis
          .axisLabel('Amount')
          .tickFormat(function(d) { return '£' + d3.format(',.2f')(d) });

        d3.select("#chart svg")
          .datum(sourceData)
          .transition().duration(500)
          .call(chart);

        return chart;
      });
    },
    
    chartData: function(dateRange) {
      if (this.collection.length == 0) { 
        return []; 
      }

      var assets = this.collection.filter(function(entry) { return entry.isAsset(); }),
          liabilities = this.collection.filter(function(entry) { return entry.isLiability(); });

      assets = this.totalByDate(dateRange, assets, 'Assets');
      liabilities = this.totalByDate(dateRange, liabilities, 'Liabilities');
      
      // net worth = assets + liabilities
      var netWorth = this.cumulativeByDate(dateRange, [assets, liabilities]);

      return [
        { key: 'Assets', values: this.convertToCoordinates(assets), bar: true }, 
        { key: 'Liabilities', values: this.convertToCoordinates(liabilities), bar: true },
        { key: 'Net Worth', values: this.convertToCoordinates(netWorth) }
      ];
    },
    
    convertToCoordinates: function(list) {
      return _.map(list, function(entry) {
        return { x: entry.date, y: entry.total };
      });
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
		},
		
		cumulativeByDate: function(dateRange, lists) {
      var cumulative = 0;
      
      return _.map(dateRange, function(date, index) {
        var total = 0;
        
        _.each(lists, function(list) {
          total += list[index].total;
        })

        cumulative += total;

        return {
          date: date,
          total: cumulative
        };
      });
    }    
  });
});