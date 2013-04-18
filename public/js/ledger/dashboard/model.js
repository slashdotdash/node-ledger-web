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
		  this.listenTo(this, 'change:active', this.activeToggled, this);
		},
		
		// Ensure only one model in the collection is active at any time
		activeToggled: function(model, value, options) {
		  if (value === true) {
		    this.forEach(function(m) {
		      if (m.get('active') === true && m !== model) {
		        m.set('active', false);
		      }
		    });
		  }
		}
	});
});