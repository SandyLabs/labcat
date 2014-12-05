'use strict';

// Rooms controller
angular.module('rooms').controller('RoomsController', ['$scope', '$stateParams', '$location', '$http', 'Authentication',
        'Rooms', 'Buildings', 'Users',
	function($scope, $stateParams, $location, $http, Authentication, Rooms, Buildings, Users) {
		$scope.authentication = Authentication;
		$scope.types = ['Lab','Store'];
		$scope.type = $scope.types[0];
		$scope.buildings = Buildings.query(function(){
            $scope.building = $scope.buildings[0]._id;
        });
        $scope.users = Users.query(function(){
            $scope.users.forEach(function(user){
                user.ticked = false;
            });
        });

		function successCallback(data, status, headers, config){
			console.log(status);
		}

		// Create new Room
		$scope.create = function() {
			// Create new Room object
			var room = new Rooms({
					name: this.name,
                    description: this.description,
					type: this.type,
					building: this.building,
                    manager: this.manager
			});

			// Redirect after save
			room.$save(function(response) {
				$location.path('rooms/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Room
		$scope.remove = function(room) {
			if ( room ) { 
				room.$remove();

				for (var i in $scope.rooms) {
					if ($scope.rooms [i] === room) {
						$scope.rooms.splice(i, 1);
					}
				}
			} else {
				$scope.room.$remove(function() {
					$location.path('rooms');
				});
			}
		};

		// Update existing Room
		$scope.update = function() {
			var room = $scope.room;

			room.$update(function() {
				$location.path('rooms/' + room._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Rooms
		$scope.find = function() {
			$scope.rooms = Rooms.query();
			$http.jsonp('http://reddit.com/r/funny/.json?limit=5000&jsonp=JSON_CALLBACK').success(successCallback);
		};

		// Find existing Room
		$scope.findOne = function() {
			$scope.room = Rooms.get({ 
				roomId: $stateParams.roomId
			});
		};
	}
]);