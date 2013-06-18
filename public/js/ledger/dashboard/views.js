/*global define */

define([
    'tpl!dashboard/template-dashboard-view.html', 
    'tpl!dashboard/template-dashboard-nav-item-view.html',
    'tpl!dashboard/template-dashboard-nav-view.html',
    'backbone', 'marionette', 'vent', 'jquery', 'underscore'], 
  function(DashboardTemplate, NavItemTemplate, NavigationTemplate, Backbone, Marionette, vent, $, _) {
  'use strict';

  // Dashboard View
  // --------------
  var DashboardView = Marionette.ItemView.extend({
    template: DashboardTemplate
  });

	// Dashboard Navigation Item View
	// -------------------
	var NavigationItemView = Marionette.ItemView.extend({
    template: NavItemTemplate,
	  tagName: 'li',
		events: {
		  'click': 'select'
		},

		initialize: function() {	
		  this.listenTo(this.model, 'all', this.render, this);
		},

		onRender: function() {
      if (this.model.get('active')) {
        $(this.el).addClass('active');
      } else {
        $(this.el).removeClass('active');
      }
    },    

		select: function(e) {
		  this.model.select();
		  
		  e.preventDefault();
		  return false;
		}
	});
	
	// Dashboard Navigation Item View
	// -------------------
	var NavigationView = Backbone.Marionette.CompositeView.extend({
    itemView: NavigationItemView,
    itemViewContainer: 'ul.nav',
    template: NavigationTemplate,
    tagName: 'div',
    className: 'navbar-inner',
    
    initialize: function() {	
		  this.listenTo(this.collection, 'change', this.render, this);
		}
  });
  
  return {
    Dashboard: DashboardView,
    NavigationItem: NavigationItemView,
    Navigation: NavigationView
  }
});