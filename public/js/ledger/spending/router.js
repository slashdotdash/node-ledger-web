/*global define */

define(['backbone', 'marionette', 'vent', 'jquery', 'underscore'], function(Backbone, Marionette, vent, $, _) {
  'use strict';

  // Spending Router
  // ---------------
  var Router = Marionette.AppRouter.extend({
  	appRoutes: {
  	  'spending(/:groupBy)': 'showSpending'
  	}
  });
  
  return Router;
});