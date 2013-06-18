/*global define */

define(['backbone', 'marionette', 'underscore'], function(Backbone, Marionette, _) {
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