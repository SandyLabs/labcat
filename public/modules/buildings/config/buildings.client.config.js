'use strict';

// Configuring the Articles module
angular.module('buildings').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Buildings', 'buildings', 'dropdown', '/buildings(/create)?');
		Menus.addSubMenuItem('topbar', 'buildings', 'List Buildings', 'buildings');
		Menus.addSubMenuItem('topbar', 'buildings', 'New Building', 'buildings/create');
	}
]);