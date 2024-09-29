export function registerDevSettings() {
	const isLocalhost = window.location.hostname === `localhost`;

	game.settings.register(game.system.id, `devMode`, {
		name: `Dev Mode?`,
		scope: `client`,
		type: Boolean,
		config: isLocalhost,
		default: false,
		requiresReload: false,
	});

	game.settings.register(game.system.id, `defaultTab`, {
		name: `Default Sidebar Tab`,
		scope: `client`,
		type: String,
		config: isLocalhost,
		requiresReload: false,
		onChange(value) {
			if (!ui.sidebar.tabs[value]) {
				ui.notifications.warn(`"${value}" cannot be found in the sidebar tabs, it may not work at reload.`);
			}
		},
	});
};
