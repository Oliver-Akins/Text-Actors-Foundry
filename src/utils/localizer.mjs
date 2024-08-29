/** A handlebars helper that utilizes the recursive localizer */
export function handlebarsLocalizer(key, ...args) {
	let data = args[0];
	if (args.length === 1) { data = args[0].hash }
	if (key instanceof Handlebars.SafeString) {key = key.toString()}
	const localized = localizer(key, data);
	return localized;
};

/**
 * A localizer that allows recursively localizing strings so that localized strings
 * that want to use other localized strings can.
 *
 * @param {string} key The localization key to retrieve
 * @param {object?} args The arguments provided to the localizer for replacement
 * @param {number?} depth The current depth of the localizer
 * @returns The localized string
 */
export function localizer(key, args = {}, depth = 0) {
	/** @type {string} */
	let localized = game.i18n.format(key, args);
	const subkeys = localized.matchAll(/@(?<key>[a-zA-Z.]+)/gm);

	// Short-cut to help prevent infinite recursion
	if (depth > 10) {
		return localized;
	};

	/*
	Helps prevent localization on the same key so that we aren't doing excess work.
	*/
	const localizedSubkeys = new Map();
	for (const match of subkeys) {
		const subkey = match.groups.key;
		if (localizedSubkeys.has(subkey)) {continue}
		localizedSubkeys.set(subkey, localizer(subkey, args, depth + 1));
	};

	return localized.replace(
		/@(?<key>[a-zA-Z.]+)/gm,
		(_fullMatch, subkey) => {
			return localizedSubkeys.get(subkey);
		},
	);
};
