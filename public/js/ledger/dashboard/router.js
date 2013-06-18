/*global define */

define(['backbone', 'marionette', 'vent', 'jquery', 'underscore'], function(Backbone, Marionette, vent, $, _) {
  'use strict';

	// Dashboard Router
	// ---------------
	var Router = Marionette.AppRouter.extend({
		appRoutes: {
		  '': 'showDashboard'
		}		
	});

  return Router;
});