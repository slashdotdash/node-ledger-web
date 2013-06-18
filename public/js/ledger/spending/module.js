/*global define */

define(['ledger', 'spending/router', 'spending/controller', 'controlNavigation', 'backbone', 'marionette', 'vent', 'jquery', 'underscore'], 
  function(Ledger, Router, Controller, ControlNavigation, Backbone, Marionette, vent, $, _) {
  'use strict';

  var Spending = Ledger.module('Spending');

  // Spending Initializer
  // -----------
  Spending.addInitializer(function(){
		var controller = new Controller(),
		    router = new Router({ controller: controller	});

		controller.router = router;

		// Start the controller on first route to this module
		this.listenToOnce(router, 'route', function() {
		  controller.start();
		});

    // Update groupBy param in URL when changed
    new ControlNavigation(this, vent, router, 'spending');
  });
  
  return Spending;
});