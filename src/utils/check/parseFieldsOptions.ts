import type {
	FieldOptions,
	FieldConfs,
	RequiredConf,
	FieldConf,
	TypeConf,
	TypeExpect,
	LengthConf,
	RangeConf,
	CheckTypeMap,
	HookOptions,
	ConfFiledList,
	Custom
} from './types/index.js'
import {
	isObject,
	isString,
	isBoolean,
	isUndefined,
	isEffectiveNumber,
	isNumber,
	isEffectiveStrNumber,
	isFunction,
	isArray
} from 'uxiu'

export const throwErr = (field: string, needType: string, fromIndex: number) => {
	throw new TypeError(
		`"fieldsOptions -> ${field ? 'item.' + field : ''}" must be a ${needType}, error from "fieldsOptions[${fromIndex}]${
			field ? '.' + field : ''
		}"`
	)
}

export default (fieldsOptions: FieldOptions[]): FieldConfs[] => {
	const fieldConfs: FieldConfs[] = []
	fieldsOptions.forEach((fieldOptions, i) => {
		if (!isObject(fieldOptions)) {
			throwErr('', 'object', i)
		}

		const field = parseField(fieldOptions, i)
		const required = parseRequired(fieldOptions, i)
		const type = parseType(fieldOptions, i)
		const length = parseLength(fieldOptions, i)
		const range = parseRange(fieldOptions, i)
		const customs = parseCustoms(fieldOptions, i)

		fieldConfs.push({
			field,
			required,
			type,
			length,
			range,
			customs
		})
	})
	return fieldConfs
}

const parseField = ({ field }: FieldOptions, i: number): FieldConf => {
	if (!isString(field)) {
		throwErr('field', 'string', i)
	}
	return field
}

const parseRequired = ({ required }: FieldOptions, i: number): RequiredConf => {
	if (isUndefined(required)) {
		return {
			use: false,
			expect: false,
			success: '',
			fail: '',
			transform: void 0,
			verify: void 0
		}
	}

	if (!isObject(required)) {
		throwErr('required', 'object', i)
	}

	const { expect, success = '', fail = '', transform, verify } = required

	if (!isBoolean(expect)) {
		throwErr('required.expect', 'boolean', i)
	}

	chekcHook(required, 'required', i)

	return {
		use: true,
		expect,
		success,
		fail,
		transform,
		verify
	}
}

const typeExpect: TypeExpect[] = [
	'any',
	'number',
	'effectiveNumber',
	'effectiveStrNumber',
	'effectiveStrInt',
	'effectiveStrPositiveInt',
	'string'
]
const checkTypeMap: CheckTypeMap = {
	any: () => true,
	number: isNumber,
	effectiveNumber: isEffectiveNumber,
	effectiveStrNumber: isEffectiveStrNumber,
	effectiveStrInt(data: any) {
		return isEffectiveStrNumber(data) && Number.isInteger(+data)
	},
	effectiveStrPositiveInt(data: any) {
		return isEffectiveStrNumber(data) && Number.isInteger(+data) && +data > 0
	},
	string: isString
}
const parseType = ({ type }: FieldOptions, i: number): TypeConf => {
	if (isUndefined(type)) {
		return {
			use: false,
			expect: 'any',
			success: '',
			fail: '',
			checkFn: checkTypeMap['any'],
			transform: void 0,
			verify: void 0
		}
	}

	if (!isObject(type)) {
		throwErr('type', 'object', i)
	}

	const { expect, success = '', fail = '', transform, verify } = type

	if (!typeExpect.includes(expect)) {
		throwErr('type.expect', typeExpect.toString(), i)
	}

	chekcHook(type, 'type', i)

	return {
		use: true,
		expect,
		success,
		fail,
		checkFn: checkTypeMap[expect],
		transform,
		verify
	}
}

const parseLength = ({ length }: FieldOptions, i: number): LengthConf => {
	if (isUndefined(length)) {
		return {
			use: false,
			expect: {
				min: 0,
				max: Infinity
			},
			success: '',
			fail: '',
			transform: void 0,
			verify: void 0
		}
	}

	if (!isObject(length)) {
		throwErr('length', 'object', i)
	}

	let { expect, success = '', fail = '', transform, verify } = length

	if (isUndefined(expect)) {
		expect = {
			min: 0,
			max: Infinity
		}
	} else {
		if (!isObject(expect)) {
			throwErr('length.expect', 'object', i)
		}

		expect = {
			max: expect.max,
			min: expect.min
		}

		if (!Number.isInteger(expect.min)) {
			throwErr('length.expect.min', 'integer', i)
		}

		if (!Number.isInteger(expect.max)) {
			throwErr('length.expect.max', 'integer', i)
		}
	}

	chekcHook(length, 'length', i)

	return {
		use: true,
		expect,
		success,
		fail,
		transform,
		verify
	}
}

const parseRange = ({ range }: FieldOptions, i: number): RangeConf => {
	if (isUndefined(range)) {
		return {
			use: false,
			expect: {
				min: -Infinity,
				max: Infinity
			},
			success: '',
			fail: '',
			transform: void 0,
			verify: void 0
		}
	}

	if (!isObject(range)) {
		throwErr('range', 'object', i)
	}

	let { expect, success = '', fail = '', transform, verify } = range

	if (isUndefined(expect)) {
		expect = {
			min: -Infinity,
			max: Infinity
		}
	} else {
		if (!isObject(expect)) {
			throwErr('range.expect', 'object', i)
		}

		expect = {
			max: expect.max,
			min: expect.min
		}

		if (!isEffectiveNumber(expect.min)) {
			throwErr('range.expect.min', 'effective number', i)
		}

		if (!isEffectiveNumber(expect.max)) {
			throwErr('range.expect.max', 'effective number', i)
		}
	}

	chekcHook(range, 'range', i)

	return {
		use: true,
		expect,
		success,
		fail,
		transform,
		verify
	}
}

const parseCustoms = ({ customs }: FieldOptions, i: number): Custom[] => {
	if (isUndefined(customs)) {
		return []
	}

	if (!isArray(customs)) {
		throwErr('customs', 'array', i)
	}

	return customs.map((custom, j) => {
		if (!isObject(custom)) {
			throwErr('customs', 'object', i)
		}

		const { name, verify } = custom

		if (!isString(name)) {
			throwErr(`customs[${j}].name`, 'string', i)
		}

		if (!isFunction(verify)) {
			throwErr(`customs[${j}].verify`, 'function', i)
		}

		return {
			name,
			verify
		}
	})
}

const chekcHook = (options: HookOptions, field: ConfFiledList[number], fromIndex: number) => {
	const { success = '', fail = '', transform, verify } = options
	if (!isString(success)) {
		throwErr(`${field}.success`, 'string', fromIndex)
	}

	if (!isString(fail)) {
		throwErr(`${field}.fail`, 'string', fromIndex)
	}

	if (!(isUndefined(transform) || isFunction(transform))) {
		throwErr(`${field}.transform`, 'function', fromIndex)
	}

	if (!(isUndefined(verify) || isFunction(verify))) {
		throwErr(`${field}.verify`, 'function', fromIndex)
	}
}
