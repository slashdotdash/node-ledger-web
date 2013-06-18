/*global define */

define(['ledger', 'balance/router', 'balance/controller', 'controlNavigation', 'backbone', 'marionette', 'vent', 'jquery', 'underscore'], 
  function(Ledger, Router, Controller, ControlNavigation, Backbone, Marionette, vent, $, _) {
  'use strict';

  var Balance = Ledger.module('Balance');

	// Balance Initializer
	// --------------------
	Balance.addInitializer(function() {
		var controller = new Controller(),
		    router = new Router({	controller: controller });

		controller.router = router;
		
		// Start the controller on first route to this module
		this.listenToOnce(router, 'route', function() {
		  controller.start();
		});
		
		this.listenTo(router, 'route', function(page) {
      vent.trigger('section:activated', {name: 'balance'});
    });
	});
  
  return Balance;
});