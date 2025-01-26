import { isObject, isArray, readonly, isUndefined } from 'uxiu'
import type { FieldsOptions, MessageCollect, Options, Result } from './types/index.js'
import parseFieldsOptions from './parseFieldsOptions.js'
import verify, { confFiledList } from './verify.js'

export const createCheck = (fieldsOptions: FieldsOptions, options?: Options) => {
	if (!isArray(fieldsOptions)) {
		throw new TypeError('"options.fieldsOptions" must be an array')
	}

	if (!(isUndefined(options) || isObject(options))) {
		throw new TypeError('"options" must be an object')
	}

	const fieldConfs = parseFieldsOptions(fieldsOptions)

	return (data: object): Result => {
		if (!isObject(data)) {
			throw new TypeError('"data" must be an object')
		}

		const { result, successList, failList, verifyList } = verify(fieldConfs, data)
		const resultInfo: Result = {
			result,
			successList,
			failList,
			verifyList,
			fieldConfs: readonly(fieldConfs),
			get successCount() {
				return resultInfo.successList.length
			},
			get failCount() {
				return resultInfo.failList.length
			},

			get failMessageCollect() {
				const collect: MessageCollect = {}
				resultInfo.failList.forEach((it) => {
					confFiledList.forEach((k) => {
						if (!it[k].result) {
							if (!collect[it.field]) {
								collect[it.field] = []
							}
							collect[it.field].push(it[k].message)
						}
					})
					it.customs.forEach((custom) => {
						if (!collect[custom.name]) {
							collect[custom.name] = []
						}
						collect[custom.name].push(custom.message)
					})
				})
				return collect
			},
			get failMessageList() {
				const list = []
				resultInfo.failList.forEach((it) => {
					confFiledList.forEach((k) => {
						if (!it[k].result) {
							list.push(it[k].message)
						}
					})

					it.customs.forEach((custom) => {
						list.push(custom.message)
					})
				})
				return list
			}
		}

		return resultInfo
	}
}
