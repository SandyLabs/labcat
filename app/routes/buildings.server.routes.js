'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var buildings = require('../../app/controllers/buildings.server.controller');

	// Buildings Routes
	app.route('/buildings')
		.get(buildings.list)
		.post(users.requiresLogin, buildings.create);

	app.route('/buildings/:buildingId')
		.get(buildings.read)
		.put(users.requiresLogin, buildings.hasAuthorization, buildings.update)
		.delete(users.requiresLogin, buildings.hasAuthorization, buildings.delete);

	// Finish by binding the Building middleware
	app.param('buildingId', buildings.buildingByID);
};
