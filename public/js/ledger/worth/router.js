/*global define */

define(['backbone', 'marionette', 'vent', 'jquery', 'underscore'], function(Backbone, Marionette, vent, $, _) {
  'use strict';

  // Worth Router
  // ---------------
  var Router = Marionette.AppRouter.extend({
  	appRoutes: {
  	  'worth(/:groupBy)': 'showNetWorth'
  	}		
  });

  return Router;
});