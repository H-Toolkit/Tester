import { RequireOnlyOne } from '../types/RequireOnlyOne';
type TFunc = (...arg: any) => any;
type TMultiple<T extends TFunc> = { args: Parameters<T>; expect: ReturnType<T> }[];
type tableFields = 'arguments' | 'expect' | 'result' | 'equal' | 'methodName' | 'description';
type TAssert<T extends TFunc> = {
	method: {
		_function: T;
		method_name?: string;
		description?: string;
	} & RequireOnlyOne<{
		multiple?: TMultiple<T>;
		args?: Parameters<T>;
	}> &
		RequireOnlyOne<{
			multiple?: TMultiple<T>;
			expect?: ReturnType<T>;
		}>;
	noLogFor?: Partial<{
		succeeded: boolean;
		table: boolean;
		all: boolean;
		timer: boolean;
	}>;
	showOnlyFields?: tableFields[];
};

export function assert<T extends TFunc>(parameters: TAssert<T>): void {
	const { method, showOnlyFields, noLogFor } = parameters;
	const { succeeded: noLogForSucceeded, timer: noLogForTimer, table: noLogForTable, all: noLogForAll } = noLogFor || {};
	const { _function, method_name, description, multiple, args, expect } = method;
	const methodName = _function.name || method_name;
	if (!methodName) throw new Error('Must provide method name if anonymous function');

	// tslint:disable-next-line: no-console
	console.time(methodName); /* Start timer */

	if (_function) {
		if (multiple && multiple.length) {
			const logsArr = [];
			// tslint:disable-next-line: prefer-for-of
			for (let i = 0; i < multiple.length; i++) {
				const _args = multiple[i].args;
				const result = _function.apply(null, _args);
				const record: any = {
					methodName,
					arguments: _args,
					expect: multiple[i].expect,
					result,
					equal: result === multiple[i].expect || JSON.stringify(result) === JSON.stringify(multiple[i].expect),
				};
				// tslint:disable-next-line: no-eval
				if (description) record.description = description.replace(/\$\{.+?}/g, (_) => eval(_.slice(2, -1)));

				if (!(record.equal && noLogForSucceeded)) logsArr.push(record);
			}
			// tslint:disable-next-line: no-console
			if (!noLogForTable && !noLogForAll && !(noLogForSucceeded && !logsArr.length)) console.table(logsArr, showOnlyFields);
			// tslint:disable-next-line: no-console
			if (!noLogForTimer && !noLogForAll) console.timeEnd(methodName); /* Stop the timer */
		} else {
			const result = _function.apply(null, args!);
			const record: any = {
				methodName,
				arguments: args,
				expect,
				result,
				equal: result === expect || JSON.stringify(result) === JSON.stringify(expect),
			};
			// tslint:disable-next-line: no-eval
			if (description) record.description = description.replace(/\$\{.+?}/g, (_) => eval(_.slice(2, -1)));

			// tslint:disable-next-line: no-console
			if (!(noLogForSucceeded && record.equal) && !noLogForTable && !noLogForAll) console.table([record], showOnlyFields);

			// tslint:disable-next-line: no-console
			if (!noLogForTimer && !noLogForAll) console.timeEnd(methodName); /* Stop the timer */
		}
	}
}
