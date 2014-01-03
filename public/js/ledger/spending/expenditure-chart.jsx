/** @jsx React.DOM */

define([
  'charting/multi-bar-chart',  
  'underscore',
  'react',
  'react.backbone'
], function(MultiBarChart, _, React, createBackboneClass) {
  'use strict';

  var ExpenditureChart = createBackboneClass({
    propTypes: {
      category: React.PropTypes.string.isRequired,
      groupBy: React.PropTypes.string.isRequired,
      model: React.PropTypes.object.isRequired
    },

    render: function() {
      if (this.props.model.length === 0) {
        return <p className="text-center">No data</p>;
      }

      var dateRange = this.props.model.getDateRange().between(this.props.groupBy),
          data = this.chartData(dateRange, this.props.category),
          dateFormatting = this.dateFormatString(this.props.groupBy);

      return (
        <MultiBarChart height="700px" width="970px" data={data} dateFormatting={dateFormatting} />
      );
    },
    
    chartData: function(dateRange, category) {
      if (category === 'account') {
        // Show expenses per account
        var data = [],
            accounts = this.props.model.getAccounts();

        _.each(accounts, function(account) {
          data.push({
            key: account.toString().substr(9),
            values: this.totalByDate(dateRange, account, this.props.model.getByAccount(account))
          });
        }, this);

        return data;
      } else {
        // Total expenses for all accounts
        var expenses = this.totalByDate(dateRange, this.props.model.models);

        return [
          { key: 'Spending', values: expenses }
        ];
      }      
    },
    
    // Total amount for each date in the given range
    totalByDate: function(dateRange, account, entries) {
      return _.map(dateRange, function(date) {
        return {
          date: date,
          total: this.totalByDateAndAccount(entries, date, account)
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

      return Math.max(total, 0);
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

  return ExpenditureChart;
});