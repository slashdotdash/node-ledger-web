define([
  'groupByDate',
  'dateRange',
  'backbone'
], function(groupByDate, DateRange, Backbone) {
  'use strict';
  
  var Account = Backbone.Model.extend({
    defaults: {
      fullname: '',
      shortname: ''
    }
  });

  var Balance = Backbone.Model.extend({
    defaults: {
      total: {
        currency: '',
        amount: 0,
        formatted: ''
      },
      account: new Account()
    },

    parse: function(response, options) {
      var attrs = Backbone.Model.prototype.parse(response, options);
      attrs.account = new Account(response.account, options);
      return attrs;
    },

    fullname: function() {
      return this.get('account').get('fullname');
    },

    filterByDepth: function(depth) {
      return this.get('account').get('depth') === depth;
    },
    
    filterByParentName: function(name) {
      return this.fullname().indexOf(name + ':') === 0;
    },
    
    filterByParentNameAndDepth: function(name) {
      if (name.length === 0) {
        return this.filterByDepth(1);
      }

      var depth = name.split(':').length + 1;
      
      return this.filterByDepth(depth) && this.filterByParentName(name);
    }
  });

  var Balances = Backbone.Collection.extend({
    model: Balance,
    url: '/api/balance'
  });
  
  return {
    Account: Account,
    Balance: Balance,
    Balances: Balances
  };
});