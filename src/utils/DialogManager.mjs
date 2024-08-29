import { localizer } from "./localizer.mjs";

/**
 * A utility class that allows managing Dialogs that are created for various
 * purposes such as deleting items, help popups, etc. This is a singleton class
 * that upon instantiating after the first time will just return the first instance
 */
export class DialogManager {

	/** @type {Map<string, Dialog>} */
	static #dialogs = new Map();

	/**
	 * Focuses a dialog if it already exists, or creates a new one and renders it.
	 *
	 * @param {string} dialogId The ID to associate with the dialog, should be unique
	 * @param {object} data The data to pass to the Dialog constructor
	 * @param {DialogOptions} opts The options to pass to the Dialog constructor
	 * @returns {Dialog} The Dialog instance
	 */
	static async createOrFocus(dialogId, data, opts = {}) {
		if (DialogManager.#dialogs.has(dialogId)) {
			const dialog = DialogManager.#dialogs.get(dialogId);
			dialog.bringToTop();
			return dialog;
		};

		/*
		This makes sure that if I provide a close function as a part of the data,
		that the dialog still gets removed from the set once it's closed, otherwise
		it could lead to dangling references that I don't care to keep. Or if I don't
		provide the close function, it just sets the function as there isn't anything
		extra that's needed to be called.
		*/
		if (data?.close) {
			const provided = data.close;
			data.close = () => {
				DialogManager.#dialogs.delete(dialogId);
				provided();
			};
		} else {
			data.close = () => DialogManager.#dialogs.delete(dialogId);
		};

		// Create the Dialog with the modified data
		const dialog = new Dialog(data, opts);
		DialogManager.#dialogs.set(dialogId, dialog);
		dialog.render(true);
		return dialog;
	};

	/**
	 * Closes a dialog if it is rendered
	 *
	 * @param {string} dialogId The ID of the dialog to close
	 */
	static async close(dialogId) {
		const dialog = DialogManager.#dialogs.get(dialogId);
		dialog?.close();
	};

	static async helpDialog(
		helpId,
		helpContent,
		helpTitle = `dotdungeon.common.help`,
		localizationData = {},
	) {
		DialogManager.createOrFocus(
			helpId,
			{
				title: localizer(helpTitle, localizationData),
				content: localizer(helpContent, localizationData),
				buttons: {},
			},
			{ resizable: true },
		);
	};

	static get size() {
		return DialogManager.#dialogs.size;
	}
};
