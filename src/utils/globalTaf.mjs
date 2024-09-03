import { FEATURE_FLAGS } from "../consts.mjs";
import { hideMessageText } from "./feature_flags/rollModeMessageContent.mjs";

globalThis.taf = Object.freeze({
	utils: {
		hideMessageText,
	},
	const: {
		FEATURE_FLAGS,
	},
});
