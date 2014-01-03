define(['marionette'], function(Marionette) {
  'use strict';

  var Router = Marionette.AppRouter.extend({
    appRoutes: {
      'worth(/:groupBy)': 'showNetWorth'
    }
  });

  return Router;
});