// Document Imports
import { ActiveEffectProxy } from "./documents/ActiveEffect/_proxy.mjs";
import { ActorProxy } from "./documents/Actor/_proxy.mjs";
import { ChatMessageProxy } from "./documents/ChatMessage/_proxy.mjs";
import { ItemProxy } from "./documents/Item/_proxy.mjs";

// DataModel Imports
import { PlayerData } from "./documents/Actor/Player/Model.mjs";

// Misc Imports
import "./utils/logger.mjs";
import "./utils/DialogManager.mjs";
import { registerCustomComponents } from "./components/_index.mjs";
import { registerHandlebarsHelpers } from "./helpers/_index.mjs";
import { registerSettings } from "./settings/_index.mjs";
import { registerSheets } from "./sheets/_index.mjs";

// MARK: init hook
Hooks.once(`init`, () => {
	Logger.info(`Initializing`);
	CONFIG.ActiveEffect.legacyTransferral = false;

	registerSettings();

	// Data Models
	CONFIG.Actor.dataModels.player = PlayerData;

	// Update document classes
	CONFIG.Actor.documentClass = ActorProxy;
	CONFIG.Item.documentClass = ItemProxy;
	CONFIG.ActiveEffect.documentClass = ActiveEffectProxy;
	CONFIG.ChatMessage.documentClass = ChatMessageProxy;
	registerSheets();

	registerHandlebarsHelpers();

	registerCustomComponents();
});


// MARK: ready hook
Hooks.once( `ready`, () => {
	Logger.info(`Ready`);

	let defaultTab = game.settings.get(game.system.id, `defaultTab`);
	if (defaultTab) {
		if (!ui.sidebar?.tabs?.[defaultTab]) {
			Logger.error(`Couldn't find a sidebar tab with ID:`, defaultTab);
		} else {
			Logger.debug(`Switching sidebar tab to:`, defaultTab);
			ui.sidebar.tabs[defaultTab].activate();
		};
	};
});
