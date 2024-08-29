import { StyledShadowElement } from "./mixins/Styles.mjs";
import { SystemIcon } from "./icon.mjs";

/**
Attributes:
@property {string} name - The path to the value to update
@property {number} value - The actual value of the input
@property {number} min - The minimum value of the input
@property {number} max - The maximum value of the input
@property {number?} smallStep - The step size used for the buttons and arrow keys
@property {number?} largeStep - The step size used for the buttons + Ctrl and page up / down

Styling:
- `--height`: Controls the height of the element + the width of the buttons (default: 1.25rem)
- `--width`: Controls the width of the number input (default 50px)
*/
export class SystemIncrementer extends StyledShadowElement(HTMLElement) {
	static elementName = `dd-incrementer`;
	static formAssociated = true;

	static _stylePath = `v1/components/incrementer.scss`;

	_internals;
	#input;

	_min;
	_max;
	_smallStep;
	_largeStep;

	constructor() {
		super();

		// Form internals
		this._internals = this.attachInternals();
		this._internals.role = `spinbutton`;
	};

	get form() {
		return this._internals.form;
	}

	get name() {
		return this.getAttribute(`name`);
	}
	set name(value) {
		this.setAttribute(`name`, value);
	}

	get value() {
		return this.getAttribute(`value`);
	};
	set value(value) {
		this.setAttribute(`value`, value);
	};

	get type() {
		return `number`;
	}

	connectedCallback() {
		super.connectedCallback();
		this.replaceChildren();

		// Attribute parsing / registration
		const value = this.getAttribute(`value`);
		this._min = parseInt(this.getAttribute(`min`) ?? 0);
		this._max = parseInt(this.getAttribute(`max`) ?? 0);
		this._smallStep = parseInt(this.getAttribute(`smallStep`) ?? 1);
		this._largeStep = parseInt(this.getAttribute(`largeStep`) ?? 5);

		this._internals.ariaValueMin = this._min;
		this._internals.ariaValueMax = this._max;

		const container = document.createElement(`div`);

		// The input that the user can see / modify
		const input = document.createElement(`input`);
		this.#input = input;
		input.type = `number`;
		input.ariaHidden = true;
		input.min = this.getAttribute(`min`);
		input.max = this.getAttribute(`max`);
		input.addEventListener(`change`, this.#updateValue.bind(this));
		input.value = value;

		// plus button
		const increment = document.createElement(SystemIcon.elementName);
		increment.setAttribute(`name`, `ui/plus`);
		increment.setAttribute(`var:size`, `0.75rem`);
		increment.setAttribute(`var:fill`, `currentColor`);
		increment.ariaHidden = true;
		increment.classList.value = `increment`;
		increment.addEventListener(`mousedown`, this.#increment.bind(this));

		// minus button
		const decrement = document.createElement(SystemIcon.elementName);
		decrement.setAttribute(`name`, `ui/minus`);
		decrement.setAttribute(`var:size`, `0.75rem`);
		decrement.setAttribute(`var:fill`, `currentColor`);
		decrement.ariaHidden = true;
		decrement.classList.value = `decrement`;
		decrement.addEventListener(`mousedown`, this.#decrement.bind(this));

		// Construct the DOM
		container.appendChild(decrement);
		container.appendChild(input);
		container.appendChild(increment);
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

	#updateValue() {
		let value = parseInt(this.#input.value);
		if (this.getAttribute(`min`)) {
			value = Math.max(this._min, value);
		}
		if (this.getAttribute(`max`)) {
			value = Math.min(this._max, value);
		}
		this.#input.value = value;
		this.value = value;
		this.dispatchEvent(new Event(`change`, { bubbles: true }));
	};

	/** @param {Event} $e */
	#increment($e) {
		$e.preventDefault();
		let value = parseInt(this.#input.value);
		value += $e.ctrlKey ? this._largeStep : this._smallStep;
		this.#input.value = value;
		this.#updateValue();
	};

	/** @param {Event} $e */
	#decrement($e) {
		$e.preventDefault();
		let value = parseInt(this.#input.value);
		value -= $e.ctrlKey ? this._largeStep : this._smallStep;
		this.#input.value = value;
		this.#updateValue();
	};
};
