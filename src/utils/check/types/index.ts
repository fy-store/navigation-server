export type HookOptionsVerifyCtx = {
	field: string
	fieldIndex: number
	conf: FieldConfs
	info: ListItem
}
export type HookOptions = {
	success?: string
	fail?: string
	transform?: (data: any, fieldConfs: FieldConfs) => any
	verify?: (
		data: any,
		checkFn: () => boolean,
		ctx: HookOptionsVerifyCtx
	) => boolean | { result: boolean; message: string }
}

export type RequiredOptions = HookOptions & {
	expect: boolean
}

export type TypeOptions = HookOptions & {
	expect: TypeExpect
}

export type LengthOptions = HookOptions & {
	expect: {
		min: number
		max: number
	}
}

export type RangeOptions = HookOptions & {
	expect: {
		min: number
		max: number
	}
}
export type CustomCtx = {
	field: string
	fieldIndex: number
	conf: FieldConfs
	info: ListItem
	custom: Custom
	customIndex: number
}

export type Custom = {
	name: string
	verify: (data: any, ctx: Readonly<CustomCtx>) => boolean | { result: boolean; message: string }
}

export interface FieldOptions {
	field: string
	required?: RequiredOptions
	type?: TypeOptions
	length?: LengthOptions
	range?: RangeOptions
	customs?: Custom[]
}

export type FieldsOptions = FieldOptions[]

// 扩展选项, 待补充
export interface Options {}

export type FiledConf = {
	use: boolean
	success: string
	fail: string
	transform?: (data: any, fieldOptions: FieldOptions) => any
	verify?: (
		data: any,
		checkFn: () => boolean,
		ctx: HookOptionsVerifyCtx
	) => boolean | { result: boolean; message: string }
}
export type FieldConf = string

export type RequiredConf = FiledConf & {
	expect: boolean
}

export type TypeExpect =
	| 'any'
	| 'number'
	| 'effectiveNumber'
	| 'effectiveStrNumber'
	| 'effectiveStrInt'
	| 'effectiveStrPositiveInt'
	| 'string'

export type CheckTypeMap = {
	[k in TypeExpect]: (...args: any) => boolean
}

export type TypeConf = FiledConf & {
	expect: TypeExpect
	checkFn: (...args: any) => boolean
}

export type LengthConf = FiledConf & {
	expect: {
		min: number
		max: number
	}
}

export type RangeConf = FiledConf & {
	expect: {
		min: number
		max: number
	}
}

export type FieldConfs = {
	field: FieldConf
	required: RequiredConf
	type: TypeConf
	length: LengthConf
	range: RangeConf
	customs: Custom[]
}

export type ConfFiledList = ['required', 'type', 'length', 'range']

export type FieldResult = {
	result: boolean
	message: string
}

export type ListItemCustom = { name: string } & FieldResult

export type ListItem = {
	data: any
	result: boolean
	field: FieldConf
	required: FieldResult
	type: FieldResult
	length: FieldResult
	range: FieldResult
	customs: ListItemCustom[]
}

export type MessageCollect = {
	[k: string]: string[]
}

export interface Result {
	result: boolean
	successCount: number
	failCount: number
	successList: ListItem[]
	failList: ListItem[]
	failMessageCollect: MessageCollect
	failMessageList: string[]
	verifyList: ListItem[]
	fieldConfs: readonly FieldConfs[]
}
