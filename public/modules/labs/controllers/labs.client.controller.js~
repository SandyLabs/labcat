'use strict';

// Labs controller
angular.module('labs').controller('LabsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Labs',
	function($scope, $stateParams, $location, Authentication, Labs) {
		$scope.authentication = Authentication;

		// Create new Lab
		$scope.create = function() {
			// Create new Lab object
			var lab = new Labs ({
				name: this.name,
				building: this.building
			});

			// Redirect after save
			lab.$save(function(response) {
				$location.path('labs/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Lab
		$scope.remove = function(lab) {
			if ( lab ) { 
				lab.$remove();

				for (var i in $scope.labs) {
					if ($scope.labs [i] === lab) {
						$scope.labs.splice(i, 1);
					}
				}
			} else {
				$scope.lab.$remove(function() {
					$location.path('labs');
				});
			}
		};

		// Update existing Lab
		$scope.update = function() {
			var lab = $scope.lab;

			lab.$update(function() {
				$location.path('labs/' + lab._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Labs
		$scope.find = function() {
			$scope.labs = Labs.query();
		};

		// Find existing Lab
		$scope.findOne = function() {
			$scope.lab = Labs.get({ 
				labId: $stateParams.labId
			});
		};
	}
]);
