/*global Ledger */
Ledger.module('Spending', function (Spending, App, Backbone, Marionette, $, _) {
  'use strict';
  
	// Spending Router
	// ---------------
	Spending.Router = Marionette.AppRouter.extend({
		appRoutes: {
		  'spending(/:groupBy)': 'showSpending'
		}
	});

  Spending.Controller = function () {
    this.controls = {
      grouping: App.Controls.Grouping.defaults
    };
    
	  this.expenses = new Spending.Expenses();
	};

	_.extend(Spending.Controller.prototype, {
	  start: _.once(function() {
		  this.expenses.fetch({reset: true});
	  }),
	  
		showSpending: function (groupBy) {
		  this.controls.grouping.activate(groupBy);
		  
		  var layout = new App.Controls.Views.Layout();
      App.main.show(layout);
      
      layout.controls.show(new App.Controls.Views.GroupingControlView({
        collection: this.controls.grouping
      }));

      layout.chart.show(new Spending.Views.ExpenditureChartView({
        collection: this.expenses,
        groupBy: groupBy || this.controls.grouping.active(),
        category: 'account'
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

    // Update groupBy param in URL when changed
    new ControlNavigation(this, App.vent, router, 'spending');
  });
});