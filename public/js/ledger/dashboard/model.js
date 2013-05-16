/*global Ledger */
Ledger.module('Dashboard', function (Dashboard, App, Backbone) {
  'use strict';
  
	// Section Model
	// ----------
	Dashboard.Section = Backbone.Model.extend({
		defaults: {
      title: '',
      url: '',
      active: false
		},
		
		select: function() {
		  this.set('active', true);
		}
	});

	// Sections Collection
	// ---------------
	Dashboard.Sections = Backbone.Collection.extend({
		model: Dashboard.Section,
		
		initialize: function() {
		  singleActiveItemBehaviour(this);
		},
		
		activate: function(name) {
		  if (name && name.length !== 0) {
		    this.findWhere({name: name}).select();
		  }
		}
	});
});