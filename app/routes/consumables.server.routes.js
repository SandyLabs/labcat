'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var consumables = require('../../app/controllers/consumables.server.controller');

	// Consumables Routes
	app.route('/consumables')
		.get(consumables.list)
		.post(users.requiresLogin, consumables.create);

	app.route('/consumables/:consumableId')
		.get(consumables.read)
		.put(users.requiresLogin, consumables.hasAuthorization, consumables.update)
		.delete(users.requiresLogin, consumables.hasAuthorization, consumables.delete);

	// Finish by binding the Consumable middleware
	app.param('consumableId', consumables.consumableByID);
};
