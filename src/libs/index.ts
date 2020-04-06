export const assert = (parameters: {
	method?: {
		_function: Function;
		multiple?: { args: any; expect: any }[];
		description?: string;
		args?: any;
		expect?: any;
	};
	logIfFailOnly?: boolean;
	showOnlyFields?: string[];
}): void => {
	const {
		method: { _function, multiple, description, args, expect },
		logIfFailOnly,
		showOnlyFields,
	} = parameters;

	if (_function) {
		const tableLogs = [];
		if (multiple && multiple.length) {
			for (let i = 0; i < multiple.length; i++) {
				const _args = multiple[i].args;
				const result = _function.apply(null, _args);
				const record: any = {
					method: _function.name,
					arguments: _args,
					expect: multiple[i].expect,
					result: multiple[i].expect,
					equal: result === multiple[i].expect || JSON.stringify(result) === JSON.stringify(multiple[i].expect),
				};
				if (description) record.description = description.replace(/\$\{.+?}/g, (_) => eval(_.slice(2, -1)));
				if ((logIfFailOnly && !record.equal) || !logIfFailOnly) tableLogs.push(record);
				// debug('%O', myObject);
			}
			if (tableLogs.length) console.table(tableLogs, showOnlyFields);
		} else {
			const result = _function.apply(null, args);
			const record: any = {
				method: _function.name,
				arguments: args,
				expect,
				result,
				equal: result === expect || JSON.stringify(result) === JSON.stringify(expect),
			};
			if (description) record.description = description.replace(/\$\{.+?}/g, (_) => eval(_.slice(2, -1)));

			if ((logIfFailOnly && !record.equal) || !logIfFailOnly) console.table([record], showOnlyFields);
		}
	}
};
