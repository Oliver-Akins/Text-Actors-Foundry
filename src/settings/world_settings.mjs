import { FEATURE_FLAGS } from "../consts.mjs";

export function registerWorldSettings() {
	game.settings.register(game.system.id, `flags`, {
		name: `Feature Flags`,
		hint: `World-based feature flags that are used to enable/disable specific behaviours`,
		scope: `world`,
		type: new foundry.data.fields.SetField(
			new foundry.data.fields.StringField(
				{
					empty: false,
					trim: true,
					options: Object.values(FEATURE_FLAGS),
				},
			),
			{
				required: false,
				initial: new Set(),
			},
		),
		config: true,
		requiresReload: true,
	});
};
