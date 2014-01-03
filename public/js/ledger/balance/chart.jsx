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
        <li>
          <a href="#" onClick={this.filter}>{this.props.model.get('account').get('shortname')}</a>
        </li>
      );
    }
  });

  var FilterByCategory = createBackboneClass({
    render: function() {
      var onFilter = this.props.onFilter;

      var filters = this.props.model.map(function(balance) {
        return (
          <Filter model={balance} onFilter={onFilter} key={balance.cid} />
        );
      });

      return (
        <ul id="filter" className="nav nav-list">
          <li className="nav-header">Filter by category</li>
          {filters}
        </ul>
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
        <div>
          <div className="span2">
            <FilterByCategory model={this.props.model} onFilter={this.props.onFilter} />
          </div>
          <div className="span10">
            <div id="chart">
              <PieChart height="700px" width="970px" data={this.chartData()} />
            </div>
          </div>
        </div>
      );
    }
  });

  return Chart;
});