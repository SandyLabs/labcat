'use strict';

// Configuring the Articles module
angular.module('processes').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Processes', 'processes', 'dropdown', '/processes(/create)?');
		Menus.addSubMenuItem('topbar', 'processes', 'List Processes', 'processes');
		Menus.addSubMenuItem('topbar', 'processes', 'New Process', 'processes/create');
	}
]);