define(['marionette'], function(Marionette) {
  'use strict';

  var Router = Marionette.AppRouter.extend({
    appRoutes: {
      'income(/:groupBy)': 'showIncome'
    }
  });

  return Router;
});