'use strict';

// Configuring the Articles module
angular.module('labs').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Rooms', 'rooms', 'dropdown');
		Menus.addSubMenuItem('topbar', 'rooms', 'Labs', 'labs', '/labs(/create)?');
	}
]);
