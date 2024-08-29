import { createDocumentProxy } from "../../utils/createDocumentProxy.mjs";

/**
 * An object of Foundry-types to in-code Document classes.
 */
const classes = {};

/** The class that will be used if no type-specific class is defined */
const defaultClass = ActiveEffect;

export const ActiveEffectProxy = createDocumentProxy(defaultClass, classes);
