/*global Ledger */
Ledger.module('Balance', function (Balance, App, Backbone, Marionette, $, _) {
  'use strict';
  
	// Balance Router
	// ---------------
	Balance.Router = Marionette.AppRouter.extend({
		appRoutes: {
		  'balance': 'showBalance',
		  'balance/*account': 'filterByAccount'
		}		
	});

	// Balance Controller
	// ------------------------------
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

		showBalance: function() {
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
	Balance.addInitializer(function() {
		var controller = new Balance.Controller(),
		    router = new Balance.Router({	controller: controller });

		controller.router = router;
		
		// Start the controller on first route to this module
		this.listenToOnce(router, 'route', function() {
		  controller.start();
		});
		
		this.listenTo(router, 'route', function(page) {
      App.vent.trigger('section:activated', {name: 'balance'});
    });
	});
});