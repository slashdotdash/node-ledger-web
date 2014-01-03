define([
  'ledger',
  './router',
  './controller',
  'controlNavigation',
  'vent'
], function(Ledger, Router, Controller, ControlNavigation, vent) {
  'use strict';

  var Balance = Ledger.module('Balance');

  Balance.addInitializer(function() {
    var controller = new Controller(),
        router = new Router({ controller: controller });

    // Start the controller on first route to this module
    this.listenToOnce(router, 'route', function() {
      controller.start();
    });
    
    this.listenTo(router, 'route', function() {
      vent.trigger('section:activated', {name: 'balance'});
    });
  });
  
  return Balance;
});