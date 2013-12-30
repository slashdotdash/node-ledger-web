require.config({
  paths : {
    tpl: '../vendor/tpl',
    backbone : '../vendor/backbone',
    underscore : '../vendor/underscore',
    jquery : '../vendor/jquery',
    marionette : '../vendor/backbone.marionette',
    d3 : '../vendor/d3.v2',
    nvd3: '../vendor/nv.d3'
  },
  shim : {
    jquery : {
      exports : 'jQuery'
    },
    underscore : {
      exports : '_'
    },
    backbone : {
      deps : ['jquery', 'underscore'],
      exports : 'Backbone'
    },
    marionette : {
      deps : ['jquery', 'underscore', 'backbone'],
      exports : 'Marionette'
    },
    d3 : {
      exports: 'd3'
    },
    nvd3 : {
      deps : ['d3'],
      exports: 'nv'
    }
  }
});

require([
  'ledger',
  'dashboard/module',
  'income/module',
  'spending/module',
  'worth/module',
  'balance/module'
], function(Ledger) {
  'use strict';
  
  Ledger.start();
});