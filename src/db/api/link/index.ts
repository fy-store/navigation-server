import { mysql } from '#conf'
import { execute } from '#dbConnect'
const { link } = mysql.tables

export const getList = (group_id: number) => {
	const sql = /*sql*/ `
        select id, name, remark, create_time as createTime, update_time as updateTime
        from \`${link.name}\`
        where group_id = ? and delete_time is null
    `
	return execute(sql, [group_id])
}

export const getById = (id: number) => {
	const sql = /*sql*/ `
        select id, name, remark, create_time as createTime, update_time as updateTime
        from \`${link.name}\`
        where id = ? and delete_time is null
    `
	return execute(sql, [id])
}

type CreateParams = {
	groupId: number
	name: string
	url: string
	icon: string
	remark?: string
}
export const create = (params: CreateParams) => {
	const { groupId, name, url, icon, remark = '' } = params
	const sql = /*sql*/ `
        insert into \`${link.name}\` (group_id, name, url, icon, remark) 
        values (?, ?, ?, ?, ?)
    `
	return execute(sql, [groupId, name, url, icon, remark])
}

export const deleteById = (id: number) => {
	const sql = /*sql*/ `
        update \`${link.name}\` set delete_time = now() 
        where id = ? and delete_time is null
    `
	return execute(sql, [id])
}

type UpdateParams = {
	name: string
	url: string
	icon: string
	remark: string
}

export const updateById = (id: number, params: UpdateParams) => {
	const { name, url, icon, remark } = params
	const sql = /*sql*/ `
        update \`${link.name}\` set name = ?, remark = ?, url = ?, icon = ?, update_time = now()
        where id = ? and delete_time is null
    `
	return execute(sql, [name, url, icon, remark, id])
}
