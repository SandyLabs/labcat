'use strict';

// Consumables controller
angular.module('consumables').controller('ConsumablesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Consumables',
	function($scope, $stateParams, $location, Authentication, Consumables) {
		$scope.authentication = Authentication;

		// Create new Consumable
		$scope.create = function() {
			// Create new Consumable object
			var consumable = new Consumables ({
				name: this.name
			});

			// Redirect after save
			consumable.$save(function(response) {
				$location.path('consumables/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Consumable
		$scope.remove = function(consumable) {
			if ( consumable ) { 
				consumable.$remove();

				for (var i in $scope.consumables) {
					if ($scope.consumables [i] === consumable) {
						$scope.consumables.splice(i, 1);
					}
				}
			} else {
				$scope.consumable.$remove(function() {
					$location.path('consumables');
				});
			}
		};

		// Update existing Consumable
		$scope.update = function() {
			var consumable = $scope.consumable;

			consumable.$update(function() {
				$location.path('consumables/' + consumable._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Consumables
		$scope.find = function() {
			$scope.consumables = Consumables.query();
		};

		// Find existing Consumable
		$scope.findOne = function() {
			$scope.consumable = Consumables.get({ 
				consumableId: $stateParams.consumableId
			});
		};
	}
]);