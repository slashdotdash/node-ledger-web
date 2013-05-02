/*global Ledger */
Ledger.module('Spending', function (Spending, App, Backbone, Marionette, $, _) {
  'use strict';
  
	// Spending Router
	// ---------------
	Spending.Router = Marionette.AppRouter.extend({
		appRoutes: {
		  'spending': 'showSpending'
		}		
	});

  Spending.Controller = function () {
	  this.expenses = new Spending.Expenses();
	};

	_.extend(Spending.Controller.prototype, {
	  start: _.once(function() {
		  this.expenses.fetch({reset: true});
	  }),
	  
		showSpending: function () {
		  App.main.show(new Spending.Views.ExpenditureChartView({
        collection: this.expenses,
        groupBy: 'month'
      }));
		}
	});
	
  // Spending Initializer
  // -----------
  Spending.addInitializer(function(){
		var controller = new Spending.Controller(),
		    router = new Spending.Router({ controller: controller	});

		controller.router = router;

		// Start the controller on first route to this module
		this.listenToOnce(router, 'route', function() {
		  controller.start();
		});

    this.listenTo(router, 'route', function(page) {
      App.vent.trigger('section:activated', {name: 'spending'});
    });
  });
});