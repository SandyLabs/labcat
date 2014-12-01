'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var processes = require('../../app/controllers/processes.server.controller');

	// Processes Routes
	app.route('/processes')
		.get(processes.list)
		.post(users.requiresLogin, processes.create);

	app.route('/processes/:processId')
		.get(processes.read)
		.put(users.requiresLogin, processes.hasAuthorization, processes.update)
		.delete(users.requiresLogin, processes.hasAuthorization, processes.delete);

	// Finish by binding the Process middleware
	app.param('processId', processes.processByID);
};
