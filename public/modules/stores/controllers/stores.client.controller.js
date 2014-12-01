'use strict';

// Stores controller
angular.module('stores').controller('StoresController', ['$scope', '$stateParams', '$location', 'Authentication', 'Stores',
	function($scope, $stateParams, $location, Authentication, Stores) {
		$scope.authentication = Authentication;

		// Create new Store
		$scope.create = function() {
			// Create new Store object
			var store = new Stores ({
				name: this.name
			});

			// Redirect after save
			store.$save(function(response) {
				$location.path('stores/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Store
		$scope.remove = function(store) {
			if ( store ) { 
				store.$remove();

				for (var i in $scope.stores) {
					if ($scope.stores [i] === store) {
						$scope.stores.splice(i, 1);
					}
				}
			} else {
				$scope.store.$remove(function() {
					$location.path('stores');
				});
			}
		};

		// Update existing Store
		$scope.update = function() {
			var store = $scope.store;

			store.$update(function() {
				$location.path('stores/' + store._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Stores
		$scope.find = function() {
			$scope.stores = Stores.query();
		};

		// Find existing Store
		$scope.findOne = function() {
			$scope.store = Stores.get({ 
				storeId: $stateParams.storeId
			});
		};
	}
]);