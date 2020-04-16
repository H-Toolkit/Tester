type IFunction = (...arg: any) => any;

export function assert<TFunc extends IFunction>(parameters: {
	method: {
		_function: TFunc;
		method_name?: string;
		multiple?: { args: Parameters<TFunc>; expect: ReturnType<TFunc> }[];
		description?: string;
		args?: Parameters<TFunc>;
		expect?: ReturnType<TFunc>;
	};
	noLogFor?: Partial<{ succeeded: boolean; timer: boolean; table: boolean; all: boolean }>;
	showOnlyFields?: string[];
}): void {
	const { method, showOnlyFields, noLogFor } = parameters;
	const { succeeded: logIfFailOnly, timer: noTimer, table: noTable, all: noLogAtAll } = noLogFor || {};
	const { _function, method_name, description, multiple, args, expect } = method;

	const methodName = _function.name || method_name;
	if (!methodName) throw new Error('Must provide method name if anonymous function');

	// tslint:disable-next-line: no-console
	console.time(methodName); /* Start timer */

	if (_function) {
		const tableLogs = [];
		if (multiple && multiple.length) {
			// tslint:disable-next-line: prefer-for-of
			for (let i = 0; i < multiple.length; i++) {
				const _args = multiple[i].args;
				const result = _function.apply(null, _args);
				const record: any = {
					arguments: _args,
					expect: multiple[i].expect,
					result,
					equal: result === multiple[i].expect || JSON.stringify(result) === JSON.stringify(multiple[i].expect),
				};

				// if (_function.name) record.methodName = _function.name;
				// tslint:disable-next-line: no-eval
				if (description) record.description = description.replace(/\$\{.+?}/g, (_) => eval(_.slice(2, -1)));

				if ((logIfFailOnly && !record.equal) || !logIfFailOnly) tableLogs.push(record);
			}
			// tslint:disable-next-line: no-console
			if (!noTable && tableLogs.length && !noLogAtAll) console.table(tableLogs, showOnlyFields);
			// tslint:disable-next-line: no-console
			if (!noTimer && !noLogAtAll) console.timeEnd(methodName); /* Stop the timer */
		} else {
			const result = _function.apply(null, args!);
			const record: any = {
				method_name: _function.name || undefined,
				arguments: args,
				expect,
				result,
				equal: result === expect || JSON.stringify(result) === JSON.stringify(expect),
			};

			// if (_function.name) record.methodName = _function.name;
			// tslint:disable-next-line: no-eval
			if (description) record.description = description.replace(/\$\{.+?}/g, (_) => eval(_.slice(2, -1)));

			if ((!noTable && logIfFailOnly && !record.equal && !logIfFailOnly) || !noLogAtAll)
				// tslint:disable-next-line: no-console
				console.table([record], showOnlyFields);
			// tslint:disable-next-line: no-console
			if (!noTimer && !noLogAtAll) console.timeEnd(methodName); /* Stop the timer */
		}
	}
}
