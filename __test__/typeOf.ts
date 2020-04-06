/* TODO: move to types.ts */
enum CommonDataTypes {
	undefined = 'undefined',
	null = 'null',
	Boolean = 'boolean',
	String = 'string',
	Number = 'number',
	Symbol = 'symbol',
	Array = 'array',
	Object = 'object',
	Function = 'function',
	GeneratorFunction = 'generatorFunction',
}

/* Global methods */
export const typeOf = (value: any): string => {
	/* undefined */
	if (value === undefined) return CommonDataTypes.undefined;
	else if (value === null) return CommonDataTypes.null;
	if (CommonDataTypes[value.constructor.name]) return CommonDataTypes[value.constructor.name];
	return value.constructor.name;
};

export const whichOneOfTypes = (value: any, types: string[]): string | false => {
	const _type = typeOf(value);
	return types.indexOf(_type) + 1 ? _type : false;
};

/* Private methods */
