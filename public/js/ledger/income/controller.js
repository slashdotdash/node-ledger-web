define([
  './model',
  './income-vs-expenditure-chart',
  'controls/model',
  'controls/charting',
  'aggregateCollection',
  'vent',
  'underscore',
  'react'
], function(Models, IncomeVsExpenditureChart, Controls, Charting, AggregateCollection, vent, _, React) {
  'use strict';

  var Controller = function () {
    this.controls = {
      grouping: Controls.defaults
    };
    
    this.income = new Models.Income();
    this.expenses = new Models.Expenses();
    this.aggregated = new AggregateCollection(Models.Aggregated, [this.income, this.expenses]);
  };

  _.extend(Controller.prototype, {
    start: _.once(function() {
      this.income.fetch({reset: true});
      this.expenses.fetch({reset: true});
    }),
    
    showIncome: function(groupBy) {
      groupBy = groupBy || this.controls.grouping.active();

      this.controls.grouping.activate(groupBy);

      var chart = new IncomeVsExpenditureChart({ model: this.aggregated, groupBy: groupBy });

      var onGroupBy = function(groupBy) {
        var name = groupBy.get('name');

        chart.setProps({ groupBy: name });

        vent.trigger('controls:groupby', { name: name });
      };

      React.renderComponent(
        new Charting({ grouping: this.controls.grouping, onGroupBy: onGroupBy }, chart),
        document.getElementById('main')
      );
    }
  });
  
  return Controller;
});