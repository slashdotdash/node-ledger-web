/**
 * @jsx React.DOM
 */

define([
  'underscore',
  'react'
], function(_, React) {
  'use strict';

  var Dashboard = React.createClass({displayName: 'Dashboard',
    render: function() {
      return (
        React.DOM.div( {className:"jumbotron"}, 
          React.DOM.h1(null, "Ledger Web"),
          React.DOM.p( {className:"lead"}, "Your financial dashboard."),
          
          React.DOM.hr(null ),
          React.DOM.div( {className:"row-fluid"}, 
            React.DOM.div( {className:"span3"}, 
              React.DOM.h2(null, "Income"),
              React.DOM.p(null, "Compared to expenditure"),
              React.DOM.p(null, "Over time"),
              React.DOM.p(null, "By Category")        
            ),
            
            React.DOM.div( {className:"span3"}, 
              React.DOM.h2(null, "Spending"),
              React.DOM.p(null, "Over time"),
              React.DOM.p(null, "By Category")
            ),
            
            React.DOM.div( {className:"span3"}, 
              React.DOM.h2(null, "Net Worth")
            ),
            
            React.DOM.div( {className:"span3"}, 
              React.DOM.h2(null, "Balance"),
              React.DOM.p(null, "By account")
            )
          )
        )
      );
    }
  });

  return Dashboard;
});