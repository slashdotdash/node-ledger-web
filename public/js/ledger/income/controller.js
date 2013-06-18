/*global define */

define([
    'ledger', 
    'income/model', 
    'income/views',
    'controls/model',
    'controls/views',
    'aggregateCollection',
    'backbone', 'marionette', 'vent', 'jquery', 'underscore'], 
  function(Ledger, Models, Views, Controls, ControlViews, AggregateCollection, Backbone, Marionette, vent, $, _) {
  'use strict';

  var Controller = function () {
    this.controls = {
      grouping: Controls.defaults
    };
    
	  this.income = new Models.Income();
	  this.expenses = new Models.Expenses();

    this.aggregated = AggregateCollection(Models.Aggregated, [this.income, this.expenses]);
	};

	_.extend(Controller.prototype, {
	  start: _.once(function() {
	    this.income.fetch({reset: true});
		  this.expenses.fetch({reset: true});
	  }),
	  
		showIncome: function(groupBy) {
		  this.controls.grouping.activate(groupBy);
		  
		  var layout = new ControlViews.Layout();
      Ledger.main.show(layout);
      
      layout.controls.show(new ControlViews.GroupingControlView({
        collection: this.controls.grouping
      }));
      
      layout.chart.show(new Views.IncomeVsExpenditureChartView({
        collection: this.aggregated,
        groupBy: groupBy || this.controls.grouping.active()
      }));
		}
	});
	
	return Controller;
});