'use strict';

// Configuring the Articles module
angular.module('stores').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addSubMenuItem('topbar', 'rooms', 'Stores', 'stores', '/stores(/create)?');
	}
]);
