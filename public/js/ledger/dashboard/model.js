/*global define */

define(['singleActiveItem', 'backbone', 'marionette', 'jquery', 'underscore'], 
  function(singleActiveItem, Backbone, Marionette, $, _) {
  'use strict';

	// Section Model
	// ----------
	var Section = Backbone.Model.extend({
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
	var Sections = Backbone.Collection.extend({
		model: Section,
		
		initialize: function() {
		  singleActiveItem(this);
		},
		
		activate: function(name) {
		  if (name && name.length !== 0) {
		    this.findWhere({name: name}).select();
		  }
		}
	});

	return {
    Section: Section,
    Sections: Sections
	};
});