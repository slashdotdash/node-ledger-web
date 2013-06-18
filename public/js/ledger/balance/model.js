/*global define */

define(['groupByDate', 'dateRange', 'backbone', 'marionette', 'jquery', 'underscore'], 
  function(groupByDate, DateRange, Backbone, Marionette, $, _) {
  'use strict';
  
	// Balance Model
	// ----------
	var Balance = Backbone.Model.extend({
		defaults: {
		  total: {
        currency: '',
        amount: 0,
        formatted: ''
      },
			account: {
        fullname: '',
        shortname: ''
			}
		},

		initialize: function () {
		},

    fullname: function() {
      return this.get('account').fullname;
    },

		filterByDepth: function(depth) {
      return this.get('account').depth === depth;
    },
    
    filterByParentName: function(name) {
      return this.fullname().indexOf(name + ':') === 0;
    },
    
    filterByParentNameAndDepth: function(name) {
      if (name.length == 0) {
        return this.filterByDepth(1);
      }

      var depth = name.split(':').length + 1;
      
      return this.filterByDepth(depth) && this.filterByParentName(name);
    }
    
	});

	// Balance Collection
	// ---------------
	var Balances = Backbone.Collection.extend({
		model: Balance,
		url: '/api/balance'
	});
	
	return {
	  Balance: Balance,
	  Balances: Balances
	}
});