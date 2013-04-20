/*global Ledger */
Ledger.module('Worth', function (Worth, App, Backbone, Marionette, $, _) {
  'use strict';
  
	// Worth Router
	// ---------------
	Worth.Router = Marionette.AppRouter.extend({
		appRoutes: {
		  'worth': 'showNetWorth'
		}		
	});

	// Worth Controller
	// ------------------------------
	Worth.Controller = function () {
	  this.assets = new Worth.Assets();
	  this.liabilities = new Worth.Liabilities();

    // Net worth is the combined total of Assets and Liabilities.
    this.netWorth = AggregateCollection(Worth.Aggregated, [this.assets, this.liabilities]);
	};

	_.extend(Worth.Controller.prototype, {
		start: _.once(function () {
      this.assets.fetch({reset: true});
      this.liabilities.fetch({reset: true});
		}),

		showNetWorth: function() {
      App.main.show(new Worth.Views.NetWorthChartView({
        collection: this.netWorth
      }));
		}
	});

	// Worth Initializer
	// --------------------
	Worth.addInitializer(function() {
		var controller = new Worth.Controller(),
		    router = new Worth.Router({	controller: controller });

		controller.router = router;
		
		// Start the controller on first route to this module
		this.listenToOnce(router, 'route', function() {
		  controller.start();
		});
		
		this.listenTo(router, 'route', function(page) {
      App.vent.trigger('section:activated', {name: 'worth'});
    });
	});
});