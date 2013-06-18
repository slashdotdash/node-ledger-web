/*global define */

define([
    'tpl!controls/template-charting-layout.html',
    'tpl!controls/template-controls-grouping-item.html',
    'tpl!controls/template-controls-grouping-control.html',
    'backbone', 'marionette', 'vent', 'jquery', 'underscore'], 
  function(ChartingLayout, GroupingItemTemplate, GroupingTemplate, Backbone, Marionette, vent, $, _) {
  'use strict';

  // Layout
  // -----------
  var Layout = Marionette.Layout.extend({
    template: ChartingLayout,

    regions: {
      chart: "#chart",
      controls: "#controls"
    }
  });
  
  // Grouping Control Item View
  // -----------
  var GroupingControlItemView = Marionette.ItemView.extend({
    template: GroupingItemTemplate,
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
		  vent.trigger('controls:groupby', {name: this.model.get('name')});
		  
		  e.preventDefault();
		  return false;
		}		
  });
  
  // Grouping Control View
  // -----------  
  var GroupingControlView = Marionette.CompositeView.extend({
    template: GroupingTemplate,
    itemView: GroupingControlItemView,
    itemViewContainer: '#groupby'
  });
  
  return {
    Layout: Layout,
    GroupingControlItemView: GroupingControlItemView,
    GroupingControlView: GroupingControlView
  };
});