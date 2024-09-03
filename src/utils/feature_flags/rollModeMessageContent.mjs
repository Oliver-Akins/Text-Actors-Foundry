import { FEATURE_FLAGS } from "../../consts.mjs";

export function hideMessageText(content) {
	const featureFlags = game.settings.get(game.system.id, `flags`);
	const hideContent = featureFlags.includes(FEATURE_FLAGS.ROLLMODECONTENT);
	if (hideContent) {
		return `-=${content}=-`;
	}
	return content;
};
