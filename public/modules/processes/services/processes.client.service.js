'use strict';

//Processes service used to communicate Processes REST endpoints
angular.module('processes').factory('Processes', ['$resource',
	function($resource) {
		return $resource('processes/:processId', { processId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);