/*global Ledger */
Ledger.module('Balance', function (Balance, App, Backbone) {
  'use strict';
  
	// Balance Model
	// ----------
	Balance.Model = Backbone.Model.extend({
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
      if (name.length == 0) {
        return this.filterByDepth(1);
      }
      
      return this.fullname().indexOf(name + ':') === 0;
    }
	});

	// Balance Collection
	// ---------------
	Balance.ModelList = Backbone.Collection.extend({
		model: Balance.Model,
		url: '/api/balance'
	});
});