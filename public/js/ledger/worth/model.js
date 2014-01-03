define([
  'groupByDate',
  'dateRange',
  'backbone',
  'underscore'
], function(groupByDate, DateRange, Backbone, _) {
  'use strict';
  
  // Assets + Liabilities Entry Model
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
  var Assets = Backbone.Collection.extend({
    model: Entry,
    url: '/api/register/Assets'
  });
  
  // Liabilities Collection
  // ---------------
  var Liabilities = Backbone.Collection.extend({
    model: Entry,
    url: '/api/register/Liabilities'
  });

  // Aggregated Assets + Liabilities Collection
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
    Assets: Assets,
    Liabilities: Liabilities,
    Aggregated: Aggregated
  };
});