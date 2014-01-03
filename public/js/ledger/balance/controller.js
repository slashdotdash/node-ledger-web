define([
  'ledger',
  './model',
  './chart',
  'controls/model',
  'filteredCollection',
  'backbone',
  'vent',
  'underscore',
  'react'
], function(Ledger, Models, Chart, Controls, FilteredCollection, Backbone, vent, _, React) {
  'use strict';
  
  var Controller = function () {
    this.balance = new Models.Balances();
    this.filteredBalance = new FilteredCollection(this.balance);
  };

  _.extend(Controller.prototype, {
    start: _.once(function () {
      this.balance.fetch({reset: true});
    }),

    showBalance: function() {
      this.showBalanceChartView();
      
      // Initially show top-level accounts (e.g. Assets, Expenses, Income, Liabilities)
      this.filteredBalance.where(function(entry) {
        return entry.filterByDepth(1);
      });
    },

    // filter balance by an account
    showBalanceForAccount: function(account) {
      account = (account || '').split('/').join(':');

      this.filterByAccount(account);
      this.showBalanceChartView();
    },
    
    showBalanceChartView: function() {
      React.renderComponent(
        new Chart({ model: this.filteredBalance, onFilter: this.filterByAccount.bind(this) }),
        document.getElementById('main')
      );
    },

    filterByAccount: function(account) {
      this.filteredBalance.where(function(entry) {
        return entry.filterByParentNameAndDepth(account);
      });

      vent.trigger('balance:filter', { name: account });
    }
  });

  vent.on('balance:filter', function(filter) {
    var name = filter.name,
        url = name.split(':').join('/');

    Backbone.history.navigate('balance/' + url, {trigger: false});
  });

  return Controller;
});