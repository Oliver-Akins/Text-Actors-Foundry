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

	/**
	 * Asks the user to provide a simple piece of information, this is primarily
	 * intended to be used within macros so that it can have better info gathering
	 * as needed. This returns an object of input keys/labels to the value the user
	 * input for that label, if there is only one input, this will return the value
	 * without an object wrapper, allowing for easier access.
	 */
	static async ask(data, opts = {}) {
		if (!data.id) {
			throw new Error(`Asking the user for input must contain an ID`);
		}
		if (!data.inputs.length) {
			throw new Error(`Must include at least one input specification when prompting the user`);
		}

		let autofocusClaimed = false;
		for (const i of data.inputs) {
			i.id ??= foundry.utils.randomID(16);
			i.inputType ??= `text`;

			// Only ever allow one input to claim autofocus
			i.autofocus &&= !autofocusClaimed;
			autofocusClaimed ||= i.autofocus;

			// Set the value's attribute name if it isn't specified explicitly
			if (!i.valueAttribute) {
				switch (i.inputType) {
					case `checkbox`:
						i.valueAttribute = `checked`;
						break;
					default:
						i.valueAttribute = `value`;
				};
			};
		};

		opts.jQuery = true;
		data.default ??= `confirm`;
		data.title ??= `System Question`;

		data.content = await renderTemplate(
			`systems/${game.system.id}/templates/Dialogs/ask.hbs`,
			data,
		);

		return new Promise((resolve, reject) => {
			DialogManager.createOrFocus(
				data.id,
				{
					...data,
					buttons: {
						confirm: {
							label: `Confirm`,
							callback: (html) => {
								const answers = {};

								/*
								Retrieve the answer for every input provided using the ID
								determined during initial data prep, and assign the value
								to the property of the label in the object.
								*/
								for (const i of data.inputs) {
									const element = html.find(`#${i.id}`)[0];
									let value = element.value;
									switch (i.inputType) {
										case `number`:
											value = parseFloat(value);
											break;
										case `checkbox`:
											value = element.checked;
											break;
									}
									Logger.debug(`Ask response: ${value} (type: ${typeof value})`);
									answers[i.key ?? i.label] = value;
									if (data.inputs.length === 1) {
										resolve(value);
										return;
									}
								}

								resolve(answers);
							},
						},
						cancel: {
							label: `Cancel`,
							callback: () => reject(`User cancelled the prompt`),
						},
					},
				},
				opts,
			);
		});
	};

	static get size() {
		return DialogManager.#dialogs.size;
	}
};

globalThis.DialogManager = DialogManager;
