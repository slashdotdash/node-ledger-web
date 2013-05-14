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
		
		initialize: function() {
		  _.extend(this, groupByDate(new Date(this.get('date'))));
		},

    totalAmount: function() {
      return this.totalByAccount('Expenses');
    },

		totalByAccount: function(account) {
      return _.reduce(this.get('postings'), function(memo, posting) {
		    return (posting.account.indexOf(account) === 0) ? memo + Math.max(posting.commodity.amount, 0) : memo;
		  }, 0);
		},
		
		getAccounts: function() {
		  return _.map(this.get('postings'), function(posting) {
		    return posting.account;
		  });
		},
		
		hasAccount: function(account) {
		  return _.any(this.get('postings'), function(posting) {
		    return posting.account === account;
		  });
		}
	});

	// Expenses Collection
	// ---------------
	Spending.Expenses = Backbone.Collection.extend({
		model: Spending.Entry,
		url: '/api/register/Expenses',
		
		getDateRange: function() {
      var from = _.min(this.map(function(entry) { return entry.getDate(); })),
          to = _.max(this.map(function(entry) { return entry.getDate(); }));

      return new DateRange(from, to);
    },
    
    getAccounts: function() {
      var accounts = this.map(function(entry) {
        return entry.getAccounts();
      });
      
      return _.uniq(_.flatten(accounts));
    },
    
    getByAccount: function(account) {
      return this.select(function(entry) {
        return entry.hasAccount(account);
      });
    }
	});

  // GroupBy Model
	// ----------
	Spending.GroupBy = Backbone.Model.extend({
	  defaults: {
	    name: '',
	    active: false
	  },
	  
	  select: function() {
      this.set('active', true);
	  }
	});
	
	// Grouping Collection
	// ---------------
	Spending.Grouping = Backbone.Collection.extend({
		model: Spending.GroupBy,
		
		initialize: function() {
		  singleActiveItemBehaviour(this);
		}
	});
});