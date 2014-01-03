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
        React.DOM.li( {className:this.props.model.get('active') ? 'active' : ''}, 
          React.DOM.a( {href:this.props.model.get('url'), onClick:this.select}, this.props.model.get('title'))
        )
      );
    }
  });

  var Navigation = createBackboneClass({
    render: function() {
      var itemNodes = this.props.model.map(function(section) {
        return (
          Item( {model:section, key:section.get('url')} )
        );
      });

      return (
        React.DOM.div( {className:"navbar-inner"}, 
          React.DOM.a( {className:"brand", href:"/"}, "Ledger"),
          React.DOM.ul( {className:"nav"}, 
            itemNodes
          )
        )
      );
    }
  });

  return Navigation;
});