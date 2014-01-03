define([
  'singleActiveItem',
  'backbone'
], function(singleActiveItem, Backbone) {
  'use strict';

  var GroupBy = Backbone.Model.extend({
    defaults: {
      name: '',
      active: false
    },
    
    select: function() {
      this.set('active', true);
    }
  });
  
  var Grouping = Backbone.Collection.extend({
    model: GroupBy,
    
    initialize: function() {
      singleActiveItem(this);
    },
    
    // Get the currently active groupby
    active: function() {
      return this.findWhere({active: true}).get('name');
    },
    
    activate: function(name) {
      if (name && name.length !== 0) {
        this.findWhere({name: name}).select();
      }
    }
  });

  // Default Grouping Collection
  var defaults = new Grouping([
    new GroupBy({name: 'day'}),
    new GroupBy({name: 'month', active: true}),
    new GroupBy({name: 'year'})
  ]);
  
  return {
    GroupBy: GroupBy,
    Grouping: Grouping,
    defaults: defaults
  };
});