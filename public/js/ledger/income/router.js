/*global define */

define(['backbone', 'marionette', 'vent', 'jquery', 'underscore'], function(Backbone, Marionette, vent, $, _) {
  'use strict';

  // Income Router
	// ---------------
	var Router = Marionette.AppRouter.extend({
		appRoutes: {
		  'income(/:groupBy)': 'showIncome'
		}		
	});

  return Router;
});