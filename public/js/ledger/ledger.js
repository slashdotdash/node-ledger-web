define([
  'backbone',
  'marionette'
], function(Backbone, Marionette) {
  'use strict';

  var Ledger = new Marionette.Application();

  Ledger.addRegions({
    nav: '#nav',
    main: '#main'
  });

  Ledger.on('initialize:after', function() {
    Backbone.history.start({pushState: true});
  });
  
  return Ledger;
});