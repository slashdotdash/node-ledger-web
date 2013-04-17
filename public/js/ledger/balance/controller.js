/*global Ledger */
Ledger.module('Balance', function (Balance, App, Backbone, Marionette, $, _) {
  'use strict';
  
	// Balance Router
	// ---------------
	//
	// Handle routing.
	Balance.Router = Marionette.AppRouter.extend({
		appRoutes: {
		  'balance': 'showBalance',
		  'balance/*account': 'filterByAccount'
		}		
	});

	// Balance Controller (Mediator)
	// ------------------------------
	//
	// Control the workflow and logic that exists at the application
	// level, above the implementation detail of views and models
	Balance.Controller = function () {
		this.balance = new Balance.ModelList();
    this.filteredBalance = FilteredCollection(this.balance);

    // Initially show top-level accounts (e.g. Assets, Expenses, Income, Liabilities)
    this.filteredBalance.where(function(entry) {
      return entry.filterByDepth(1); 
    });
	};

	_.extend(Balance.Controller.prototype, {
		start: _.once(function () {
      this.balance.fetch({reset: true});
		}),

		showBalance: function () {
		  console.log('showBalance');
      this.start();
      
      App.main.show(new Balance.Views.ChartView({
        collection: this.filteredBalance
      }));
		},

    showLevelAccounts: function() {
      App.vent.trigger('balance:filter', {name: ''});
    },

		// filter balance by an account
		filterByAccount: function(account) {
		  var name = (account || '').split('/').join(':');

		  App.vent.trigger('balance:filter', {name: name});
		}
	});

  App.vent.on('balance:filter', function(filter) {
    var name = filter.name,
        url = name.split(':').join('/');

    Backbone.history.navigate('balance/' + url, {trigger: false});
  });
  
	// Balance Initializer
	// --------------------
	//
	// Get the Balance up and running by initializing the mediator
	// when the the application is started, pulling in all of the
	// existing balance items and displaying them.
	Balance.addInitializer(function () {
		var controller = new Balance.Controller();
		
		controller.router = new Balance.Router({
			controller: controller
		});

    // controller.start();
	});
});