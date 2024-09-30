import { SizeStorable } from "../mixins/SizeStorable.mjs";

export class ItemSheetv1 extends SizeStorable(ItemSheet) {
	static get defaultOptions() {
		let opts = foundry.utils.mergeObject(
			super.defaultOptions,
			{
				template: `systems/${game.system.id}/templates/Item/v1/main.hbs`,
				classes: [],
				width: 290,
				height: 380,
			},
		);
		opts.classes = [`item--generic`, `style-v1`];
		return opts;
	};

	async getData() {
		const ctx = {};

		ctx.editable = this.isEditable;

		const item = ctx.item = this.item;
		ctx.system = item.system;
		ctx.enriched = { system: {} };
		ctx.enriched.system.content = await TextEditor.enrichHTML(item.system.content);

		return ctx;
	};
}
