import init from './init.js'
import mysql2 from 'mysql2/promise'
import { mysql } from '#conf'
import { isNumber } from 'uxiu'
import { logger } from '#common'
import type { Execute, Query } from '@/db/types/index.js'
const { host, port, database, user, password } = mysql.connect

await init()

// 创建连接池
const pool = mysql2.createPool({
	host,
	port,
	database,
	user,
	password,
	charset: 'utf8mb4',
	multipleStatements: true,
	waitForConnections: true,
	connectionLimit: 10,
	queueLimit: 0,
	enableKeepAlive: true,
	keepAliveInitialDelay: 0,
	maxIdle: 10,
	idleTimeout: 0
})

export const execute: Execute = async (sql: string, query = [], toJSON) => {
	try {
		const result: any = await pool.execute(
			sql,
			query.map((it) => (isNumber(it) ? String(it) : it))
		)
		const data = {
			sql: sql.trim().replace(/\s+/g, ' '),
			query,
			result: toJSON ? JSON.stringify(result, null, 2) : `tip: 日志隐藏数据, data -> length = ${result.length}`
		}
		logger.db.info(data)
		return result
	} catch (error) {
		const data = { sql: sql.trim().replace(/\s+/g, ' '), query, error }
		logger.db.error(data)
		error.sql = data.sql
		error.sqlQuery = data.query
		throw error
	}
}

execute.notLog = async (sql: string, query = []) => {
	try {
		return await pool.execute(
			sql,
			query.map((it) => (isNumber(it) ? String(it) : it))
		)
	} catch (error) {
		const data = { sql: sql.trim().replace(/\s+/g, ' '), query, error }
		logger.db.error(data)
		error.sql = data.sql
		error.sqlQuery = data.query
		throw error
	}
}

export const query: Query = async (sql: string, query = [], toJSON) => {
	try {
		const result: any = await pool.query(sql, query)
		const data = {
			sql: sql.trim().replace(/\s+/g, ' '),
			query,
			result: toJSON ? JSON.stringify(result, null, 2) : `tip: 日志隐藏数据, data -> length = ${result.length}`
		}
		logger.db.info(data)
		return result
	} catch (error) {
		const data = { sql: sql.trim().replace(/\s+/g, ' '), query, error }
		logger.db.error(data)
		error.sql = data.sql
		error.sqlQuery = data.query
		throw error
	}
}

query.notLog = async (sql: string, query = []) => {
	try {
		return await pool.query(
			sql,
			query.map((it) => (isNumber(it) ? String(it) : it))
		)
	} catch (error) {
		const data = { sql: sql.trim().replace(/\s+/g, ' '), query, error }
		logger.db.error(data)
		error.sql = data.sql
		error.sqlQuery = data.query
		throw error
	}
}

export default {
	pool,
	query,
	execute
}
