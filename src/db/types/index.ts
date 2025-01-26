import mysql from 'mysql2/promise'

export type Query = {
	(sql: string, query?: any[], toJSON?: boolean): Promise<[any[], any]>
	notLog(sql: string, query?: any[]): Promise<[any[], any]>
}
export type Execute = {
	(sql: string, query?: any[], toJSON?: boolean): Promise<[any[], any]>
	notLog(sql: string, query?: any[]): Promise<[any[], any]>
}

/**
 * db 上下文
 */
export interface TDbCtx {
	/**
	 * 数据库实例
	 */
	pool: mysql.Pool
	/**
	 * 用于操作数据库
	 */
	query: Query
	/**
	 * 用于操作数据库(带缓存优化)
	 */
	execute: Execute
}

/**
 * 初始化 table
 */
export interface InitTable {
	(ctx: TDbCtx): void | Promise<void>
}
