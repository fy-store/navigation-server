import type { ConfFiledList, FieldConfs, FieldResult, ListItem, ListItemCustom } from './types/index.js'
import { isArray, isString, isNumber, readonly, isObject, isUndefined } from 'uxiu'

export default (fieldConfs: FieldConfs[], data: object) => {
	let result = true
	const successList: ListItem[] = []
	const failList: ListItem[] = []
	const verifyList: ListItem[] = []

	fieldConfs.forEach((conf, fieldIndex) => {
		const { field, customs } = conf
		const info: ListItem = {
			field,
			data: data[field],
			result: true,
			required: createFieldResult(),
			type: createFieldResult(),
			length: createFieldResult(),
			range: createFieldResult(),
			customs: []
		}

		confFiledList.forEach((field) => {
			const { use, transform, verify } = conf[field]
			if (transform) {
				info.data = transform(info.data, readonly(conf))
			}

			if (use) {
				if (verify) {
					const verifyResult = verify(
						info.data,
						() => {
							return confConditionMap[field](conf, info)
						},
						readonly({
							field,
							fieldIndex,
							conf,
							info
						})
					)

					if (isObject(verifyResult)) {
						if (!verifyResult.result) {
							setFail(conf, info, field)
						}

						if (!isUndefined(verifyResult.message)) {
							info[field].message = String(verifyResult.message)
						}
					} else if (!verifyResult) {
						setFail(conf, info, field)
					}
				} else if (!confConditionMap[field](conf, info)) {
					setFail(conf, info, field)
				}
			}
		})

		// 自定义校验
		customs.forEach((custom, customIndex) => {
			const { verify } = custom

			const customResult = verify(
				info.data,
				readonly({
					field,
					fieldIndex,
					conf,
					info,
					custom,
					customIndex
				})
			)

			let itemResult: ListItemCustom = null
			if (isObject(customResult)) {
				itemResult = {
					name: custom.name,
					result: Boolean(customResult.result),
					message: isUndefined(customResult.message) ? '' : String(customResult.message)
				}
			} else {
				itemResult = {
					name: custom.name,
					result: Boolean(customResult),
					message: ''
				}
			}

			info.customs[customIndex] = itemResult
			if (!itemResult.result) {
				info.result = false
			}
		})

		if (info.result) {
			successList.push(info)
		} else {
			result = false
			failList.push(info)
		}
		verifyList.push(info)
	})

	return {
		result,
		successList,
		failList,
		verifyList
	}
}

export const confFiledList: ConfFiledList = ['required', 'type', 'length', 'range']

const createFieldResult = (): FieldResult => {
	return {
		result: true,
		message: ''
	}
}

const setFail = (conf: FieldConfs, info: ListItem, field: ConfFiledList[number]) => {
	info.result = false
	info[field].result = false
	info[field].message = conf[field].fail
}

/**
 * 是否通过校验映射表
 */
const confConditionMap: { [k in ConfFiledList[number]]: (conf: FieldConfs, info: ListItem) => boolean } = {
	required(conf: FieldConfs, info: ListItem) {
		const { required } = conf
		const { data } = info
		return required.expect && data !== void 0
	},

	type(conf: FieldConfs, info: ListItem) {
		const { type } = conf
		const { data } = info
		return type.checkFn(data)
	},

	length(conf: FieldConfs, info: ListItem) {
		const { length } = conf
		const { data } = info
		if (!(isArray(data) || isString(data))) {
			return false
		}
		return data.length >= length.expect.min && data.length <= length.expect.max
	},

	range(conf: FieldConfs, info: ListItem) {
		const { range } = conf
		const { data } = info
		if (!isNumber(data)) {
			return false
		}
		return data >= range.expect.min && data <= range.expect.max
	}
}
