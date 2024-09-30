import { ItemSheetv1 } from "./Item/v1.mjs";
import { PlayerSheetv1 } from "./Player/v1.mjs";

export function registerSheets() {
	Logger.debug(`Registering sheets`);

	Actors.registerSheet(game.system.id, PlayerSheetv1, {
		makeDefault: true,
		types: [`player`],
	});

	Items.registerSheet(game.system.id, ItemSheetv1, {
		makeDefault: true,
	});
};
