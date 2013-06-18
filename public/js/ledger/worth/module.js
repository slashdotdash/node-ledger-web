/*global define */

define(['ledger', 'worth/router', 'worth/controller', 'controlNavigation', 'backbone', 'marionette', 'vent', 'jquery', 'underscore'], 
  function(Ledger, Router, Controller, ControlNavigation, Backbone, Marionette, vent, $, _) {
  'use strict';

  var Worth = Ledger.module('Worth');

	// Worth Initializer
	// --------------------
	Worth.addInitializer(function() {
		var controller = new Controller(),
		    router = new Router({	controller: controller });

		controller.router = router;
		
		// Start the controller on first route to this module
		this.listenToOnce(router, 'route', function() {
		  controller.start();
		});
		
		// Update groupBy param in URL when changed
    new ControlNavigation(this, vent, router, 'worth');
	});
  
  return Worth;
});