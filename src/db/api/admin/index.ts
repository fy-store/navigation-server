import { mysql } from '#conf'
import { execute } from '#dbConnect'
const { admin } = mysql.tables

type GetListParams = {
	name?: string
	page: number
	size: number
}

export const getList = (params: GetListParams, allInfo?: boolean) => {
	const sql = /*sql*/ `
        select id, name, account, create_time as createTime, update_time as updateTime ${allInfo ? ', delete_time, password' : ''}
		from ${admin.name} 
		where ${params.name !== void 0 ? "name like concat('%', ?, '%') and " : ''} delete_time is null 
		order by id desc
		limit ?, ? 
    `
	if (params.name !== void 0) {
		return execute(sql, [params.name, (params.page - 1) * params.size, params.size])
	}
	return execute(sql, [(params.page - 1) * params.size, params.size])
}

export const getById = (id: number, allInfo?: boolean) => {
	const sql = /*sql*/ `
        select id, name, account, create_time as createTime, update_time as updateTime ${allInfo ? ', delete_time, password' : ''}
		from ${admin.name} where id = ? and delete_time is null
    `
	return execute(sql, [id])
}

export const getByAccount = (account: string, allInfo?: boolean) => {
	const sql = /*sql*/ `
        select id, name, account, create_time as createTime, update_time as updateTime ${allInfo ? ', delete_time, password' : ''}
		from ${admin.name} where account = ? and delete_time is null
    `
	return execute(sql, [account])
}

type CreateParams = {
	name: string
	account: string
	password: string
}
export const create = (params: CreateParams) => {
	const { name, account, password } = params
	const sql = /*sql*/ `
        insert into ${admin.name} (name, account, password) 
		values (?, ?, ?)
    `
	return execute(sql, [name, account, password])
}

export const deleteById = (id: number) => {
	const sql = /*sql*/ `
        update ${admin.name} set delete_time = now() where id = ? and delete_time is null
    `
	return execute(sql, [id])
}

type UpdateParams = {
	name: string
	password: string
}

export const updateById = (id: number, params: UpdateParams) => {
	const { name, password } = params

	const sql = /*sql*/ `
	update ${admin.name}
	set name = ?, password = ?, update_time = now()
	where id = ? and delete_time is null
	`
	return execute(sql, [name, password, id])
}
