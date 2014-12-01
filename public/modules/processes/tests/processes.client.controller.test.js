'use strict';

(function() {
	// Processes Controller Spec
	describe('Processes Controller Tests', function() {
		// Initialize global variables
		var ProcessesController,
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

			// Initialize the Processes controller.
			ProcessesController = $controller('ProcessesController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Process object fetched from XHR', inject(function(Processes) {
			// Create sample Process using the Processes service
			var sampleProcess = new Processes({
				name: 'New Process'
			});

			// Create a sample Processes array that includes the new Process
			var sampleProcesses = [sampleProcess];

			// Set GET response
			$httpBackend.expectGET('processes').respond(sampleProcesses);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.processes).toEqualData(sampleProcesses);
		}));

		it('$scope.findOne() should create an array with one Process object fetched from XHR using a processId URL parameter', inject(function(Processes) {
			// Define a sample Process object
			var sampleProcess = new Processes({
				name: 'New Process'
			});

			// Set the URL parameter
			$stateParams.processId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/processes\/([0-9a-fA-F]{24})$/).respond(sampleProcess);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.process).toEqualData(sampleProcess);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Processes) {
			// Create a sample Process object
			var sampleProcessPostData = new Processes({
				name: 'New Process'
			});

			// Create a sample Process response
			var sampleProcessResponse = new Processes({
				_id: '525cf20451979dea2c000001',
				name: 'New Process'
			});

			// Fixture mock form input values
			scope.name = 'New Process';

			// Set POST response
			$httpBackend.expectPOST('processes', sampleProcessPostData).respond(sampleProcessResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Process was created
			expect($location.path()).toBe('/processes/' + sampleProcessResponse._id);
		}));

		it('$scope.update() should update a valid Process', inject(function(Processes) {
			// Define a sample Process put data
			var sampleProcessPutData = new Processes({
				_id: '525cf20451979dea2c000001',
				name: 'New Process'
			});

			// Mock Process in scope
			scope.process = sampleProcessPutData;

			// Set PUT response
			$httpBackend.expectPUT(/processes\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/processes/' + sampleProcessPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid processId and remove the Process from the scope', inject(function(Processes) {
			// Create new Process object
			var sampleProcess = new Processes({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Processes array and include the Process
			scope.processes = [sampleProcess];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/processes\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleProcess);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.processes.length).toBe(0);
		}));
	});
}());