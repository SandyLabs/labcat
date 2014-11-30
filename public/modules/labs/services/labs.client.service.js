'use strict';

//Labs service used to communicate Labs REST endpoints
angular.module('labs').factory('Labs', ['$resource',
	function($resource) {
		return $resource('labs/:labId', { labId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);