'use strict';

// Configuring the Articles module
angular.module('equipment').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Equipment', 'equipment', 'dropdown', '/equipment(/create)?');
		Menus.addSubMenuItem('topbar', 'equipment', 'List Equipment', 'equipment');
		Menus.addSubMenuItem('topbar', 'equipment', 'New Equipment', 'equipment/create');
	}
]);