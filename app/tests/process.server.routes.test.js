'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Process = mongoose.model('Process'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, process;

/**
 * Process routes tests
 */
describe('Process CRUD tests', function() {
	beforeEach(function(done) {
		// Create user credentials
		credentials = {
			username: 'username',
			password: 'password'
		};

		// Create a new user
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: credentials.username,
			password: credentials.password,
			provider: 'local'
		});

		// Save a user to the test db and create new Process
		user.save(function() {
			process = {
				name: 'Process Name'
			};

			done();
		});
	});

	it('should be able to save Process instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Process
				agent.post('/processes')
					.send(process)
					.expect(200)
					.end(function(processSaveErr, processSaveRes) {
						// Handle Process save error
						if (processSaveErr) done(processSaveErr);

						// Get a list of Processes
						agent.get('/processes')
							.end(function(processesGetErr, processesGetRes) {
								// Handle Process save error
								if (processesGetErr) done(processesGetErr);

								// Get Processes list
								var processes = processesGetRes.body;

								// Set assertions
								(processes[0].user._id).should.equal(userId);
								(processes[0].name).should.match('Process Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Process instance if not logged in', function(done) {
		agent.post('/processes')
			.send(process)
			.expect(401)
			.end(function(processSaveErr, processSaveRes) {
				// Call the assertion callback
				done(processSaveErr);
			});
	});

	it('should not be able to save Process instance if no name is provided', function(done) {
		// Invalidate name field
		process.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Process
				agent.post('/processes')
					.send(process)
					.expect(400)
					.end(function(processSaveErr, processSaveRes) {
						// Set message assertion
						(processSaveRes.body.message).should.match('Please fill Process name');
						
						// Handle Process save error
						done(processSaveErr);
					});
			});
	});

	it('should be able to update Process instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Process
				agent.post('/processes')
					.send(process)
					.expect(200)
					.end(function(processSaveErr, processSaveRes) {
						// Handle Process save error
						if (processSaveErr) done(processSaveErr);

						// Update Process name
						process.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Process
						agent.put('/processes/' + processSaveRes.body._id)
							.send(process)
							.expect(200)
							.end(function(processUpdateErr, processUpdateRes) {
								// Handle Process update error
								if (processUpdateErr) done(processUpdateErr);

								// Set assertions
								(processUpdateRes.body._id).should.equal(processSaveRes.body._id);
								(processUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Processes if not signed in', function(done) {
		// Create new Process model instance
		var processObj = new Process(process);

		// Save the Process
		processObj.save(function() {
			// Request Processes
			request(app).get('/processes')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Process if not signed in', function(done) {
		// Create new Process model instance
		var processObj = new Process(process);

		// Save the Process
		processObj.save(function() {
			request(app).get('/processes/' + processObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', process.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Process instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Process
				agent.post('/processes')
					.send(process)
					.expect(200)
					.end(function(processSaveErr, processSaveRes) {
						// Handle Process save error
						if (processSaveErr) done(processSaveErr);

						// Delete existing Process
						agent.delete('/processes/' + processSaveRes.body._id)
							.send(process)
							.expect(200)
							.end(function(processDeleteErr, processDeleteRes) {
								// Handle Process error error
								if (processDeleteErr) done(processDeleteErr);

								// Set assertions
								(processDeleteRes.body._id).should.equal(processSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Process instance if not signed in', function(done) {
		// Set Process user 
		process.user = user;

		// Create new Process model instance
		var processObj = new Process(process);

		// Save the Process
		processObj.save(function() {
			// Try deleting Process
			request(app).delete('/processes/' + processObj._id)
			.expect(401)
			.end(function(processDeleteErr, processDeleteRes) {
				// Set message assertion
				(processDeleteRes.body.message).should.match('User is not logged in');

				// Handle Process error error
				done(processDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Process.remove().exec();
		done();
	});
});