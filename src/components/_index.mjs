import { SystemIcon } from "./icon.mjs";
import { SystemIncrementer } from "./incrementer.mjs";
import { SystemRange } from "./range.mjs";

/**
 * A list of element classes to register, expects all of them to have a static
 * property of "elementName" that is the namespaced name that the component will
 * be registered under. Any elements that are formAssociated have their name added
 * to the "CONFIG.CACHE.componentListeners" array and should be listened to for
 * "change" events in sheets.
 */
const components = [
	SystemIcon,
	SystemIncrementer,
	SystemRange,
];

export function registerCustomComponents() {
	(CONFIG.CACHE ??= {}).componentListeners ??= [];
	for (const component of components) {
		if (!window.customElements.get(component.elementName)) {
			console.debug(`${game.system.id} | Registering component "${component.elementName}"`);
			window.customElements.define(
				component.elementName,
				component,
			);
			if (component.formAssociated) {
				CONFIG.CACHE.componentListeners.push(component.elementName);
			}
		};
	};
};
