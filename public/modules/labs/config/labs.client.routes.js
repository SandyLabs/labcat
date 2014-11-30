'use strict';

//Setting up route
angular.module('labs').config(['$stateProvider',
	function($stateProvider) {
		// Labs state routing
		$stateProvider.
		state('listLabs', {
			url: '/labs',
			templateUrl: 'modules/labs/views/list-labs.client.view.html'
		}).
		state('createLab', {
			url: '/labs/create',
			templateUrl: 'modules/labs/views/create-lab.client.view.html'
		}).
		state('viewLab', {
			url: '/labs/:labId',
			templateUrl: 'modules/labs/views/view-lab.client.view.html'
		}).
		state('editLab', {
			url: '/labs/:labId/edit',
			templateUrl: 'modules/labs/views/edit-lab.client.view.html'
		});
	}
]);