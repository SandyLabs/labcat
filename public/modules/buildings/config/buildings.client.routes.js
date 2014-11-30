'use strict';

//Setting up route
angular.module('buildings').config(['$stateProvider',
	function($stateProvider) {
		// Buildings state routing
		$stateProvider.
		state('listBuildings', {
			url: '/buildings',
			templateUrl: 'modules/buildings/views/list-buildings.client.view.html'
		}).
		state('createBuilding', {
			url: '/buildings/create',
			templateUrl: 'modules/buildings/views/create-building.client.view.html'
		}).
		state('viewBuilding', {
			url: '/buildings/:buildingId',
			templateUrl: 'modules/buildings/views/view-building.client.view.html'
		}).
		state('editBuilding', {
			url: '/buildings/:buildingId/edit',
			templateUrl: 'modules/buildings/views/edit-building.client.view.html'
		});
	}
]);