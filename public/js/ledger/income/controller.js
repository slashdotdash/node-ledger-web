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
    this.controls = {
      grouping: new Income.Grouping([
        new Income.GroupBy({name: 'day'}),
        new Income.GroupBy({name: 'month', active: true}),
        new Income.GroupBy({name: 'year'})
      ])
    };
    
	  this.income = new Income.Income();
	  this.expenses = new Income.Expenses();

    this.aggregated = AggregateCollection(Income.Aggregated, [this.income, this.expenses]);
	};

	_.extend(Income.Controller.prototype, {
	  start: _.once(function() {
	    this.income.fetch({reset: true});
		  this.expenses.fetch({reset: true});
	  }),
	  
		showIncome: function () {
		  var layout = new Income.Views.Layout();
      App.main.show(layout);
      
      layout.controls.show(new Income.Views.GroupingControlView({
        collection: this.controls.grouping
      }));

      layout.chart.show(new Income.Views.IncomeVsExpenditureChartView({
        collection: this.aggregated,
        groupBy: 'month'
      }));
		}
	});
	
  // Income Initializer
  // -----------
  Income.addInitializer(function(){
		var controller = new Income.Controller(),
		    router = new Income.Router({ controller: controller	});

		controller.router = router;

		// Start the controller on first route to this module
		this.listenToOnce(router, 'route', function() {
		  controller.start();
		});

    this.listenTo(router, 'route', function(page) {
      App.vent.trigger('section:activated', {name: 'income'});
    });
  });
});