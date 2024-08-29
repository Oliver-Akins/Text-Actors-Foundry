import { PlayerSheetv1 } from "./Player/v1.mjs";

export function registerSheets() {
	Logger.debug(`Registering sheets`);

	Actors.registerSheet(game.system.id, PlayerSheetv1, {
		makeDefault: true,
		types: [`player`],
		label: `Hello`,
	});
};
