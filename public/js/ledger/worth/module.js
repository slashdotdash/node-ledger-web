define([
  'ledger',
  './router',
  './controller',
  'controlNavigation',
  'vent'
], function(Ledger, Router, Controller, ControlNavigation, vent) {
  'use strict';

  var Worth = Ledger.module('Worth');

  Worth.addInitializer(function() {
    var controller = new Controller(),
        router = new Router({ controller: controller });

    // Start the controller on first route to this module
    this.listenToOnce(router, 'route', function() {
      controller.start();
    });
    
    // Update groupBy param in URL when changed
    new ControlNavigation(this, vent, router, 'worth');
  });
  
  return Worth;
});