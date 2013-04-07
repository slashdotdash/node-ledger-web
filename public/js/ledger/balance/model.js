/*global Ledger */
'use strict';

Ledger.module('Balance', function (Balance, App, Backbone) {
	// Balance Model
	// ----------
	Balance.Model = Backbone.Model.extend({
		defaults: {
			account: {
        fullname: ''
			}
		},

		initialize: function () {
		}
	});

	// Balance Collection
	// ---------------
	Balance.ModelList = Backbone.Collection.extend({
		model: Balance.Model,
		url: '/api/balance'
	});
});
