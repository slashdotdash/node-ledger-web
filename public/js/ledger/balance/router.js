define(['marionette'], function(Marionette) {
  'use strict';

  var Router = Marionette.AppRouter.extend({
    appRoutes: {
      'balance': 'showBalance',
      'balance/*account': 'showBalanceForAccount'
    }
  });

  return Router;
});