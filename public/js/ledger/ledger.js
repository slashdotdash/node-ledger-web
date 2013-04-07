/*global Backbone, _ */
'use strict';

var Ledger = new Backbone.Marionette.Application();

Ledger.addRegions({
	header: '#header',
	main: '#main',
	footer: '#footer'
});

Ledger.on('initialize:before', function() {
  _.templateSettings = {
    evaluate : /\{\[([\s\S]+?)\]\}/g,
    interpolate : /\{\{([\s\S]+?)\}\}/g
  };
});

Ledger.on('initialize:after', function() {
	Backbone.history.start();
});