'use strict';

//Setting up route
angular.module('equipment').config(['$stateProvider',
	function($stateProvider) {
		// Equipment state routing
		$stateProvider.
		state('listEquipment', {
			url: '/equipment',
			templateUrl: 'modules/equipment/views/list-equipment.client.view.html'
		}).
		state('createEquipment', {
			url: '/equipment/create',
			templateUrl: 'modules/equipment/views/create-equipment.client.view.html'
		}).
		state('viewEquipment', {
			url: '/equipment/:equipmentId',
			templateUrl: 'modules/equipment/views/view-equipment.client.view.html'
		}).
		state('editEquipment', {
			url: '/equipment/:equipmentId/edit',
			templateUrl: 'modules/equipment/views/edit-equipment.client.view.html'
		});
	}
]);