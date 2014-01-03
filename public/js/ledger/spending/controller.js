define([
  './model',
  './expenditure-chart',
  'controls/model',
  'controls/charting',
  'backbone',
  'marionette',
  'vent',
  'underscore',
  'react'
], function(Models, ExpenditureChart, Controls, Charting, Backbone, Marionette, vent, _, React) {
  'use strict';
  
  var Controller = function () {
    this.controls = {
      grouping: Controls.defaults
    };
    
    this.expenses = new Models.Expenses();
  };

  _.extend(Controller.prototype, {
    start: _.once(function() {
      this.expenses.fetch({reset: true});
    }),
    
    showSpending: function (groupBy) {
      groupBy = groupBy || this.controls.grouping.active();

      this.controls.grouping.activate(groupBy);

      var chart = new ExpenditureChart({ model: this.expenses, groupBy: groupBy, category: 'account' });

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