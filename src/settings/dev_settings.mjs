export function registerDevSettings() {
	game.settings.register(game.system.id, `devMode`, {
		scope: `client`,
		type: Boolean,
		config: false,
		default: false,
		requiresReload: true,
	});

	game.settings.register(game.system.id, `defaultTab`, {
		scope: `client`,
		type: String,
		config: false,
		requiresReload: false,
	});
};
