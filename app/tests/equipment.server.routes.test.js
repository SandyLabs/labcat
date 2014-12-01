'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Equipment = mongoose.model('Equipment'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, equipment;

/**
 * Equipment routes tests
 */
describe('Equipment CRUD tests', function() {
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

		// Save a user to the test db and create new Equipment
		user.save(function() {
			equipment = {
				name: 'Equipment Name'
			};

			done();
		});
	});

	it('should be able to save Equipment instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Equipment
				agent.post('/equipment')
					.send(equipment)
					.expect(200)
					.end(function(equipmentSaveErr, equipmentSaveRes) {
						// Handle Equipment save error
						if (equipmentSaveErr) done(equipmentSaveErr);

						// Get a list of Equipment
						agent.get('/equipment')
							.end(function(equipmentGetErr, equipmentGetRes) {
								// Handle Equipment save error
								if (equipmentGetErr) done(equipmentGetErr);

								// Get Equipment list
								var equipment = equipmentGetRes.body;

								// Set assertions
								(equipment[0].user._id).should.equal(userId);
								(equipment[0].name).should.match('Equipment Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Equipment instance if not logged in', function(done) {
		agent.post('/equipment')
			.send(equipment)
			.expect(401)
			.end(function(equipmentSaveErr, equipmentSaveRes) {
				// Call the assertion callback
				done(equipmentSaveErr);
			});
	});

	it('should not be able to save Equipment instance if no name is provided', function(done) {
		// Invalidate name field
		equipment.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Equipment
				agent.post('/equipment')
					.send(equipment)
					.expect(400)
					.end(function(equipmentSaveErr, equipmentSaveRes) {
						// Set message assertion
						(equipmentSaveRes.body.message).should.match('Please fill Equipment name');
						
						// Handle Equipment save error
						done(equipmentSaveErr);
					});
			});
	});

	it('should be able to update Equipment instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Equipment
				agent.post('/equipment')
					.send(equipment)
					.expect(200)
					.end(function(equipmentSaveErr, equipmentSaveRes) {
						// Handle Equipment save error
						if (equipmentSaveErr) done(equipmentSaveErr);

						// Update Equipment name
						equipment.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Equipment
						agent.put('/equipment/' + equipmentSaveRes.body._id)
							.send(equipment)
							.expect(200)
							.end(function(equipmentUpdateErr, equipmentUpdateRes) {
								// Handle Equipment update error
								if (equipmentUpdateErr) done(equipmentUpdateErr);

								// Set assertions
								(equipmentUpdateRes.body._id).should.equal(equipmentSaveRes.body._id);
								(equipmentUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Equipment if not signed in', function(done) {
		// Create new Equipment model instance
		var equipmentObj = new Equipment(equipment);

		// Save the Equipment
		equipmentObj.save(function() {
			// Request Equipment
			request(app).get('/equipment')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Equipment if not signed in', function(done) {
		// Create new Equipment model instance
		var equipmentObj = new Equipment(equipment);

		// Save the Equipment
		equipmentObj.save(function() {
			request(app).get('/equipment/' + equipmentObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', equipment.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Equipment instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Equipment
				agent.post('/equipment')
					.send(equipment)
					.expect(200)
					.end(function(equipmentSaveErr, equipmentSaveRes) {
						// Handle Equipment save error
						if (equipmentSaveErr) done(equipmentSaveErr);

						// Delete existing Equipment
						agent.delete('/equipment/' + equipmentSaveRes.body._id)
							.send(equipment)
							.expect(200)
							.end(function(equipmentDeleteErr, equipmentDeleteRes) {
								// Handle Equipment error error
								if (equipmentDeleteErr) done(equipmentDeleteErr);

								// Set assertions
								(equipmentDeleteRes.body._id).should.equal(equipmentSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Equipment instance if not signed in', function(done) {
		// Set Equipment user 
		equipment.user = user;

		// Create new Equipment model instance
		var equipmentObj = new Equipment(equipment);

		// Save the Equipment
		equipmentObj.save(function() {
			// Try deleting Equipment
			request(app).delete('/equipment/' + equipmentObj._id)
			.expect(401)
			.end(function(equipmentDeleteErr, equipmentDeleteRes) {
				// Set message assertion
				(equipmentDeleteRes.body.message).should.match('User is not logged in');

				// Handle Equipment error error
				done(equipmentDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Equipment.remove().exec();
		done();
	});
});