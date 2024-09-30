export class ItemData extends foundry.abstract.TypeDataModel {
	static defineSchema() {
		const fields = foundry.data.fields;
		return {
			content: new fields.HTMLField({
				blank: true,
				trim: true,
				initial: ``,
			}),
		};
	};
};
