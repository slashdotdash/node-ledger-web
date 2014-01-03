require.config({
  paths : {
    backbone : '../vendor/backbone',
    d3 : '../vendor/d3',
    jquery : '../vendor/jquery',
    marionette : '../vendor/backbone.marionette',
    nvd3: '../vendor/nv.d3',
    react: '../vendor/react',
    tpl: '../vendor/tpl',
    underscore : '../vendor/underscore'
  },
  shim : {
    backbone : {
      deps : ['jquery', 'underscore'],
      exports : 'Backbone'
    },
    d3 : {
      exports: 'd3'
    },
    jquery : {
      exports : 'jquery'
    },
    marionette : {
      deps : ['jquery', 'underscore', 'backbone'],
      exports : 'Marionette'
    },
    nvd3 : {
      deps : ['d3'],
      exports: 'nv'
    },
    underscore : {
      exports : '_'
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