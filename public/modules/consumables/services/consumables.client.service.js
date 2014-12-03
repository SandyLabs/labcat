'use strict';

//Consumables service used to communicate Consumables REST endpoints
angular.module('consumables').factory('Consumables', ['$resource',
	function($resource) {
		return $resource('consumables/:consumableId', { consumableId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);