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

		initialize: function () {
		},

    totalAmount: function() {
      return this.totalByAccount('Expenses');
    },

		totalByAccount: function(account) {
      return _.reduce(this.get('postings'), function(memo, posting) {
		    return (posting.account.indexOf(account) === 0) ? memo + Math.max(posting.commodity.amount, 0) : memo;
		  }, 0);
		},
		
		groupBy: function(granularity) {
		  switch (granularity) {
        case 'month': return this.getMonth().getTime();
        case 'day': return this.getDate().getTime();
      }
      
      throw 'Date range granularity "' + granularity + '" is not supported';
    },
    
    getDate: function() {
      return new Date(this.get('date'));
    },
    
    getMonth: function() {
      var date = new Date(this.get('date'));
      return new Date(date.getFullYear(), date.getMonth(), 1);
    }
	});

	// Expenses Collection
	// ---------------
	Spending.Expenses = Backbone.Collection.extend({
		model: Spending.Entry,
		url: '/api/register/Expenses',
		
		getDateRange: function() {
      var from = _.min(this.map(function(entry) { return new Date(entry.get('date')); })),
          to = _.max(this.map(function(entry) { return new Date(entry.get('date')); }));

      return new DateRange(from, to);
    }
	});
});