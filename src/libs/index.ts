// Installed
import * as chalk from 'chalk';
import * as util from 'util';
import { table } from 'table';

// Internal
import { IFunction } from '../constants/types';

export function assert<TFunc extends IFunction>(parameters: {
	method?: {
		_function: TFunc;
		method_name?: string;
		multiple?: { args: Parameters<TFunc>; expect: ReturnType<TFunc> }[];
		description?: string;
		args?: Parameters<TFunc>;
		expect?: ReturnType<TFunc>;
	};
	logIfFailOnly?: boolean;
	showOnlyFields?: string[];
}): void {
	const {
		method: { _function, method_name, description, multiple, args, expect },
		logIfFailOnly,
		showOnlyFields,
	} = parameters;
	const methodName = _function.name || method_name;

	// tslint:disable-next-line: no-console
	console.time(methodName); /* Start timer */

	if (_function) {
		const tableLogs = [];
		if (multiple && multiple.length) {
			// tslint:disable-next-line: prefer-for-of
			for (let i = 0; i < multiple.length; i++) {
				const _args = multiple[i].args;
				const result = _function.apply(null, _args);
				const equal = result === multiple[i].expect || JSON.stringify(result) === JSON.stringify(multiple[i].expect);
				const record: any = {
					arguments: _args,
					expect: multiple[i].expect,
					result,
					equal: chalk[equal ? 'green' : 'red'](equal),
				};

				// if (_function.name) record.methodName = _function.name;
				// tslint:disable-next-line: no-eval
				if (description) record.description = description.replace(/\$\{.+?}/g, (_) => eval(_.slice(2, -1)));

				if ((logIfFailOnly && !record.equal) || !logIfFailOnly) tableLogs.push(record);
			}
			// console.log('tableLogs', tableLogs);
			// console.log('tableLogs key', tableLogs[0] && Object.keys(tableLogs[0]));
			// console.log('tableLogs values', tableLogs[0] && Object.values(tableLogs[0]));

			// tslint:disable-next-line: no-console
			if (tableLogs.length)
				console.log(
					// mapRecordToTable(tableLogs)

					table(mapRecordToTable(tableLogs))

					// util.inspect(mapRecordToTable(tableLogs), {
					// 	colors: true,
					// 	depth: null,
					// 	showHidden: false,
					// })
				);

			// tslint:disable-next-line: no-console
			// if (tableLogs.length) console.table(tableLogs, showOnlyFields);
			// tslint:disable-next-line: no-console
			console.timeEnd(methodName); /* Stop the timer */
		} else {
			const result = _function.apply(null, args);
			const equal = result === expect || JSON.stringify(result) === JSON.stringify(expect);
			const record: any = {
				method_name: _function.name || undefined,
				arguments: args,
				expect,
				result,
				equal: chalk[equal ? 'green' : 'red'](equal),
			};

			// if (_function.name) record.methodName = _function.name;
			// tslint:disable-next-line: no-eval
			if (description) record.description = description.replace(/\$\{.+?}/g, (_) => eval(_.slice(2, -1)));

			// tslint:disable-next-line: no-console
			if ((logIfFailOnly && !record.equal) || !logIfFailOnly) console.table([record], showOnlyFields);
			// tslint:disable-next-line: no-console
			console.timeEnd(methodName); /* Stop the timer */
		}
	}
}

const mapRecordToTable = (records: {}[]): any => {
	const result = [];
	for (let i = 0; i < records.length; i++) {
		const record = records[i];
		if (!i && record) {
			result.push(Object.keys(record).map((filedName) => chalk.blue(filedName)));
			result.push(Object.values(record));
		} else result.push(Object.values(record));
	}
	return result;
};
