/**
 * @jsx React.DOM
 */

define([
  'underscore',
  'react'
], function(_, React) {
  'use strict';

  var Dashboard = React.createClass({
    render: function() {
      return (
        <div className="jumbotron">
          <h1>Ledger Web</h1>
          <p className="lead">Your financial dashboard.</p>
          
          <hr />
          <div className="row-fluid">
            <div className="span3">
              <h2>Income</h2>
              <p>Compared to expenditure</p>
              <p>Over time</p>
              <p>By Category</p>        
            </div>
            
            <div className="span3">
              <h2>Spending</h2>
              <p>Over time</p>
              <p>By Category</p>
            </div>
            
            <div className="span3">
              <h2>Net Worth</h2>
            </div>
            
            <div className="span3">
              <h2>Balance</h2>
              <p>By account</p>
            </div>
          </div>
        </div>
      );
    }
  });

  return Dashboard;
});