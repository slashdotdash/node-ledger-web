/** @jsx React.DOM */

define([
  'charting/pie-chart',
  'underscore',
  'react',
  'react.backbone'  
], function(PieChart, _, React, createBackboneClass) {
  'use strict';

  var Filter = createBackboneClass({
    filter: function(evt) {
      evt.preventDefault();
      this.props.onFilter(this.props.model.fullname());
    },

    render: function() {
      return (
        React.DOM.li(null, 
          React.DOM.a( {href:"#", onClick:this.filter}, this.props.model.get('account').get('shortname'))
        )
      );
    }
  });

  var FilterByCategory = createBackboneClass({
    render: function() {
      var onFilter = this.props.onFilter;

      var filters = this.props.model.map(function(balance) {
        return (
          Filter( {model:balance, onFilter:onFilter, key:balance.cid} )
        );
      });

      return (
        React.DOM.ul( {id:"filter", className:"nav nav-list"}, 
          React.DOM.li( {className:"nav-header"}, "Filter by category"),
          filters
        )
      );
    }
  });

  var Chart = createBackboneClass({
    propTypes: {
      onFilter: React.PropTypes.func.isRequired
    },

    chartData: function() {
      var values = this.props.model
        .map(function(entry) {
          return {
            label: entry.get('account').get('shortname'),
            value: Math.abs(entry.get('total').amount)
          };
        });

      return values;
    },

    render: function() {
      return (
        React.DOM.div(null, 
          React.DOM.div( {className:"span2"}, 
            FilterByCategory( {model:this.props.model, onFilter:this.props.onFilter} )
          ),
          React.DOM.div( {className:"span10"}, 
            React.DOM.div( {id:"chart"}, 
              PieChart( {height:"700px", width:"970px", data:this.chartData()} )
            )
          )
        )
      );
    }
  });

  return Chart;
});