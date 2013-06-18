/*global define */

define([
    'ledger', 
    'spending/model', 
    'spending/views',
    'controls/model',
    'controls/views',
    'backbone', 'marionette', 'vent', 'jquery', 'underscore'], 
  function(Ledger, Models, Views, Controls, ControlViews, Backbone, Marionette, vent, $, _) {
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
		  this.controls.grouping.activate(groupBy);
		  
		  var layout = new ControlViews.Layout();
      Ledger.main.show(layout);
      
      layout.controls.show(new ControlViews.GroupingControlView({
        collection: this.controls.grouping
      }));

      layout.chart.show(new Views.ExpenditureChartView({
        collection: this.expenses,
        groupBy: groupBy || this.controls.grouping.active(),
        category: 'account'
      }));
		}
	});
	
	return Controller;
});