import conf from '#conf'
import mysql from 'mysql2/promise'
const { host, user, port, password, database } = conf.mysql.connect

export default async () => {
	const connection = await mysql.createConnection({
		host,
		user,
		port,
		password
	})
	await connection.query(
		`create database if not exists ${database} default character set utf8mb4 default collate utf8mb4_bin`
	)
	await connection.end()
}
