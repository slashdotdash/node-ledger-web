/*global Ledger */
'use strict';

Ledger.module('Income.Views', function (Views, App, Backbone, Marionette, $, _) {
  Views.FilterChartItemView = Marionette.ItemView.extend({
    template: '#template-income-chart-filter-item-view',
    events: {
      'click': 'filter'
    },
    
    filter: function() {
      App.vent.trigger('income:filter', {name: this.model.fullname()});
    }
  });

  // Income vs. Expenditure Chart View
  // -----------
  //
  // Display an nvd3 chart of income vs. spending.
  Views.IncomeVsExpenditureChartView = Backbone.Marionette.CompositeView.extend({
    template: '#template-income-chart-view',
    itemView: Views.FilterChartItemView,
    itemViewContainer: '#filter',
		
    initialize: function() {
      this.listenTo(this.collection, 'all', this.buildChart, this);
    },
    
    onRender: function() {
      this.buildChart();
    },
        
    buildChart: function() {
      var sourceData = this.chartData();
      if (sourceData.length === 0) return;
     console.log('sourceData:');
     console.log(sourceData);
     
      nv.addGraph(function() {
        var chart = nv.models.multiBarChart()
          .x(function(d) { return d.label })
          .y(function(d) { return d.value });

        chart.xAxis
          .axisLabel('Date')
          .showMaxMin(true)
          .tickFormat(function(d) { return d3.time.format('%B %Y')(new Date(d)); });

        chart.yAxis
          .axisLabel('Amount')
          .tickFormat(d3.format(',.1f'));

        d3.select("#chart svg")
          .datum(sourceData)
          .transition().duration(1200)
          .call(chart);

        return chart;
      });
    },
    
    chartData: function() {
      if (this.collection.length == 0) { 
        return []; 
      }
      console.log('x');
      var income = this.collection.filter(function(entry) { return entry.isIncome(); }),
          expenses = this.collection.filter(function(entry) { return entry.isExpense(); });
          
      income = this.totalByDate(income, 'Income');
      expenses = this.totalByDate(expenses, 'Expenses');

      income = this.groupByMonth(income);
      expenses = this.groupByMonth(expenses);
      
      income = this.totalMonthly(income);
      expenses = this.totalMonthly(expenses);

      return [
        { key: 'Income', values: income }, 
        { key: 'Expenses', values: expenses }
      ];
    },
    
    totalByDate: function(entries, type, adjustment) {
      return _.map(entries, function(entry) {
        return {
          date: new Date(entry.get('date')),
          total: entry.totalByAccount(type) * -1  // Inverse amounts
        };
      });
    },
    
    groupByMonth: function(entries) {
      return _.groupBy(entries, function(entry) {
        return new Date(entry.date.getFullYear(), entry.date.getMonth(), 1);
      });
    },
    
    totalMonthly: function(entries) {
      var monthly = [];
      
      _.each(entries, function(value, key) {
        var value = _.reduce(value, function(memo, v) { 
          return memo + v.total; 
        }, 0);
        
        monthly.push({
          'label': key,
          'value': value
        });
      });
      
      return monthly;
    }
  });
});