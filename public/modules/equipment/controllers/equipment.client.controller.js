'use strict';

// Equipment controller
angular.module('equipment').controller('EquipmentController', ['$scope', '$stateParams', '$location', 'Authentication', 'Equipment',
	function($scope, $stateParams, $location, Authentication, Equipment) {
		$scope.authentication = Authentication;

		// Create new Equipment
		$scope.create = function() {
			// Create new Equipment object
			var equipment = new Equipment ({
				name: this.name
			});

			// Redirect after save
			equipment.$save(function(response) {
				$location.path('equipment/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Equipment
		$scope.remove = function(equipment) {
			if ( equipment ) { 
				equipment.$remove();

				for (var i in $scope.equipment) {
					if ($scope.equipment [i] === equipment) {
						$scope.equipment.splice(i, 1);
					}
				}
			} else {
				$scope.equipment.$remove(function() {
					$location.path('equipment');
				});
			}
		};

		// Update existing Equipment
		$scope.update = function() {
			var equipment = $scope.equipment;

			equipment.$update(function() {
				$location.path('equipment/' + equipment._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Equipment
		$scope.find = function() {
			$scope.equipment = Equipment.query();
		};

		// Find existing Equipment
		$scope.findOne = function() {
			$scope.equipment = Equipment.get({ 
				equipmentId: $stateParams.equipmentId
			});
		};
	}
]);