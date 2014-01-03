define(['marionette'], function(Marionette) {
  'use strict';

  var Router = Marionette.AppRouter.extend({
    appRoutes: {
      '': 'showDashboard'
    }
  });

  return Router;
});