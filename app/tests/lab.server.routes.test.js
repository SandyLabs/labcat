'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Lab = mongoose.model('Lab'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, lab;

/**
 * Lab routes tests
 */
describe('Lab CRUD tests', function() {
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

		// Save a user to the test db and create new Lab
		user.save(function() {
			lab = {
				name: 'Lab Name'
			};

			done();
		});
	});

	it('should be able to save Lab instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Lab
				agent.post('/labs')
					.send(lab)
					.expect(200)
					.end(function(labSaveErr, labSaveRes) {
						// Handle Lab save error
						if (labSaveErr) done(labSaveErr);

						// Get a list of Labs
						agent.get('/labs')
							.end(function(labsGetErr, labsGetRes) {
								// Handle Lab save error
								if (labsGetErr) done(labsGetErr);

								// Get Labs list
								var labs = labsGetRes.body;

								// Set assertions
								(labs[0].user._id).should.equal(userId);
								(labs[0].name).should.match('Lab Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Lab instance if not logged in', function(done) {
		agent.post('/labs')
			.send(lab)
			.expect(401)
			.end(function(labSaveErr, labSaveRes) {
				// Call the assertion callback
				done(labSaveErr);
			});
	});

	it('should not be able to save Lab instance if no name is provided', function(done) {
		// Invalidate name field
		lab.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Lab
				agent.post('/labs')
					.send(lab)
					.expect(400)
					.end(function(labSaveErr, labSaveRes) {
						// Set message assertion
						(labSaveRes.body.message).should.match('Please fill Lab name');
						
						// Handle Lab save error
						done(labSaveErr);
					});
			});
	});

	it('should be able to update Lab instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Lab
				agent.post('/labs')
					.send(lab)
					.expect(200)
					.end(function(labSaveErr, labSaveRes) {
						// Handle Lab save error
						if (labSaveErr) done(labSaveErr);

						// Update Lab name
						lab.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Lab
						agent.put('/labs/' + labSaveRes.body._id)
							.send(lab)
							.expect(200)
							.end(function(labUpdateErr, labUpdateRes) {
								// Handle Lab update error
								if (labUpdateErr) done(labUpdateErr);

								// Set assertions
								(labUpdateRes.body._id).should.equal(labSaveRes.body._id);
								(labUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Labs if not signed in', function(done) {
		// Create new Lab model instance
		var labObj = new Lab(lab);

		// Save the Lab
		labObj.save(function() {
			// Request Labs
			request(app).get('/labs')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Lab if not signed in', function(done) {
		// Create new Lab model instance
		var labObj = new Lab(lab);

		// Save the Lab
		labObj.save(function() {
			request(app).get('/labs/' + labObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', lab.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Lab instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Lab
				agent.post('/labs')
					.send(lab)
					.expect(200)
					.end(function(labSaveErr, labSaveRes) {
						// Handle Lab save error
						if (labSaveErr) done(labSaveErr);

						// Delete existing Lab
						agent.delete('/labs/' + labSaveRes.body._id)
							.send(lab)
							.expect(200)
							.end(function(labDeleteErr, labDeleteRes) {
								// Handle Lab error error
								if (labDeleteErr) done(labDeleteErr);

								// Set assertions
								(labDeleteRes.body._id).should.equal(labSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Lab instance if not signed in', function(done) {
		// Set Lab user 
		lab.user = user;

		// Create new Lab model instance
		var labObj = new Lab(lab);

		// Save the Lab
		labObj.save(function() {
			// Try deleting Lab
			request(app).delete('/labs/' + labObj._id)
			.expect(401)
			.end(function(labDeleteErr, labDeleteRes) {
				// Set message assertion
				(labDeleteRes.body.message).should.match('User is not logged in');

				// Handle Lab error error
				done(labDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Lab.remove().exec();
		done();
	});
});