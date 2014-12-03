'use strict';

//Setting up route
angular.module('consumables').config(['$stateProvider',
	function($stateProvider) {
		// Consumables state routing
		$stateProvider.
		state('listConsumables', {
			url: '/consumables',
			templateUrl: 'modules/consumables/views/list-consumables.client.view.html'
		}).
		state('createConsumable', {
			url: '/consumables/create',
			templateUrl: 'modules/consumables/views/create-consumable.client.view.html'
		}).
		state('viewConsumable', {
			url: '/consumables/:consumableId',
			templateUrl: 'modules/consumables/views/view-consumable.client.view.html'
		}).
		state('editConsumable', {
			url: '/consumables/:consumableId/edit',
			templateUrl: 'modules/consumables/views/edit-consumable.client.view.html'
		});
	}
]);