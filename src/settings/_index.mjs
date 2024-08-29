import { registerClientSettings } from "./client_settings.mjs";
import { registerDevSettings } from "./dev_settings.mjs";
import { registerWorldSettings } from "./world_settings.mjs";

export function registerSettings() {
	Logger.debug(`Registering settings`);
	registerClientSettings();
	registerWorldSettings();
	registerDevSettings();
};
