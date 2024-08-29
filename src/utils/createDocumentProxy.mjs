export function createDocumentProxy(defaultClass, classes) {
	// eslint-disable-next-line func-names
	return new Proxy(function () {}, {
		construct(_target, args) {
			const [data] = args;

			if (!classes[data.type]) {
				return new defaultClass(...args);
			}

			return new classes[data.type](...args);
		},
		get(_target, prop, _receiver) {

			if ([`create`, `createDocuments`].includes(prop)) {
				return (data, options) => {
					if (data.constructor === Array) {
						return data.map(i => this.constructor.create(i, options));
					}

					if (!classes[data.type]) {
						return defaultClass.create(data, options);
					}

					return classes[data.type].create(data, options);
				};
			};

			if (prop == Symbol.hasInstance) {
				return (instance) => {
					if (instance instanceof defaultClass) {return true}
					return Object.values(classes).some(i => instance instanceof i);
				};
			};

			return defaultClass[prop];
		},
	});
};
