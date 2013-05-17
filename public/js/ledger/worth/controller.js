/*global Ledger */
Ledger.module('Worth', function (Worth, App, Backbone, Marionette, $, _) {
  'use strict';
  
	// Worth Router
	// ---------------
	Worth.Router = Marionette.AppRouter.extend({
		appRoutes: {
		  'worth(/:groupBy)': 'showNetWorth'
		}		
	});

	// Worth Controller
	// ------------------------------
	Worth.Controller = function () {
	  this.controls = {
      grouping: App.Controls.Grouping.defaults
    };
    
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

		showNetWorth: function(groupBy) {
		  this.controls.grouping.activate(groupBy);
		  
		  var layout = new App.Controls.Views.Layout();
      App.main.show(layout);
      
      layout.controls.show(new App.Controls.Views.GroupingControlView({
        collection: this.controls.grouping
      }));

      layout.chart.show(new Worth.Views.NetWorthChartView({
        collection: this.netWorth,
        groupBy: groupBy || this.controls.grouping.active()
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
		
		// Update groupBy param in URL when changed
    new ControlNavigation(this, App.vent, router, 'worth');
	});
});