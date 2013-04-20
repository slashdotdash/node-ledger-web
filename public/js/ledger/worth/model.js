/*global Ledger */
Ledger.module('Worth', function (Worth, App, Backbone, Marionette, $, _) {
  'use strict';
  
	// Assets + Liabilities Entry Model
	// ----------
	Worth.Entry = Backbone.Model.extend({
		defaults: {
		  date: null,
		  payee: '',
			postings: []
		},

		initialize: function () {	},
		
		isAsset: function() {
		  return _.any(this.get('postings'), function(posting) {
		    return posting.account.indexOf('Assets:') === 0;
		  });
		},
		
		isLiability: function() {
		  return _.any(this.get('postings'), function(posting) {
		    return posting.account.indexOf('Liabilities:') === 0;
		  });
		},
		
		totalByAccount: function(account) {
      return _.reduce(this.get('postings'), function(memo, posting) {
		    return (account.length === 0 || posting.account.indexOf(account + ':') === 0) ? memo + posting.commodity.amount : memo;
		  }, 0);
		},
		
		totalAmount: function() {
		  return this.totalByAccount('');
		}
	});

	// Assets Collection
	// ---------------
	Worth.Assets = Backbone.Collection.extend({
		model: Worth.Entry,
		url: '/api/register/Assets'
	});
	
	// Liabilities Collection
	// ---------------
	Worth.Liabilities = Backbone.Collection.extend({
		model: Worth.Entry,
		url: '/api/register/Liabilities'
	});

	// Aggregated Assets + Liabilities Collection
	// ---------------	
	Worth.Aggregated = Backbone.Collection.extend({
    model: Worth.Entry,
        
    getDateRange: function() {
      var minDate = _.min(this.map(function(entry) { return new Date(entry.get('date')); })),
          maxDate = _.max(this.map(function(entry) { return new Date(entry.get('date')); }));

      return this.dateRange(minDate, maxDate);
    },
    
    // Returns an array of dates between from and to.
    dateRange: function(from, to) {
      var current = from,
          range = [];
      
      while (current < to) {
        range.push(current);
        
        current = new Date(current);
        current.setDate(current.getDate() + 1);
      }
      
      return range;
    }    
  });
});