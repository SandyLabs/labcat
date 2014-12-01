'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var stores = require('../../app/controllers/stores.server.controller');

	// Stores Routes
	app.route('/stores')
		.get(stores.list)
		.post(users.requiresLogin, stores.create);

	app.route('/stores/:storeId')
		.get(stores.read)
		.put(users.requiresLogin, stores.hasAuthorization, stores.update)
		.delete(users.requiresLogin, stores.hasAuthorization, stores.delete);

	// Finish by binding the Store middleware
	app.param('storeId', stores.storeByID);
};
