import { localizer } from "../utils/localizer.mjs";

/**
 * @typedef {object} Option
 * @property {string} [label]
 * @property {string|number} value
 * @property {boolean} [disabled]
 */

/**
 * @param {string | number} selected
 * @param {Array<Option | string>} opts
 */
export function options(selected, opts, meta) {
	const { localize = false } = meta.hash;
	selected = Handlebars.escapeExpression(selected);
	const htmlOptions = [];

	for (let opt of opts) {
		if (foundry.utils.getType(opt) === `string`) {
			opt = { label: opt, value: opt };
		};
		opt.value = Handlebars.escapeExpression(opt.value);
		htmlOptions.push(
			`<option
				value="${opt.value}"
				${selected === opt.value ? `selected` : ``}
				${opt.disabled ? `disabled` : ``}
			>
				${localize ? localizer(opt.label) : opt.label}
			</option>`,
		);
	};
	return htmlOptions.join(`\n`);
};
