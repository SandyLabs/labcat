'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Consumable = mongoose.model('Consumable'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, consumable;

/**
 * Consumable routes tests
 */
describe('Consumable CRUD tests', function() {
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

		// Save a user to the test db and create new Consumable
		user.save(function() {
			consumable = {
				name: 'Consumable Name'
			};

			done();
		});
	});

	it('should be able to save Consumable instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Consumable
				agent.post('/consumables')
					.send(consumable)
					.expect(200)
					.end(function(consumableSaveErr, consumableSaveRes) {
						// Handle Consumable save error
						if (consumableSaveErr) done(consumableSaveErr);

						// Get a list of Consumables
						agent.get('/consumables')
							.end(function(consumablesGetErr, consumablesGetRes) {
								// Handle Consumable save error
								if (consumablesGetErr) done(consumablesGetErr);

								// Get Consumables list
								var consumables = consumablesGetRes.body;

								// Set assertions
								(consumables[0].user._id).should.equal(userId);
								(consumables[0].name).should.match('Consumable Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Consumable instance if not logged in', function(done) {
		agent.post('/consumables')
			.send(consumable)
			.expect(401)
			.end(function(consumableSaveErr, consumableSaveRes) {
				// Call the assertion callback
				done(consumableSaveErr);
			});
	});

	it('should not be able to save Consumable instance if no name is provided', function(done) {
		// Invalidate name field
		consumable.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Consumable
				agent.post('/consumables')
					.send(consumable)
					.expect(400)
					.end(function(consumableSaveErr, consumableSaveRes) {
						// Set message assertion
						(consumableSaveRes.body.message).should.match('Please fill Consumable name');
						
						// Handle Consumable save error
						done(consumableSaveErr);
					});
			});
	});

	it('should be able to update Consumable instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Consumable
				agent.post('/consumables')
					.send(consumable)
					.expect(200)
					.end(function(consumableSaveErr, consumableSaveRes) {
						// Handle Consumable save error
						if (consumableSaveErr) done(consumableSaveErr);

						// Update Consumable name
						consumable.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Consumable
						agent.put('/consumables/' + consumableSaveRes.body._id)
							.send(consumable)
							.expect(200)
							.end(function(consumableUpdateErr, consumableUpdateRes) {
								// Handle Consumable update error
								if (consumableUpdateErr) done(consumableUpdateErr);

								// Set assertions
								(consumableUpdateRes.body._id).should.equal(consumableSaveRes.body._id);
								(consumableUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Consumables if not signed in', function(done) {
		// Create new Consumable model instance
		var consumableObj = new Consumable(consumable);

		// Save the Consumable
		consumableObj.save(function() {
			// Request Consumables
			request(app).get('/consumables')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Consumable if not signed in', function(done) {
		// Create new Consumable model instance
		var consumableObj = new Consumable(consumable);

		// Save the Consumable
		consumableObj.save(function() {
			request(app).get('/consumables/' + consumableObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', consumable.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Consumable instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Consumable
				agent.post('/consumables')
					.send(consumable)
					.expect(200)
					.end(function(consumableSaveErr, consumableSaveRes) {
						// Handle Consumable save error
						if (consumableSaveErr) done(consumableSaveErr);

						// Delete existing Consumable
						agent.delete('/consumables/' + consumableSaveRes.body._id)
							.send(consumable)
							.expect(200)
							.end(function(consumableDeleteErr, consumableDeleteRes) {
								// Handle Consumable error error
								if (consumableDeleteErr) done(consumableDeleteErr);

								// Set assertions
								(consumableDeleteRes.body._id).should.equal(consumableSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Consumable instance if not signed in', function(done) {
		// Set Consumable user 
		consumable.user = user;

		// Create new Consumable model instance
		var consumableObj = new Consumable(consumable);

		// Save the Consumable
		consumableObj.save(function() {
			// Try deleting Consumable
			request(app).delete('/consumables/' + consumableObj._id)
			.expect(401)
			.end(function(consumableDeleteErr, consumableDeleteRes) {
				// Set message assertion
				(consumableDeleteRes.body.message).should.match('User is not logged in');

				// Handle Consumable error error
				done(consumableDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Consumable.remove().exec();
		done();
	});
});