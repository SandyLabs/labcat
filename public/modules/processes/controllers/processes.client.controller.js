'use strict';

// Processes controller
angular.module('processes').controller('ProcessesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Processes',
	function($scope, $stateParams, $location, Authentication, Processes) {
		$scope.authentication = Authentication;

		// Create new Process
		$scope.create = function() {
			// Create new Process object
			var process = new Processes ({
				name: this.name
			});

			// Redirect after save
			process.$save(function(response) {
				$location.path('processes/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Process
		$scope.remove = function(process) {
			if ( process ) { 
				process.$remove();

				for (var i in $scope.processes) {
					if ($scope.processes [i] === process) {
						$scope.processes.splice(i, 1);
					}
				}
			} else {
				$scope.process.$remove(function() {
					$location.path('processes');
				});
			}
		};

		// Update existing Process
		$scope.update = function() {
			var process = $scope.process;

			process.$update(function() {
				$location.path('processes/' + process._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Processes
		$scope.find = function() {
			$scope.processes = Processes.query();
		};

		// Find existing Process
		$scope.findOne = function() {
			$scope.process = Processes.get({ 
				processId: $stateParams.processId
			});
		};
	}
]);