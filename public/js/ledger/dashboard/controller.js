define([
  'ledger',
  './model',
  './navigation',
  './dashboard',
  'backbone', 'marionette', 'vent', 'jquery', 'underscore', 'react'
], function(Ledger, Models, Navigation, Dashboard, Backbone, Marionette, vent, $, _, React) {
  'use strict';

  var Controller = function () {
    this.sections = new Models.Sections([
      new Models.Section({title: 'Home', name: 'dashboard', url: '/', active: true}),
      new Models.Section({title: 'Income', name: 'income', url: 'income'}),
      new Models.Section({title: 'Spending', name: 'spending', url: 'spending'}),
      new Models.Section({title: 'Worth', name: 'worth', url: 'worth'}),
      new Models.Section({title: 'Balance', name: 'balance', url: 'balance'})
    ]);

    this.sections.on('change:active', this.showSection, this);

    // Select the activated section on navigation
    vent.on('section:activated', function(params) {
      this.sections.activate(params.name);
    }, this);
  };

  _.extend(Controller.prototype, {
    start: _.once(function() {
      React.renderComponent(
        new Navigation({ model: this.sections }),
        document.getElementById('nav')
      );
    }),
    
    showDashboard: function () {
      React.renderComponent(
        new Dashboard(),
        document.getElementById('main')
      );
    },
    
    showSection: function(section, value) {
      if (value === true) {
        var url = section.get('url');
        
        // Don't navigate if we are already in this section
        if (window.location.pathname.indexOf('/' + url) === 0) {
          return;
        }
        
        Backbone.history.navigate(url, {trigger: true});
      }
    }
  });
  
  return Controller;
});