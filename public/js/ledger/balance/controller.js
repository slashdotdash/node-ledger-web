/*global Ledger */
'use strict';

Ledger.module('Balance', function (Balance, App, Backbone, Marionette, $, _) {
	// Balance Router
	// ---------------
	//
	// Handle routing.
	Balance.Router = Marionette.AppRouter.extend({
		appRoutes: {
      // '/balance': 'filterItems'
		}
	});

	// Balance Controller (Mediator)
	// ------------------------------
	//
	// Control the workflow and logic that exists at the application
	// level, above the implementation detail of views and models
	Balance.Controller = function () {
		this.balance = new Balance.ModelList();
	};

	_.extend(Balance.Controller.prototype, {
		// Start the app by showing the appropriate views
		// and fetching the list of todo items, if there are any
		start: function () {
      this.showHeader(this.balance);
			this.showFooter(this.balance);
			this.showBalance(this.balance);
			this.balance.fetch();
		},

		showHeader: function (todoList) {
      // var header = new App.Layout.Header({
      //  collection: todoList
      // });
      // App.header.show(header);
		},

		showFooter: function (balance) {
      // var footer = new App.Layout.Footer({
      //  collection: todoList
      // });
      // App.footer.show(footer);
		},

		showBalance: function (balance) {
			App.main.show(new Balance.Views.ListView({
				collection: balance
			}));
		},

		// Set the filter to show complete or all items
		filterItems: function (filter) {
			App.vent.trigger('todoList:filter', filter.trim() || '');
		}
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

		controller.start();
	});
});