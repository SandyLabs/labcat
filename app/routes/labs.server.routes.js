'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var labs = require('../../app/controllers/labs.server.controller');

	// Labs Routes
	app.route('/labs')
		.get(labs.list)
		.post(users.requiresLogin, labs.create);

	app.route('/labs/:labId')
		.get(labs.read)
		.put(users.requiresLogin, labs.hasAuthorization, labs.update)
		.delete(users.requiresLogin, labs.hasAuthorization, labs.delete);

	// Finish by binding the Lab middleware
	app.param('labId', labs.labByID);
};
