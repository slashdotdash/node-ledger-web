/*global Ledger */
'use strict';

Ledger.module('Balance.Views', function (Views, App, Backbone, Marionette, $) {
	// Ledger Balance Item View
	// -------------------
	//
	// Display an individual balance item.
	Views.ItemView = Marionette.ItemView.extend({
		tagName: 'tr',
		template: '#template-balance-item-view',

		ui: {
		},

		events: {
		},

		initialize: function () {
			this.listenTo(this.model, 'change', this.render, this);
		},

		onRender: function () {
		},

		destroy: function () {
			this.model.destroy();
		}
	});

	// Item List View
	// --------------
	//
	// Controls the rendering of the list of items.
	Views.ListView = Backbone.Marionette.CompositeView.extend({
		template: '#template-balance-list-view',
		itemView: Views.ItemView,
		itemViewContainer: '#balance-list',

		ui: {
		},

		events: {
		},

		initialize: function () {
			this.listenTo(this.collection, 'all', this.update, this);
		},

		onRender: function () {
		}
	});

	// Application Event Handlers
	// --------------------------
	//
	// Handler for filtering the list of items by showing and
	// hiding through the use of various CSS classes
	App.vent.on('todoList:filter', function (filter) {
		filter = filter || 'all';
		$('#todoapp').attr('class', 'filter-' + filter);
	});
});
