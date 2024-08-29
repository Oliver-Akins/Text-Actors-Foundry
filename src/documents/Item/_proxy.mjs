import { createDocumentProxy } from "../../utils/createDocumentProxy.mjs";

/**
 * An object of Foundry-types to in-code Document classes.
 */
const classes = {};

/** The class that will be used if no type-specific class is defined */
const defaultClass = Item;

export const ItemProxy = createDocumentProxy(defaultClass, classes);
