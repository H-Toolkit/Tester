import * as Tester from '../src/main';

const multiply = (x: number, y: number): number => {
	return x * y;
};

Tester.assert({ method: { _function: multiply, args: [3, 2], expect: 6 }, logIfFailOnly: true });
Tester.assert({ method: { _function: multiply, args: [3, 2], expect: 7 }, logIfFailOnly: true });
// Tester.assert({ method: { _function: multiply, args: [3, 2], expect: '6' }, logIfFailOnly: true });
Tester.assert({
	method: {
		_function: multiply,
		multiple: [
			{ args: [3, 2], expect: 6 },
			{ args: [3, 2], expect: 7 },
			// { args: [3, '2'], expect: '6' },
		],
		description: '${multiple[i].args[0]} * ${multiple[i].args[1]} = ${multiple[i].expect}',
	},
	logIfFailOnly: true,
	// showOnlyFields: ['expect', 'result', 'equal'],
});

const concat = (prm1: any, prm2: any): any => {
	if (Array.isArray(prm1) && Array.isArray(prm2)) return prm1.concat(prm2);
	if (prm1 && Array.isArray(prm2)) return prm1.concat(prm2);
	else return { ...prm1, ...prm2 };
};
Tester.assert<typeof concat>({
	method: {
		_function: concat,
		multiple: [
			{
				args: [
					[1, true],
					['any', 'true'],
				],
				expect: [1, true, 'any', true],
			},
			{
				args: [
					[1, true],
					['any', 'true'],
				],
				expect: [1, true, 'any', 'true'],
			},
			{
				args: [
					{ x1: 1, val: true },
					{ x2: 'any', val: 'true' },
				],
				expect: { x1: 1, val: 'true', x2: 'any' },
			},
			{
				args: [
					{ x1: 1, val: 'true' },
					{ x2: 'any', val: true },
				],
				expect: { x1: 1, val: 'true', x2: 'any' },
			},
		],
	},
	logIfFailOnly: true,
	// showOnlyFields: ['expect', 'result', 'equal'],
});

const pow = (num: number): number => {
	return num * num;
};

Tester.assert({
	method: {
		_function: pow,
		args: [3],
		expect: 6,
	},
	logIfFailOnly: true,
});

/* typeOf */
import { typeOf } from './typeOf';
interface Ix {}
const _interfacing: Ix = {};

class Classing {}
const _classing = new Classing();

enum _enum {}

Tester.assert({
	method: {
		_function: typeOf,
		method_name: 'typeOf',
		multiple: [
			{ args: [_classing], expect: 'Classing' },
			{ args: [_interfacing], expect: 'object' },
			{ args: [_enum], expect: 'object' },
		],
	},
	logIfFailOnly: true,
});
