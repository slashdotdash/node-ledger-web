/** @jsx React.DOM */

define([
  'charting/line-plus-bar-chart',  
  'underscore',
  'react',
  'react.backbone'
], function(LinePlusBarChart, _, React, createBackboneClass) {
  'use strict';

  var NetWorthChart = createBackboneClass({
    propTypes: {
      groupBy: React.PropTypes.string.isRequired,
      model: React.PropTypes.object.isRequired
    },

    render: function() {
      if (this.props.model.length === 0) {
        return React.DOM.p( {className:"text-center"}, "No data");
      }

      var dateRange = this.props.model.getDateRange().between(this.props.groupBy),
          data = this.chartData(dateRange),
          dateFormatting = this.dateFormatString(this.props.groupBy);

      return (
        LinePlusBarChart( {height:"700px", width:"970px", data:data, dateRange:dateRange, dateFormatting:dateFormatting} )
      );
    },
    
    chartData: function(dateRange) {
      var assets = this.props.model.filter(function(entry) { return entry.isAsset(); }),
          liabilities = this.props.model.filter(function(entry) { return entry.isLiability(); });

      assets = this.totalByDate(dateRange, assets, 'Assets');
      liabilities = this.totalByDate(dateRange, liabilities, 'Liabilities');
      
      var assetsMinusLiabilities = _.map(dateRange, function(date, index) {
        return {
          date: date,
          total: assets[index].total + liabilities[index].total  // assets are positive, liabilities are negative
        };
      });
      
      // net worth = assets - liabilities
      var netWorth = this.cumulativeByDate(dateRange, [assets, liabilities]);

      return [
        { key: 'Assets minus Liabilities', values: this.convertToCoordinates(assetsMinusLiabilities), bar: true }, 
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
        if (entry.groupBy(this.props.groupBy) === date.getTime()) {
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
        });

        cumulative += total;

        return {
          date: date,
          total: cumulative
        };
      });
    },

    dateFormatString: function(granularity) {
      switch (granularity) {        
        case 'day': return '%d/%m/%Y';
        case 'month': return '%B %Y';
        case 'year': return '%Y';
      }
      
      throw 'Date range granularity "' + granularity + '" is not supported';      
    }
  });

  return NetWorthChart;
});