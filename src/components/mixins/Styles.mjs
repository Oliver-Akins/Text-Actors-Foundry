/**
 * @param {HTMLElement} Base
 */
export function StyledShadowElement(Base) {
	return class extends Base {
		/**
		 * The path to the CSS that is loaded
		 * @type {string}
		 */
		static _stylePath;

		/**
		 * The stringified CSS to use
		 * @type {string}
		 */
		static _styles;

		/**
		 * The HTML element of the stylesheet
		 * @type {HTMLStyleElement}
		 */
		_style;

		/** @type {ShadowRoot} */
		_shadow;

		/**
		 * The hook ID for this element's CSS hot reload
		 * @type {number}
		 */
		#cssHmr;

		constructor() {
			super();

			this._shadow = this.attachShadow({ mode: `open` });
			this._style = document.createElement(`style`);
			this._shadow.appendChild(this._style);
		};

		#mounted = false;
		connectedCallback() {
			if (this.#mounted) { return }

			this._getStyles();

			if (game.settings.get(`dotdungeon`, `devMode`)) {
				this.#cssHmr = Hooks.on(`dd-hmr:css`, (data) => {
					if (data.path.endsWith(this.constructor._stylePath)) {
						this._style.innerHTML = data.content;
					};
				});
			};

			this.#mounted = true;
		};

		disconnectedCallback() {
			if (!this.#mounted) { return }
			if (this.#cssHmr != null) {
				Hooks.off(`dd-hmr:css`, this.#cssHmr);
				this.#cssHmr = null;
			};
			this.#mounted = false;
		};

		_getStyles() {
			if (this.constructor._styles) {
				this._style.innerHTML = this.constructor._styles;
			} else {
				fetch(`./systems/dotdungeon/.styles/${this.constructor._stylePath}`)
					.then(r => r.text())
					.then(t => {
						this.constructor._styles = t;
						this._style.innerHTML = t;
					});
			}
		};
	};
};
