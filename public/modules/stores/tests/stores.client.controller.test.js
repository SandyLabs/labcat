'use strict';

(function() {
	// Stores Controller Spec
	describe('Stores Controller Tests', function() {
		// Initialize global variables
		var StoresController,
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

			// Initialize the Stores controller.
			StoresController = $controller('StoresController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Store object fetched from XHR', inject(function(Stores) {
			// Create sample Store using the Stores service
			var sampleStore = new Stores({
				name: 'New Store'
			});

			// Create a sample Stores array that includes the new Store
			var sampleStores = [sampleStore];

			// Set GET response
			$httpBackend.expectGET('stores').respond(sampleStores);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.stores).toEqualData(sampleStores);
		}));

		it('$scope.findOne() should create an array with one Store object fetched from XHR using a storeId URL parameter', inject(function(Stores) {
			// Define a sample Store object
			var sampleStore = new Stores({
				name: 'New Store'
			});

			// Set the URL parameter
			$stateParams.storeId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/stores\/([0-9a-fA-F]{24})$/).respond(sampleStore);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.store).toEqualData(sampleStore);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Stores) {
			// Create a sample Store object
			var sampleStorePostData = new Stores({
				name: 'New Store'
			});

			// Create a sample Store response
			var sampleStoreResponse = new Stores({
				_id: '525cf20451979dea2c000001',
				name: 'New Store'
			});

			// Fixture mock form input values
			scope.name = 'New Store';

			// Set POST response
			$httpBackend.expectPOST('stores', sampleStorePostData).respond(sampleStoreResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Store was created
			expect($location.path()).toBe('/stores/' + sampleStoreResponse._id);
		}));

		it('$scope.update() should update a valid Store', inject(function(Stores) {
			// Define a sample Store put data
			var sampleStorePutData = new Stores({
				_id: '525cf20451979dea2c000001',
				name: 'New Store'
			});

			// Mock Store in scope
			scope.store = sampleStorePutData;

			// Set PUT response
			$httpBackend.expectPUT(/stores\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/stores/' + sampleStorePutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid storeId and remove the Store from the scope', inject(function(Stores) {
			// Create new Store object
			var sampleStore = new Stores({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Stores array and include the Store
			scope.stores = [sampleStore];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/stores\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleStore);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.stores.length).toBe(0);
		}));
	});
}());