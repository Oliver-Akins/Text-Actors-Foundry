import { hideMessageText } from "./feature_flags/rollModeMessageContent.mjs";

Object.defineProperty(
	globalThis,
	`taf`,
	{
		value: Object.freeze({
			utils: Object.freeze({
				hideMessageText,
			}),
			FEATURES: Object.preventExtensions({
				ROLL_MODE_CONTENT: false,
				STORABLE_SHEET_SIZE: false,
			}),
		}),
		writable: false,
	},
);
