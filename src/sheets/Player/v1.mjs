import { SizeStorable } from "../mixins/SizeStorable.mjs";

export class PlayerSheetv1 extends SizeStorable(ActorSheet) {
	static get defaultOptions() {
		let opts = foundry.utils.mergeObject(
			super.defaultOptions,
			{
				template: `systems/${game.system.id}/templates/Player/v1/main.hbs`,
				classes: [],
			},
		);
		opts.classes = [`actor--player`, `style-v1`];
		return opts;
	};

	async getData() {
		const ctx = {};

		ctx.editable = this.isEditable;

		const actor = ctx.actor = this.actor;
		ctx.system = actor.system;
		ctx.enriched = { system: {} };
		ctx.enriched.system.content = await TextEditor.enrichHTML(actor.system.content);

		return ctx;
	};
}
