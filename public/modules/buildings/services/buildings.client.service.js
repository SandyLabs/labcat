'use strict';

//Buildings service used to communicate Buildings REST endpoints
angular.module('buildings').factory('Buildings', ['$resource',
	function($resource) {
		return $resource('buildings/:buildingId', { buildingId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);