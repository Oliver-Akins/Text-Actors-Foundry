export class PlayerSheetv1 extends ActorSheet {
	static get defaultOptions() {
		let opts = foundry.utils.mergeObject(
			super.defaultOptions,
			{
				template: `systems/${game.system.id}/templates/Player/v1/main.hbs`,
			},
		);
		opts.classes.push(`style-v1`);
		return opts;
	};
}
