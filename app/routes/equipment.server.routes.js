'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var equipment = require('../../app/controllers/equipment.server.controller');

	// Equipment Routes
	app.route('/equipment')
		.get(equipment.list)
		.post(users.requiresLogin, equipment.create);

	app.route('/equipment/:equipmentId')
		.get(equipment.read)
		.put(users.requiresLogin, equipment.hasAuthorization, equipment.update)
		.delete(users.requiresLogin, equipment.hasAuthorization, equipment.delete);

	// Finish by binding the Equipment middleware
	app.param('equipmentId', equipment.equipmentByID);
};
