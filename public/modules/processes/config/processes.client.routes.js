'use strict';

//Setting up route
angular.module('processes').config(['$stateProvider',
	function($stateProvider) {
		// Processes state routing
		$stateProvider.
		state('listProcesses', {
			url: '/processes',
			templateUrl: 'modules/processes/views/list-processes.client.view.html'
		}).
		state('createProcess', {
			url: '/processes/create',
			templateUrl: 'modules/processes/views/create-process.client.view.html'
		}).
		state('viewProcess', {
			url: '/processes/:processId',
			templateUrl: 'modules/processes/views/view-process.client.view.html'
		}).
		state('editProcess', {
			url: '/processes/:processId/edit',
			templateUrl: 'modules/processes/views/edit-process.client.view.html'
		});
	}
]);