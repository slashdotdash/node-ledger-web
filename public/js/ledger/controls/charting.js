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
        React.DOM.li( {className:this.props.model.get('active') ? 'active' : ''}, 
          React.DOM.a( {href:"#", onClick:this.onGroupBy}, this.props.model.get('name'))
        )
      );
    }
  });

  var Grouping = createBackboneClass({
    render: function() {
      var onGroupBy = this.props.onGroupBy;

      var groupings = this.props.model.map(function(groupBy) {
        return (
          GroupBy( {model:groupBy, onGroupBy:onGroupBy, key:groupBy.get('name')} )
        );
      });

      return (
        React.DOM.ul( {id:"groupby", className:"nav nav-list"}, 
          React.DOM.li( {className:"nav-header"}, "Group by"),
          groupings
        )
      );
    }
  });

  var Charting = createBackboneClass({
    render: function() {
      return (
        React.DOM.section(null, 
          React.DOM.nav( {id:"controls", className:"span2"}, 
            Grouping( {model:this.props.grouping, onGroupBy:this.props.onGroupBy} )
          ),
          React.DOM.article( {id:"chart", className:"span10"}, 
            this.props.children
          )
        )
      );
    }
  });

  return Charting;
});