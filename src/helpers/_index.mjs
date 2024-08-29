import { handlebarsLocalizer, localizer } from "../utils/localizer.mjs";
import { options } from "./options.mjs";

export function registerHandlebarsHelpers() {
	const helperPrefix = game.system.id;

	return {
		// MARK: Complex helpers
		[`${helperPrefix}-i18n`]: handlebarsLocalizer,
		[`${helperPrefix}-options`]: options,

		// MARK: Simple helpers
		[`${helperPrefix}-stringify`]: v => JSON.stringify(v, null, `  `),
		[`${helperPrefix}-empty`]: v => v.length == 0,
		[`${helperPrefix}-set-has`]: (s, k) => s.has(k),
		[`${helperPrefix}-empty-state`]: (v) => v ?? localizer(`${game.system.id}.common.empty`),
	};
};
