/*global Ledger */
Ledger.module('Dashboard', function (Dashboard, App, Backbone, Marionette, $, _) {
  'use strict';
  
	// Dashboard Router
	// ---------------
	Dashboard.Router = Marionette.AppRouter.extend({
		appRoutes: {
		  '': 'showDashboard'
		}		
	});

  Dashboard.Controller = function () {
    this.sections = new Dashboard.Sections([
      new Dashboard.Section({title: 'Home', name: 'dashboard', url: '', active: true}),
      new Dashboard.Section({title: 'Income', name: 'income', url: 'income'}),
      new Dashboard.Section({title: 'Spending', name: 'spending', url: 'spending'}),
      new Dashboard.Section({title: 'Worth', name: 'worth', url: 'worth'}),
      new Dashboard.Section({title: 'Balance', name: 'balance', url: 'balance'})
    ]);
    
    this.sections.on('change:active', this.showSection, this);

    // Select the activated section on navigation
    App.vent.on('section:activated', function(params) {
      this.sections.activate(params.name);
    }, this);
	};

	_.extend(Dashboard.Controller.prototype, {
	  start: _.once(function() {
	    App.nav.show(new Dashboard.Views.NavigationView({
	      collection: this.sections
	    }));
	  }),
	  
		showDashboard: function () {
      App.main.show(new Dashboard.Views.DashboardView());
		},
		
		showSection: function(section, value, options) {
		  if (value === true) {
		    var url = section.get('url');
		    
		    // Don't navigate if we are already in this section
		    if (window.location.pathname.indexOf('/' + url) === 0) {
		      return;
		    }
		    
        Backbone.history.navigate(url, {trigger: true});
	    }
		}
	});
	    
  // Initializer
  // -----------
  //
  // The router must always be alive with the app, so that it can
  // respond to route changes and start up the right sub-app 
  Dashboard.addInitializer(function() {
		var controller = new Dashboard.Controller(),
		    router = new Dashboard.Router({	controller: controller });
		
		controller.router = router;
		
		// Immediately start the dashboard controller (home page)
    controller.start();
    
    this.listenTo(router, 'route', function(page) {
      App.vent.trigger('section:activated', {name: 'dashboard'});
    });
  });
});