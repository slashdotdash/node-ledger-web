/*global Ledger */
Ledger.module('Controls', function (Controls, App, Backbone, Marionette, $, _) {
  'use strict';

  // GroupBy Model
	// ----------
	Controls.GroupBy = Backbone.Model.extend({
	  defaults: {
	    name: '',
	    active: false
	  },
	  
	  select: function() {
      this.set('active', true);
	  }
	});
	
	// Grouping Collection
	// ---------------
	Controls.Grouping = Backbone.Collection.extend({
		model: Controls.GroupBy,
		
		initialize: function() {
		  singleActiveItemBehaviour(this);
		},
		
		// Get the currently active groupby
		active: function() {
		  return this.findWhere({active: true}).get('name');
		}
	});

	// Default Grouping Collection
	// ---------------	
	Controls.Grouping.defaults = new Controls.Grouping([
    new Controls.GroupBy({name: 'day'}),
    new Controls.GroupBy({name: 'month', active: true}),
    new Controls.GroupBy({name: 'year'})
  ]);  
});