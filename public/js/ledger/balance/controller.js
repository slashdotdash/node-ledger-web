/*global define */

define([
    'ledger', 
    'balance/model', 
    'balance/views',
    'controls/model',
    'controls/views',
    'filteredCollection',
    'backbone', 'marionette', 'vent', 'jquery', 'underscore'], 
  function(Ledger, Models, Views, Controls, ControlViews, FilteredCollection, Backbone, Marionette, vent, $, _) {
  'use strict';
  
	// Balance Controller
	// ------------------------------
	var Controller = function () {
		this.balance = new Models.Balances();
    this.filteredBalance = FilteredCollection(this.balance);
	};

	_.extend(Controller.prototype, {
		start: _.once(function () {
      this.balance.fetch({reset: true});
		}),

		showBalance: function() {
		  this.showBalanceChartView();
		  
		  // Initially show top-level accounts (e.g. Assets, Expenses, Income, Liabilities)
      this.filteredBalance.where(function(entry) {
        return entry.filterByDepth(1); 
      });
		},

		// filter balance by an account
		filterByAccount: function(account) {
		  this.showBalanceChartView();
		  
		  var name = (account || '').split('/').join(':');
		  vent.trigger('balance:filter', {name: name});
		},
		
		showBalanceChartView: function() {
      Ledger.main.show(new Views.ChartView({
        collection: this.filteredBalance
      }));		  
		}
	});

  vent.on('balance:filter', function(filter) {
    var name = filter.name,
        url = name.split(':').join('/');

    Backbone.history.navigate('balance/' + url, {trigger: false});
  });

  return Controller;
});