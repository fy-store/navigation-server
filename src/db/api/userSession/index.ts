import { mysql } from '#conf'
import { execute } from '#dbConnect'
const { userSession } = mysql.tables
export const getList = () => {
	const sql = /*sql*/ `
    select session_id as sessionId, session_value as sessionValue from ${userSession.name} where delete_time is null
    `
	return execute.notLog(sql)
}

type CreateParams = { sessionId: string; sessionValue: object }
export const create = (params: CreateParams) => {
	const sql = /*sql*/ `
    insert into ${userSession.name} (session_id, session_value) 
	values (?, ?)
    `
	return execute.notLog(sql, [params.sessionId, params.sessionValue])
}

export const deleteById = (id: number) => {
	const sql = /*sql*/ `
    update ${userSession.name} set delete_time = now() where id = ?
    `
	return execute.notLog(sql, [id])
}

export const deleteBySessionId = (sessionId: string) => {
	const sql = /*sql*/ `
    update ${userSession.name} set delete_time = now() where session_id = ?
    `
	return execute.notLog(sql, [sessionId])
}

type UpdateParams = { sessionId: string; sessionValue: object }

export const updateBySessionId = (params: UpdateParams) => {
	const sql = /*sql*/ `
    update ${userSession.name} set session_value = ? where session_id = ?
    `
	return execute.notLog(sql, [params.sessionValue, params.sessionId])
}
