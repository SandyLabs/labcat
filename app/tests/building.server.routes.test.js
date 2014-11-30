'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Building = mongoose.model('Building'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, building;

/**
 * Building routes tests
 */
describe('Building CRUD tests', function() {
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

		// Save a user to the test db and create new Building
		user.save(function() {
			building = {
				name: 'Building Name'
			};

			done();
		});
	});

	it('should be able to save Building instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Building
				agent.post('/buildings')
					.send(building)
					.expect(200)
					.end(function(buildingSaveErr, buildingSaveRes) {
						// Handle Building save error
						if (buildingSaveErr) done(buildingSaveErr);

						// Get a list of Buildings
						agent.get('/buildings')
							.end(function(buildingsGetErr, buildingsGetRes) {
								// Handle Building save error
								if (buildingsGetErr) done(buildingsGetErr);

								// Get Buildings list
								var buildings = buildingsGetRes.body;

								// Set assertions
								(buildings[0].user._id).should.equal(userId);
								(buildings[0].name).should.match('Building Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Building instance if not logged in', function(done) {
		agent.post('/buildings')
			.send(building)
			.expect(401)
			.end(function(buildingSaveErr, buildingSaveRes) {
				// Call the assertion callback
				done(buildingSaveErr);
			});
	});

	it('should not be able to save Building instance if no name is provided', function(done) {
		// Invalidate name field
		building.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Building
				agent.post('/buildings')
					.send(building)
					.expect(400)
					.end(function(buildingSaveErr, buildingSaveRes) {
						// Set message assertion
						(buildingSaveRes.body.message).should.match('Please fill Building name');
						
						// Handle Building save error
						done(buildingSaveErr);
					});
			});
	});

	it('should be able to update Building instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Building
				agent.post('/buildings')
					.send(building)
					.expect(200)
					.end(function(buildingSaveErr, buildingSaveRes) {
						// Handle Building save error
						if (buildingSaveErr) done(buildingSaveErr);

						// Update Building name
						building.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Building
						agent.put('/buildings/' + buildingSaveRes.body._id)
							.send(building)
							.expect(200)
							.end(function(buildingUpdateErr, buildingUpdateRes) {
								// Handle Building update error
								if (buildingUpdateErr) done(buildingUpdateErr);

								// Set assertions
								(buildingUpdateRes.body._id).should.equal(buildingSaveRes.body._id);
								(buildingUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Buildings if not signed in', function(done) {
		// Create new Building model instance
		var buildingObj = new Building(building);

		// Save the Building
		buildingObj.save(function() {
			// Request Buildings
			request(app).get('/buildings')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Building if not signed in', function(done) {
		// Create new Building model instance
		var buildingObj = new Building(building);

		// Save the Building
		buildingObj.save(function() {
			request(app).get('/buildings/' + buildingObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', building.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Building instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Building
				agent.post('/buildings')
					.send(building)
					.expect(200)
					.end(function(buildingSaveErr, buildingSaveRes) {
						// Handle Building save error
						if (buildingSaveErr) done(buildingSaveErr);

						// Delete existing Building
						agent.delete('/buildings/' + buildingSaveRes.body._id)
							.send(building)
							.expect(200)
							.end(function(buildingDeleteErr, buildingDeleteRes) {
								// Handle Building error error
								if (buildingDeleteErr) done(buildingDeleteErr);

								// Set assertions
								(buildingDeleteRes.body._id).should.equal(buildingSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Building instance if not signed in', function(done) {
		// Set Building user 
		building.user = user;

		// Create new Building model instance
		var buildingObj = new Building(building);

		// Save the Building
		buildingObj.save(function() {
			// Try deleting Building
			request(app).delete('/buildings/' + buildingObj._id)
			.expect(401)
			.end(function(buildingDeleteErr, buildingDeleteRes) {
				// Set message assertion
				(buildingDeleteRes.body.message).should.match('User is not logged in');

				// Handle Building error error
				done(buildingDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Building.remove().exec();
		done();
	});
});