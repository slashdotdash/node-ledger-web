/*global define */

define([
    'tpl!charting/template-chart-container.html', 
    'nvd3',
    'backbone', 'marionette', 'vent', 'jquery', 'underscore'], 
  function(ChartTemplate, nv, Backbone, Marionette, vent, $, _) {
  'use strict';

  // Net Worth Chart View
  // --------------------
  //
  // Display an nvd3 chart of assets and liabilities (total = net worth).
  var NetWorthChartView = Backbone.Marionette.ItemView.extend({
    template: ChartTemplate,
		
    initialize: function() {
      this.listenTo(this.collection, 'all', this.buildChart, this);
      this.listenTo(vent, 'controls:groupby', this.groupBy.bind(this));
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
      
      var dateRange = this.collection.getDateRange().between(this.options.groupBy),
          sourceData = this.chartData(dateRange),
          dateFormatting = this.dateFormatString(this.options.groupBy);

      nv.addGraph(function() {
        var chart = nv.models.linePlusBarChart()
          .x(function(d, i) { return i; });

        chart.xAxis
          .axisLabel('Date')
          .tickFormat(function(d) {
            if (parseInt(d) === parseInt(d + 0.5)) {
              return d3.time.format(dateFormatting)(dateRange[parseInt(d)]);
            }
            return '';
          });

        chart.y1Axis
          .axisLabel('Amount')
          .tickFormat(function(d) { return '£' + d3.format(',.2f')(d) });

        chart.y2Axis
          .axisLabel('Amount')
          .tickFormat(function(d) { return '£' + d3.format(',.2f')(d) });

        d3.select("#chart svg")
          .datum(sourceData)
          .transition()
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
      var assets = this.collection.filter(function(entry) { return entry.isAsset(); }),
          liabilities = this.collection.filter(function(entry) { return entry.isLiability(); });

      assets = this.totalByDate(dateRange, assets, 'Assets');
      liabilities = this.totalByDate(dateRange, liabilities, 'Liabilities');
      
      var assetsPlusLiabilities = _.map(dateRange, function(date, index) {
        return {
          date: date,
          total: assets[index].total + liabilities[index].total
        };
      });
      
      // net worth = assets + liabilities
      var netWorth = this.cumulativeByDate(dateRange, [assets, liabilities]);

      return [
        { key: 'Assets minus Liabilities', values: this.convertToCoordinates(assetsPlusLiabilities), bar: true }, 
        // { key: 'Assets', values: this.convertToCoordinates(assets), bar: true }, 
        // { key: 'Liabilities', values: this.convertToCoordinates(liabilities), bar: true },
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
        if (entry.groupBy(this.options.groupBy) === date.getTime()) {
          total += entry.totalByAccount(account);
        }
      }, this);

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
  
  return {
    NetWorthChartView: NetWorthChartView
  };
});