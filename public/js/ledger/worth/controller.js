define([
  './model',
  './net-worth-chart',
  'controls/model',
  'controls/charting',
  'aggregateCollection',
  'vent',
  'jquery',
  'underscore',
  'react'
], function(Models, NetWorthChart, Controls, Charting, AggregateCollection, vent, $, _, React) {
  'use strict';
  
  var Controller = function () {
    this.controls = {
      grouping: Controls.defaults
    };
    
    this.assets = new Models.Assets();
    this.liabilities = new Models.Liabilities();

    // Net worth is the combined total of Assets and Liabilities.
    this.netWorth = new AggregateCollection(Models.Aggregated, [this.assets, this.liabilities]);
  };

  _.extend(Controller.prototype, {
    start: _.once(function () {
      var self = this;

      $.when(
        this.assets.fetch({reset: true}),
        this.liabilities.fetch({reset: true})
      ).done(function() {
        // show net worth chart after both assets and liabilities have been fetched
        self.showNetWorth();
      });
    }),

    showNetWorth: function(groupBy) {
      groupBy = groupBy || this.controls.grouping.active();

      this.controls.grouping.activate(groupBy);

      if (this.netWorth.length === 0) { return; }

      var chart = new NetWorthChart({ model: this.netWorth, groupBy: groupBy });

      var onGroupBy = function(groupBy) {
        var name = groupBy.get('name');

        chart.setProps({ groupBy: name });

        vent.trigger('controls:groupby', { name: name });
      };

      React.renderComponent(
        new Charting({ grouping: this.controls.grouping, onGroupBy: onGroupBy }, chart),
        document.getElementById('main')
      );
    }
  });

  return Controller;
});