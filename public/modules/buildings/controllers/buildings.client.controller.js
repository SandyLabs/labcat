'use strict';

// Buildings controller
angular.module('buildings').controller('BuildingsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Buildings',
	function($scope, $stateParams, $location, Authentication, Buildings) {
		$scope.authentication = Authentication;

		// Create new Building
		$scope.create = function() {
			// Create new Building object
			var building = new Buildings ({
				name: this.name
			});

			// Redirect after save
			building.$save(function(response) {
				$location.path('buildings/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Building
		$scope.remove = function(building) {
			if ( building ) { 
				building.$remove();

				for (var i in $scope.buildings) {
					if ($scope.buildings [i] === building) {
						$scope.buildings.splice(i, 1);
					}
				}
			} else {
				$scope.building.$remove(function() {
					$location.path('buildings');
				});
			}
		};

		// Update existing Building
		$scope.update = function() {
			var building = $scope.building;

			building.$update(function() {
				$location.path('buildings/' + building._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Buildings
		$scope.find = function() {
			$scope.buildings = Buildings.query();
		};

		// Find existing Building
		$scope.findOne = function() {
			$scope.building = Buildings.get({ 
				buildingId: $stateParams.buildingId
			});
		};
	}
]);