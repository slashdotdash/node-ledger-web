/** @jsx React.DOM */

define([
  'dateRange',
  'controls/model',
  'charting/multi-bar-chart',
  'underscore',
  'react',
  'react.backbone'  
], function(DateRange, Controls, MultiBarChart, _, React, createBackboneClass) {
  'use strict';

  var IncomeVsExpenditureChart = createBackboneClass({
    propTypes: {
      model: React.PropTypes.object.isRequired,
      groupBy: React.PropTypes.string.isRequired
    },

    render: function() {
      if (this.props.model.length === 0) {
        return (
          <p className="text-center">No data</p>
        );
      }

      var dateRange = this.props.model.getDateRange(),
          data = this.chartData(dateRange),
          dateFormatting = this.dateFormatString(this.props.groupBy);

      return (
        <MultiBarChart height="700px" width="970px" data={data} dateFormatting={dateFormatting} />
      );
    },
    
    chartData: function(dateRange) {
      var income = this.props.model.filter(function(entry) { return entry.isIncome(); }),
          expenses = this.props.model.filter(function(entry) { return entry.isExpense(); });
      
      var incomeByDate = this.totalByDate(dateRange.between(this.props.groupBy), income, 'Income'),
          expensesByDate = this.totalByDate(dateRange.between(this.props.groupBy), expenses, 'Expenses');
            
      return [
        { key: 'Income', values: incomeByDate }, 
        { key: 'Expenses', values: expensesByDate }
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
    
    totalByDateAndAccount: function(entries, date, type) {
      var total = 0;

      _.each(entries, function(entry) {
        if (entry.groupBy(this.props.groupBy) === date.getTime()) {
          total += entry.totalByAccount(type) * -1;  // Invert amounts
        }
      }, this);

      return total;
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

  return IncomeVsExpenditureChart;
});