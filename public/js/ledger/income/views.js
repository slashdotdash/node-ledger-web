/*global Ledger */
'use strict';

Ledger.module('Income.Views', function (Views, App, Backbone, Marionette, $, _) {
  // Layout
  // -----------
  Views.Layout = Backbone.Marionette.Layout.extend({
    template: "#template-income-layout",

    regions: {
      chart: "#chart",
      controls: "#controls"
    }
  });
  
  // Income vs. Expenditure Chart View
  // -----------
  //
  // Display an nvd3 chart of income vs. spending.
  Views.IncomeVsExpenditureChartView = Backbone.Marionette.ItemView.extend({
    template: '#template-income-chart-view',
		
    initialize: function() {
      this.listenTo(this.collection, 'all', this.buildChart, this);
      this.listenTo(App.vent, 'income:groupby', this.groupBy.bind(this));
    },
    
    onRender: function() {
      this.buildChart();
    },

    // Group the chart data by the given date period (day, month, year)
    groupBy: function(groupBy) {
      this.options.groupBy = groupBy.name;
      this.buildChart();
    },

    buildChart: function() {
      if (this.collection.length == 0) { 
        return;
      }
      
      var dateRange = this.collection.getDateRange(),
          sourceData = this.chartData(dateRange),
          dateFormatting = this.dateFormatString(this.options.groupBy);

      nv.addGraph(function() {
        var chart = nv.models.multiBarChart()
          .x(function(d) { return d.date })
          .y(function(d) { return d.total });

        chart.xAxis
          .axisLabel('Date')
          .showMaxMin(true)
          .tickFormat(function(d) { return d3.time.format(dateFormatting)(new Date(d)); });

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
    
    dateFormatString: function(granularity) {
      switch (granularity) {        
        case 'day': return '%d/%m/%Y';
        case 'month': return '%B %Y';
        case 'year': return '%Y';
      }
      
      throw 'Date range granularity "' + granularity + '" is not supported';		  
    },
    
    chartData: function(dateRange) {
      var income = this.collection.filter(function(entry) { return entry.isIncome(); }),
          expenses = this.collection.filter(function(entry) { return entry.isExpense(); });
      
      var incomeByDate = this.totalByDate(dateRange.between(this.options.groupBy), income, 'Income'),
          expensesByDate = this.totalByDate(dateRange.between(this.options.groupBy), expenses, 'Expenses');
            
      return [
        { key: 'Income', values: incomeByDate }, 
        { key: 'Expenses', values: expensesByDate }
      ];
    },
    
    // Total amount for each date in the given range
    totalByDate: function(dateRange, entries, type) {
      return _.map(dateRange, function(date) {
        return {
          date: date,
          total: this.totalByDateAndAccount(entries, date, type)
        };
      }, this);
    },
    
    totalByDateAndAccount: function(entries, date, type) {
      var total = 0;

      _.each(entries, function(entry) {
        if (entry.groupBy(this.options.groupBy) === date.getTime()) {
          total += entry.totalByAccount(type) * -1  // Invert amounts
        }
      }, this);

      return total;
		}
        // 
        // chartData: function() {
        //   if (this.collection.length == 0) { 
        //     return []; 
        //   }
        // 
        //   var income = this.collection.filter(function(entry) { return entry.isIncome(); }),
        //       expenses = this.collection.filter(function(entry) { return entry.isExpense(); });
        // 
        //   income = this.totalByDate(income, 'Income');
        //   expenses = this.totalByDate(expenses, 'Expenses');
        // 
        //   income = this.groupByMonth(income);
        //   expenses = this.groupByMonth(expenses);
        //   
        //   income = this.totalMonthly(income);
        //   expenses = this.totalMonthly(expenses);
        // 
        //   return [
        //     { key: 'Income', values: income }, 
        //     { key: 'Expenses', values: expenses }
        //   ];
        // },
        // 
        // totalByDate: function(entries, type, adjustment) {
        //   return _.map(entries, function(entry) {
        //     return {
        //       date: new Date(entry.get('date')),
        //       total: entry.totalByAccount(type) * -1  // Invert amounts
        //     };
        //   });
        // },
        // 
        // groupByMonth: function(entries) {
        //   return _.groupBy(entries, function(entry) {
        //     return new Date(entry.date.getFullYear(), entry.date.getMonth(), 1);
        //   });
        // },
        // 
        // totalMonthly: function(entries) {
        //   var monthly = [];
        //   
        //   _.each(entries, function(value, key) {
        //     var value = _.reduce(value, function(memo, v) { 
        //       return memo + v.total; 
        //     }, 0);
        //     
        //     monthly.push({
        //       'label': key,
        //       'value': value
        //     });
        //   });
        //   
        //   return monthly;
        // }
  });
  
  
  // Grouping Control Item View
  // -----------
  Views.GroupingControlItemView = Backbone.Marionette.ItemView.extend({
    template: '#template-income-grouping-item',
    tagName: 'li',
    events: {
      'click': 'select'
    },

		initialize: function() {	
		  this.listenTo(this.model, 'all', this.render, this);
		},

		onRender: function() {
      if (this.model.get('active')) {
        $(this.el).addClass('active');
      } else {
        $(this.el).removeClass('active');
      }
    },    
		
		select: function(e) {
		  this.model.select();
		  App.vent.trigger('income:groupby', {name: this.model.get('name')});
		  
		  e.preventDefault();
		  return false;
		}		
  });
  
  // Grouping Control View
  // -----------  
  Views.GroupingControlView = Backbone.Marionette.CompositeView.extend({
    template: '#template-income-grouping-control',
    itemView: Views.GroupingControlItemView,
    itemViewContainer: '#groupby'
  });
});