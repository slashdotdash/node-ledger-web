/**
 * @jsx React.DOM
 */

define([
  'underscore',
  'react',
  'react.backbone'  
], function(_, React, createBackboneClass) {
  'use strict';

  var GroupBy = createBackboneClass({
    onGroupBy: function(evt) {
      evt.preventDefault();
      this.props.model.select();
      this.props.onGroupBy(this.props.model);
    },

    render: function() {
      return (
        <li className={this.props.model.get('active') ? 'active' : ''}>
          <a href="#" onClick={this.onGroupBy}>{this.props.model.get('name')}</a>
        </li>
      );
    }
  });

  var Grouping = createBackboneClass({
    render: function() {
      var onGroupBy = this.props.onGroupBy;

      var groupings = this.props.model.map(function(groupBy) {
        return (
          <GroupBy model={groupBy} onGroupBy={onGroupBy} key={groupBy.get('name')} />
        );
      });

      return (
        <ul id="groupby" className="nav nav-list">
          <li className="nav-header">Group by</li>
          {groupings}
        </ul>
      );
    }
  });

  var Charting = createBackboneClass({
    render: function() {
      return (
        <section>
          <nav id="controls" className="span2">
            <Grouping model={this.props.grouping} onGroupBy={this.props.onGroupBy} />
          </nav>
          <article id="chart" className="span10">
            {this.props.children}
          </article>
        </section>
      );
    }
  });

  return Charting;
});