'use strict';

//Equipment service used to communicate Equipment REST endpoints
angular.module('equipment').factory('Equipment', ['$resource',
	function($resource) {
		return $resource('equipment/:equipmentId', { equipmentId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);