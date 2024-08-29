const loaders = {
	svg(data) {
		const iconName = data.path.split(`/`).slice(-1)[0].slice(0, -4);
		Logger.debug(`hot-reloading icon: ${iconName}`);
		Hooks.call(`${game.system.id}-hmr:svg`, iconName, data);
	},
	js() {window.location.reload()},
	mjs() {window.location.reload()},
	css(data) {
		Logger.debug(`Hot-reloading CSS: ${data.path}`);
		Hooks.call(`${game.system.id}-hmr:css`, data);
	},
};

Hooks.on(`hotReload`, async (data) => {
	if (!loaders[data.extension]) {return}
	return loaders[data.extension](data);
});
