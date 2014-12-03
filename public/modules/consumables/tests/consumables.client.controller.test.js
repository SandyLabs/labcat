'use strict';

(function() {
	// Consumables Controller Spec
	describe('Consumables Controller Tests', function() {
		// Initialize global variables
		var ConsumablesController,
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

			// Initialize the Consumables controller.
			ConsumablesController = $controller('ConsumablesController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Consumable object fetched from XHR', inject(function(Consumables) {
			// Create sample Consumable using the Consumables service
			var sampleConsumable = new Consumables({
				name: 'New Consumable'
			});

			// Create a sample Consumables array that includes the new Consumable
			var sampleConsumables = [sampleConsumable];

			// Set GET response
			$httpBackend.expectGET('consumables').respond(sampleConsumables);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.consumables).toEqualData(sampleConsumables);
		}));

		it('$scope.findOne() should create an array with one Consumable object fetched from XHR using a consumableId URL parameter', inject(function(Consumables) {
			// Define a sample Consumable object
			var sampleConsumable = new Consumables({
				name: 'New Consumable'
			});

			// Set the URL parameter
			$stateParams.consumableId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/consumables\/([0-9a-fA-F]{24})$/).respond(sampleConsumable);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.consumable).toEqualData(sampleConsumable);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Consumables) {
			// Create a sample Consumable object
			var sampleConsumablePostData = new Consumables({
				name: 'New Consumable'
			});

			// Create a sample Consumable response
			var sampleConsumableResponse = new Consumables({
				_id: '525cf20451979dea2c000001',
				name: 'New Consumable'
			});

			// Fixture mock form input values
			scope.name = 'New Consumable';

			// Set POST response
			$httpBackend.expectPOST('consumables', sampleConsumablePostData).respond(sampleConsumableResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Consumable was created
			expect($location.path()).toBe('/consumables/' + sampleConsumableResponse._id);
		}));

		it('$scope.update() should update a valid Consumable', inject(function(Consumables) {
			// Define a sample Consumable put data
			var sampleConsumablePutData = new Consumables({
				_id: '525cf20451979dea2c000001',
				name: 'New Consumable'
			});

			// Mock Consumable in scope
			scope.consumable = sampleConsumablePutData;

			// Set PUT response
			$httpBackend.expectPUT(/consumables\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/consumables/' + sampleConsumablePutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid consumableId and remove the Consumable from the scope', inject(function(Consumables) {
			// Create new Consumable object
			var sampleConsumable = new Consumables({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Consumables array and include the Consumable
			scope.consumables = [sampleConsumable];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/consumables\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleConsumable);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.consumables.length).toBe(0);
		}));
	});
}());