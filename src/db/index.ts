export * from '@/db/api/index.js'
import initTable from '@/db/initTable/index.js'
import pool, { execute, query } from './connect/index.js'

if (initTable) {
	await initTable({ pool, execute, query })
}

const db = {
	pool,
	execute,
	query
}
export { db }
