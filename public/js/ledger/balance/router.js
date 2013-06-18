/*global define */

define(['backbone', 'marionette', 'vent', 'jquery', 'underscore'], function(Backbone, Marionette, vent, $, _) {
  'use strict';

	// Balance Router
	// ---------------
	var Router = Marionette.AppRouter.extend({
		appRoutes: {
		  'balance': 'showBalance',
		  'balance/*account': 'filterByAccount'
		}		
	});

  return Router;
});