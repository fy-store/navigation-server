import Path from 'path/posix'
import { isArray, isObject, isString, readonly } from 'uxiu'
import { pathToRegexp } from 'path-to-regexp'

export interface Identity<T> {
	// use?: (keyof T)[]
	base?: string
	router?: Route[]
	whiteRouter?: Route[]
}

export type Methods =
	| 'GET'
	| 'POST'
	| 'PUT'
	| 'DELETE'
	| 'PATCH'
	| 'HEAD'
	| 'OPTIONS'
	| 'CONNECT'
	| 'TRACE'
	| 'LINK'
	| 'UNLINK'
	| 'get'
	| 'post'
	| 'put'
	| 'delete'
	| 'patch'
	| 'head'
	| 'options'
	| 'connect'
	| 'trace'
	| 'link'
	| 'unlink'

export interface Route {
	path: string
	methods: '*' | Methods | Methods[]
}

export interface Options {
	base?: string
	router?: Route[]
	whiteRouter?: Route[]
}

export type UseRoute = {
	originnPath: string
	path: string
	regex: RegExp
	methods: Methods[]
}

export type UseIdenttiy = {
	id: string
	base: string
	router: UseRoute[]
	whiteRouter: UseRoute[]
}

export type UseConfig<T> = {
	[K in keyof T]: UseIdenttiy
}

export const createCheckPower = <T extends Record<string, any>>(
	config: {
		[K in keyof T]: Identity<T>
	}
	// options?: Options
) => {
	if (!isObject(config)) {
		throw new TypeError('"config" must be an object')
	}

	const useConfig: UseConfig<T> = Object.create(null) as UseConfig<T>

	Object.entries(config).forEach(([key, value]) => {
		if (!isObject(value)) {
			throw new TypeError(`"config.${key}" value must be an object`)
		}

		const { base = '/', router = [], whiteRouter = [] } = value
		if (!isString(base)) {
			throw new TypeError(`"config.${key}.base" must be a string`)
		}

		if (!isArray.all(router, whiteRouter)) {
			throw new TypeError(`"config.${key}.router | whiteRouter" must be an array`)
		}

		const useIdenttiy = {
			id: key,
			base,
			router: router.map((route: Route, index: number) => parseRoute(route, index, key, base)),
			whiteRouter: whiteRouter.map((route: Route, index: number) => parseRoute(route, index, key, base))
		}

		useConfig[key as keyof T] = useIdenttiy
	})

	const getIdentity = (identity: keyof T, method: Methods, path: string) => {
		const id = identity as string
		const useIdenttiy: UseIdenttiy = useConfig[id]
		if (!useIdenttiy) {
			return false
		}

		if (!isString.all(method, path)) {
			return false
		}

		return useIdenttiy
	}

	return {
		useConfig: readonly(useConfig),
		verify(identity: keyof T, method: Methods, path: string) {
			const useIdenttiy = getIdentity(identity, method, path)
			if (!useIdenttiy) {
				return false
			}

			const { whiteRouter, router } = useIdenttiy
			const fn = (route: UseRoute) => {
				if (route.methods.includes(method.toUpperCase() as Methods) && route.regex.test(path)) {
					return true
				}
			}
			const hasAdopt = whiteRouter.some(fn)

			if (hasAdopt) {
				return true
			}

			return router.some(fn)
		},

		hasRouter(identity: keyof T, method: Methods, path: string) {
			const useIdenttiy = getIdentity(identity, method, path)
			if (!useIdenttiy) {
				return false
			}
			const { router } = useIdenttiy
			return router.some((route: UseRoute) => {
				if (route.methods.includes(method.toUpperCase() as Methods) && route.regex.test(path)) {
					return true
				}
			})
		},

		hasWhiteRouter(identity: keyof T, method: Methods, path: string) {
			const useIdenttiy = getIdentity(identity, method, path)
			if (!useIdenttiy) {
				return false
			}
			const { whiteRouter } = useIdenttiy
			return whiteRouter.some((route: UseRoute) => {
				if (route.methods.includes(method.toUpperCase() as Methods) && route.regex.test(path)) {
					return true
				}
			})
		}
	}
}

const methodList: Methods[] = [
	'GET',
	'POST',
	'PUT',
	'DELETE',
	'PATCH',
	'HEAD',
	'OPTIONS',
	'CONNECT',
	'TRACE',
	'LINK',
	'UNLINK'
]
const parseRoute = (route: Route, index: number, key: string, base: string) => {
	if (!isObject(route)) {
		throw new TypeError(`"config.${key}.router[${index}]" must be an object`)
	}

	const { path, methods } = route
	if (!isString(path)) {
		throw new TypeError(`"config.${key}.router[${index}].path" must be a string`)
	}

	let useMethods: Methods[] = []
	const throwErr = new TypeError(`"config.${key}.router[${index}].methods" must be a ${methodList.join(' | ')}`)
	if (methods === '*') {
		useMethods = [...methodList]
	} else if (isString(methods)) {
		const method = methods.toUpperCase() as Methods
		if (!methodList.includes(method)) {
			throw throwErr
		}
		useMethods = [method]
	} else if (isArray(methods)) {
		methods.forEach((method) => {
			if (!isString(method)) {
				throw throwErr
			}
			method = method.toUpperCase() as Methods
			if (!methodList.includes(method)) {
				throw throwErr
			}
			useMethods.push(method)
		})
	} else {
		throw throwErr
	}

	const combinationPath = Path.join(base, path)
	return {
		originnPath: path,
		path: combinationPath,
		regex: pathToRegexp(combinationPath, { sensitive: true }).regexp,
		methods: useMethods
	}
}
