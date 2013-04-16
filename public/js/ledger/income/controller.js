/*global Ledger */
Ledger.module('Income', function (Income, App, Backbone, Marionette, $, _) {
  'use strict';
  
	// Income Router
	// ---------------
	Income.Router = Marionette.AppRouter.extend({
		appRoutes: {
		  'income': 'showIncome'
		}		
	});

  Income.Controller = function () {
	  this.income = new Income.Income();
	  this.expenses = new Income.Expenses();

    this.aggregated = AggregateCollection(Income.Aggregated, [this.income, this.expenses]);
	};

	_.extend(Income.Controller.prototype, {
		showIncome: function () {
		  this.income.fetch({reset: true});
		  this.expenses.fetch({reset: true});
		  
		  App.main.show(new Income.Views.IncomeVsExpenditureChartView({
        collection: this.aggregated
      }));
		}
	});
	
  // Initializer
  // -----------
  //
  // The router must always be alive with the app, so that it can
  // respond to route changes and start up the right sub-app 
  Income.addInitializer(function(){
		var controller = new Income.Controller();

		controller.router = new Income.Router({
			controller: controller
		});

    // controller.start();
  });
});