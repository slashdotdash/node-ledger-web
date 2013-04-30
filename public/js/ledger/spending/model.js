/*global Ledger */
Ledger.module('Spending', function (Spending, App, Backbone, Marionette, $, _) {
  'use strict';
  
	// Expenses Model
	// ----------
	Spending.Entry = Backbone.Model.extend({
		defaults: {
		  date: null,
		  payee: '',
			postings: []
		},

		initialize: function () {	},

		totalByAccount: function(account) {
      return _.reduce(this.get('postings'), function(memo, posting) {
		    return (posting.account.indexOf(account) === 0) ? memo + Math.max(posting.commodity.amount, 0) : memo;
		  }, 0);
		}
	});

	// Expenses Collection
	// ---------------
	Spending.Expenses = Backbone.Collection.extend({
		model: Spending.Entry,
		url: '/api/register/Expenses',
		
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