'use strict';

// Configuring the Articles module
angular.module('labs').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Labs', 'labs', 'dropdown', '/labs(/create)?');
		Menus.addSubMenuItem('topbar', 'labs', 'List Labs', 'labs');
		Menus.addSubMenuItem('topbar', 'labs', 'New Lab', 'labs/create');
	}
]);