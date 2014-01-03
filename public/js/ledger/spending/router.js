define(['marionette'], function(Marionette) {
  'use strict';

  var Router = Marionette.AppRouter.extend({
    appRoutes: {
      'spending(/:groupBy)': 'showSpending'
    }
  });
  
  return Router;
});