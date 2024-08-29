import { StyledShadowElement } from "./mixins/Styles.mjs";

/**
Attributes:
@property {string} name - The path to the value to update in the datamodel
@property {number} value - The actual value of the input
@property {number} max - The maximum value that this range has

@extends {HTMLElement}
*/
export class SystemRange
	extends StyledShadowElement(
		HTMLElement,
		{ mode: `open`, delegatesFocus: true },
	) {
	static elementName = `dd-range`;
	static formAssociated = true;

	static observedAttributes = [`max`];

	static _stylePath = `v3/components/range.css`;

	_internals;
	#input;

	constructor() {
		super();

		// Form internals
		this._internals = this.attachInternals();
		this._internals.role = `spinbutton`;
	};

	get form() {
		return this._internals.form;
	};

	get name() {
		return this.getAttribute(`name`);
	};
	set name(value) {
		this.setAttribute(`name`, value);
	};

	get value() {
		try {
			return parseInt(this.getAttribute(`value`));
		} catch {
			throw new Error(`Failed to parse attribute: "value" - Make sure it's an integer`);
		};
	};
	set value(value) {
		this.setAttribute(`value`, value);
	};

	get max() {
		try {
			return parseInt(this.getAttribute(`max`));
		} catch {
			throw new Error(`Failed to parse attribute: "max" - Make sure it's an integer`);
		};
	};
	set max(value) {
		this.setAttribute(`max`, value);
	};

	get type() {
		return `number`;
	};

	connectedCallback() {
		super.connectedCallback();

		// Attribute validation
		if (!this.hasAttribute(`max`)) {
			throw new Error(`dotdungeon | Cannot have a range without a maximum value`);
		};

		// Keyboard accessible input for the thing
		this.#input = document.createElement(`input`);
		this.#input.type = `number`;
		this.#input.min = 0;
		this.#input.max = this.max;
		this.#input.value = this.value;
		this.#input.addEventListener(`change`, () => {
			const inputValue = parseInt(this.#input.value);
			if (inputValue === this.value) { return };
			this._updateValue.bind(this)(Math.sign(this.value - inputValue));
			this._updateValue(Math.sign(this.value - inputValue));
		});
		this._shadow.appendChild(this.#input);

		// Shadow-DOM construction
		this._elements = new Array(this.max);
		const container = document.createElement(`div`);
		container.classList.add(`container`);

		// Creating the node for filled content
		const filledContainer = document.createElement(`div`);
		filledContainer.classList.add(`range-increment`, `filled`);
		const filledNode = this.querySelector(`[slot="filled"]`);
		if (filledNode) { filledContainer.appendChild(filledNode) };

		const emptyContainer = document.createElement(`div`);
		emptyContainer.classList.add(`range-increment`, `empty`);
		const emptyNode = this.querySelector(`[slot="empty"]`);
		if (emptyNode) { emptyContainer.appendChild(emptyNode) };

		this._elements.fill(filledContainer, 0, this.value);
		this._elements.fill(emptyContainer, this.value);
		container.append(...this._elements.map((slot, i) => {
			const node = slot.cloneNode(true);
			node.setAttribute(`data-index`, i + 1);
			node.addEventListener(`click`, () => {
				const filled = node.classList.contains(`filled`);
				this._updateValue(filled ? -1 : 1);
			});
			return node;
		}));
		this._shadow.appendChild(container);

		/*
		This converts all of the namespace prefixed properties on the element to
		CSS variables so that they don't all need to be provided by doing style=""
		*/
		for (const attrVar of this.attributes) {
			if (attrVar.name?.startsWith(`var:`)) {
				const prop = attrVar.name.replace(`var:`, ``);
				this.style.setProperty(`--` + prop, attrVar.value);
			};
		};
	};

	_updateValue(delta) {
		this.value += delta;
		this.dispatchEvent(new Event(`change`, { bubbles: true }));
	};
};
