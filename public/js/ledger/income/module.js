/*global define */

define(['ledger', 'income/router', 'income/controller', 'controlNavigation', 'backbone', 'marionette', 'vent', 'jquery', 'underscore'], 
  function(Ledger, Router, Controller, ControlNavigation, Backbone, Marionette, vent, $, _) {
  'use strict';

  var Income = Ledger.module('Income');

  // Initializer
  // -----------
  Income.addInitializer(function(){
		var controller = new Controller(),
		    router = new Router({ controller: controller	});

		controller.router = router;

		// Start the controller on first route to this module
		this.listenToOnce(router, 'route', function() {
		  controller.start();
		});

    // Update groupBy param in URL when changed
    new ControlNavigation(this, vent, router, 'income');
  });
  
  return Income;
});