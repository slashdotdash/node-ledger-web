/*global Ledger */
Ledger.module('Income', function (Income, App, Backbone, Marionette, $, _) {
  'use strict';
  
	// Income + Expenses Entry Model
	// ----------
	Income.Entry = Backbone.Model.extend({
		defaults: {
		  date: null,
		  payee: '',
			postings: []
		},

		initialize: function () {	},
		
		isIncome: function() {
		  return _.any(this.get('postings'), function(posting) {
		    return posting.account.indexOf('Income:') === 0;
		  });
		},
		
		isExpense: function() {
		  return _.any(this.get('postings'), function(posting) {
		    return posting.account.indexOf('Expenses:') === 0;
		  });		  
		},
		
		totalByAccount: function(account) {
      return _.reduce(this.get('postings'), function(memo, posting) {
		    return (posting.account.indexOf(account) === 0) ? memo + posting.commodity.amount : memo;
		  }, 0);
		}
	});

	// Income Collection
	// ---------------
	Income.Income = Backbone.Collection.extend({
		model: Income.Entry,
		url: '/api/register/Income'
	});
	
	// Expenses Collection
	// ---------------
	Income.Expenses = Backbone.Collection.extend({
		model: Income.Entry,
		url: '/api/register/Expenses'
	});

	// Aggregated Income + Expenses Collection
	// ---------------	
	Income.Aggregated = Backbone.Collection.extend({
    model: Income.Entry
  });
});