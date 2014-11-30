'use strict';

(function() {
	// Buildings Controller Spec
	describe('Buildings Controller Tests', function() {
		// Initialize global variables
		var BuildingsController,
		scope,
		$httpBackend,
		$stateParams,
		$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Buildings controller.
			BuildingsController = $controller('BuildingsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Building object fetched from XHR', inject(function(Buildings) {
			// Create sample Building using the Buildings service
			var sampleBuilding = new Buildings({
				name: 'New Building'
			});

			// Create a sample Buildings array that includes the new Building
			var sampleBuildings = [sampleBuilding];

			// Set GET response
			$httpBackend.expectGET('buildings').respond(sampleBuildings);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.buildings).toEqualData(sampleBuildings);
		}));

		it('$scope.findOne() should create an array with one Building object fetched from XHR using a buildingId URL parameter', inject(function(Buildings) {
			// Define a sample Building object
			var sampleBuilding = new Buildings({
				name: 'New Building'
			});

			// Set the URL parameter
			$stateParams.buildingId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/buildings\/([0-9a-fA-F]{24})$/).respond(sampleBuilding);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.building).toEqualData(sampleBuilding);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Buildings) {
			// Create a sample Building object
			var sampleBuildingPostData = new Buildings({
				name: 'New Building'
			});

			// Create a sample Building response
			var sampleBuildingResponse = new Buildings({
				_id: '525cf20451979dea2c000001',
				name: 'New Building'
			});

			// Fixture mock form input values
			scope.name = 'New Building';

			// Set POST response
			$httpBackend.expectPOST('buildings', sampleBuildingPostData).respond(sampleBuildingResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Building was created
			expect($location.path()).toBe('/buildings/' + sampleBuildingResponse._id);
		}));

		it('$scope.update() should update a valid Building', inject(function(Buildings) {
			// Define a sample Building put data
			var sampleBuildingPutData = new Buildings({
				_id: '525cf20451979dea2c000001',
				name: 'New Building'
			});

			// Mock Building in scope
			scope.building = sampleBuildingPutData;

			// Set PUT response
			$httpBackend.expectPUT(/buildings\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/buildings/' + sampleBuildingPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid buildingId and remove the Building from the scope', inject(function(Buildings) {
			// Create new Building object
			var sampleBuilding = new Buildings({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Buildings array and include the Building
			scope.buildings = [sampleBuilding];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/buildings\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleBuilding);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.buildings.length).toBe(0);
		}));
	});
}());