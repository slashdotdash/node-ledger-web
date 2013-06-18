/*global define */

define([
    'ledger', 
    'worth/model', 
    'worth/views',
    'controls/model',
    'controls/views',
    'aggregateCollection',
    'backbone', 'marionette', 'vent', 'jquery', 'underscore'], 
  function(Ledger, Models, Views, Controls, ControlViews, AggregateCollection, Backbone, Marionette, vent, $, _) {
  'use strict';
  
	// Worth Controller
	// ------------------------------
	var Controller = function () {
	  this.controls = {
      grouping: Controls.defaults
    };
    
	  this.assets = new Models.Assets();
	  this.liabilities = new Models.Liabilities();

    // Net worth is the combined total of Assets and Liabilities.
    this.netWorth = AggregateCollection(Models.Aggregated, [this.assets, this.liabilities]);
	};

	_.extend(Controller.prototype, {
		start: _.once(function () {
      this.assets.fetch({reset: true});
      this.liabilities.fetch({reset: true});
		}),

		showNetWorth: function(groupBy) {
		  this.controls.grouping.activate(groupBy);
		  
		  var layout = new ControlViews.Layout();
      Ledger.main.show(layout);
      
      layout.controls.show(new ControlViews.GroupingControlView({
        collection: this.controls.grouping
      }));

      layout.chart.show(new Views.NetWorthChartView({
        collection: this.netWorth,
        groupBy: groupBy || this.controls.grouping.active()
      }));
		}
	});

  return Controller;
});