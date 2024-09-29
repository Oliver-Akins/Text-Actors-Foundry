import { DialogManager } from "../../utils/DialogManager.mjs";

/**
 * This mixin allows making a class so that it can store the width/height data
 * to the sheet or localhost in order to make using the text sheets a lil nicer.
 *
 * @param {ActorSheet|ItemSheet} cls The Sheet class to augment
 * @returns The augmented class
 */
export function SizeStorable(cls) {

	// Don't augment class when the feature isn't enabled
	if (!taf.FEATURES.STORABLE_SHEET_SIZE) {
		return cls;
	}

	return class SizeStorableClass extends cls {
		constructor(doc, opts) {

			/*
			Find the saved size of the sheet, it takes the following order of precedence
			from highest to lowest:
				- Locally saved
				- Default values on actor
				- Default values from constructor
			*/
			/** @type {string|undefined} */
			let size = localStorage.getItem(`${game.system.id}.size:${doc.uuid}`);
			size ??= doc.getFlag(game.system.id, `size`);

			// Apply the saved value to the options
			if (size) {
				const [ width, height ] = size.split(`,`);
				opts.width = width;
				opts.height = height;
			};

			super(doc, opts);
		};

		get hasLocalSize() {
			return localStorage.getItem(`${game.system.id}.size:${this.object.uuid}`) != null;
		};

		get hasGlobalSize() {
			return this.object.getFlag(game.system.id, `size`) != null;
		};

		_getHeaderButtons() {
			return [
				{
					class: `size-save`,
					icon: `fa-solid fa-floppy-disk`,
					label: `Save Size`,
					onclick: () => {

						const buttons = {
							saveGlobal: {
								label: `Save Global Size`,
								callback: () => {
									this.object.setFlag(
										game.system.id,
										`size`,
										`${this.position.width},${this.position.height}`,
									);
								},
							},
							saveLocal: {
								label: `Save For Me Only`,
								callback: () => {
									localStorage.setItem(
										`${game.system.id}.size:${this.object.uuid}`,
										`${this.position.width},${this.position.height}`,
									);
								},
							},
						};

						// Add resets if there is a size already
						if (this.hasGlobalSize) {
							buttons.resetGlobal = {
								label: `Reset Global Size`,
								callback: () => {
									this.object.unsetFlag(game.system.id, `size`);
								},
							};
						};

						if (this.hasLocalSize) {
							buttons.resetLocal = {
								label: `Reset Size For Me Only`,
								callback: () => {
									localStorage.removeItem(`${game.system.id}.size:${this.object.uuid}`);
								},
							};
						};

						// When a non-GM is using this system, we only want to save local sizes
						if (!game.user.isGM) {
							delete buttons.saveGlobal;
							delete buttons.resetGlobal;
						};

						DialogManager.createOrFocus(
							`${this.object.uuid}:size-save`,
							{
								title: `Save size of sheet: ${this.title}`,
								content: `Saving the size of this sheet will cause it to open at the size it is when you press the save button`,
								buttons,
								render: (html) => {
									const el = html[2];
									el.style = `display: grid; grid-template-columns: 1fr 1fr; gap: 8px;`;
								},
							},
							{
								jQuery: true,
							},
						);
					},
				},
				...super._getHeaderButtons(),
			];
		};
	};
};
