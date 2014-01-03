define([
  'groupByDate', 'dateRange', 'backbone', 'marionette', 'jquery', 'underscore'
], function(groupByDate, DateRange, Backbone, Marionette, $, _) {
  'use strict';

  // Income + Expenses Entry Model
  // ----------
  var Entry = Backbone.Model.extend({
    defaults: {
      date: null,
      payee: '',
      postings: []
    },

    initialize: function () {
      _.extend(this, groupByDate(new Date(this.get('date'))));
    },
    
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
  var Income = Backbone.Collection.extend({
    model: Entry,
    url: '/api/register/Income'
  });
  
  // Expenses Collection
  // ---------------
  var Expenses = Backbone.Collection.extend({
    model: Entry,
    url: '/api/register/Expenses'
  });

  // Aggregated Income + Expenses Collection
  // ---------------  
  var Aggregated = Backbone.Collection.extend({
    model: Entry,
    
    getDateRange: function() {
      var from = _.min(this.map(function(entry) { return entry.getDate(); })),
          to = _.max(this.map(function(entry) { return entry.getDate(); }));

      return new DateRange(from, to);
    }
  });
  
  return {
    Entry: Entry,
    Income: Income,
    Expenses: Expenses,
    Aggregated: Aggregated
  };
});