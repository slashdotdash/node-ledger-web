/*global Ledger */
Ledger.module('Dashboard.Views', function (Views, App, Backbone, Marionette, $) {
  'use strict';

  // Dashboard View
  // --------------
  Views.DashboardView = Marionette.ItemView.extend({
    template: '#template-dashboard-view'
  });
  
	// Dashboard Navigation Item View
	// -------------------
	Views.NavigationItemView = Marionette.ItemView.extend({
	  template: '#template-dashboard-nav-item-view',
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

		destroy: function() { },
		
		select: function(e) {
		  this.model.select();
		  
		  e.preventDefault();
		  return false;
		}
	});
	
	// Dashboard Navigation Item View
	// -------------------
	Views.NavigationView = Backbone.Marionette.CompositeView.extend({
    itemView: Views.NavigationItemView,
    itemViewContainer: 'ul.nav',
    template: '#template-dashboard-nav-view',
    tagName: 'div',
    className: 'navbar-inner',
    
    initialize: function() {	
		  this.listenTo(this.collection, 'change', this.render, this);
		}
  });  
});