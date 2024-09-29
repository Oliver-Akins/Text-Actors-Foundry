import { hideMessageText } from "./feature_flags/rollModeMessageContent.mjs";

globalThis.taf = Object.freeze({
	utils: Object.freeze({
		hideMessageText,
	}),
	FEATURES: {
		ROLL_MODE_CONTENT: false,
		STORABLE_SHEET_SIZE: false,
	},
});
