'use strict';

(function() {
	// Labs Controller Spec
	describe('Labs Controller Tests', function() {
		// Initialize global variables
		var LabsController,
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

			// Initialize the Labs controller.
			LabsController = $controller('LabsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Lab object fetched from XHR', inject(function(Labs) {
			// Create sample Lab using the Labs service
			var sampleLab = new Labs({
				name: 'New Lab'
			});

			// Create a sample Labs array that includes the new Lab
			var sampleLabs = [sampleLab];

			// Set GET response
			$httpBackend.expectGET('labs').respond(sampleLabs);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.labs).toEqualData(sampleLabs);
		}));

		it('$scope.findOne() should create an array with one Lab object fetched from XHR using a labId URL parameter', inject(function(Labs) {
			// Define a sample Lab object
			var sampleLab = new Labs({
				name: 'New Lab'
			});

			// Set the URL parameter
			$stateParams.labId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/labs\/([0-9a-fA-F]{24})$/).respond(sampleLab);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.lab).toEqualData(sampleLab);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Labs) {
			// Create a sample Lab object
			var sampleLabPostData = new Labs({
				name: 'New Lab'
			});

			// Create a sample Lab response
			var sampleLabResponse = new Labs({
				_id: '525cf20451979dea2c000001',
				name: 'New Lab'
			});

			// Fixture mock form input values
			scope.name = 'New Lab';

			// Set POST response
			$httpBackend.expectPOST('labs', sampleLabPostData).respond(sampleLabResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Lab was created
			expect($location.path()).toBe('/labs/' + sampleLabResponse._id);
		}));

		it('$scope.update() should update a valid Lab', inject(function(Labs) {
			// Define a sample Lab put data
			var sampleLabPutData = new Labs({
				_id: '525cf20451979dea2c000001',
				name: 'New Lab'
			});

			// Mock Lab in scope
			scope.lab = sampleLabPutData;

			// Set PUT response
			$httpBackend.expectPUT(/labs\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/labs/' + sampleLabPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid labId and remove the Lab from the scope', inject(function(Labs) {
			// Create new Lab object
			var sampleLab = new Labs({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Labs array and include the Lab
			scope.labs = [sampleLab];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/labs\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleLab);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.labs.length).toBe(0);
		}));
	});
}());