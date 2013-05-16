/*global Ledger */
'use strict';

Ledger.module('Controls.Views', function (Views, App, Backbone, Marionette, $, _) {
  // Layout
  // -----------
  Views.Layout = Backbone.Marionette.Layout.extend({
    template: "#template-charting-layout",

    regions: {
      chart: "#chart",
      controls: "#controls"
    }
  });
  
  // Grouping Control Item View
  // -----------
  Views.GroupingControlItemView = Backbone.Marionette.ItemView.extend({
    template: '#template-controls-grouping-item',
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
		  App.vent.trigger('controls:groupby', {name: this.model.get('name')});
		  
		  e.preventDefault();
		  return false;
		}		
  });
  
  // Grouping Control View
  // -----------  
  Views.GroupingControlView = Backbone.Marionette.CompositeView.extend({
    template: '#template-controls-grouping-control',
    itemView: Views.GroupingControlItemView,
    itemViewContainer: '#groupby'
  });
});