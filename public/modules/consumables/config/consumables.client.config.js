'use strict';

// Configuring the Articles module
angular.module('consumables').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Consumables', 'consumables', 'dropdown', '/consumables(/create)?');
		Menus.addSubMenuItem('topbar', 'consumables', 'List Consumables', 'consumables');
		Menus.addSubMenuItem('topbar', 'consumables', 'New Consumable', 'consumables/create');
	}
]);