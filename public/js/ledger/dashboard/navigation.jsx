/** @jsx React.DOM */

define([
  'underscore',
  'react',
  'react.backbone'
], function(_, React, createBackboneClass) {
  'use strict';

  var Item = createBackboneClass({
    select: function(evt) {
      evt.preventDefault();
      this.props.model.select();
    },

    render: function() {
      return (
        <li className={this.props.model.get('active') ? 'active' : ''}>
          <a href={this.props.model.get('url')} onClick={this.select}>{this.props.model.get('title')}</a>
        </li>
      );
    }
  });

  var Navigation = createBackboneClass({
    render: function() {
      var itemNodes = this.props.model.map(function(section) {
        return (
          <Item model={section} key={section.get('url')} />
        );
      });

      return (
        <div className="navbar-inner">
          <a className="brand" href="/">Ledger</a>
          <ul className="nav">
            {itemNodes}
          </ul>
        </div>
      );
    }
  });

  return Navigation;
});