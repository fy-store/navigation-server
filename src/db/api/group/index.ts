import { mysql } from '#conf'
import { execute } from '#dbConnect'
const { group, link } = mysql.tables

export const getList = () => {
	const sql = /*sql*/ `
	    select
	        g.id,
	        g.name,
	        g.remark,
	        g.create_time as createTime,
	        g.update_time as updateTime,
			case 
				when count(l.id) > 0 then
					json_arrayagg(json_object(
						'id', l.id,
						'name', l.name,
						'url', l.url,
						'icon', l.icon,
						'remark', l.remark,
						'createTime', l.create_time,
						'updateTime', l.update_time
					))
				else json_array()
			end as links
	    from \`${group.name}\` as g
	    left join ${link.name} as l on g.id = l.group_id and l.delete_time is null
	    where g.delete_time is null
	    group by g.id, g.name, g.remark, g.create_time, g.update_time;
	`
	return execute(sql)
}


export const getById = (id: number) => {
	const sql = /*sql*/ `
        select 
			g.id,
			g.name,
			g.remark,
			g.create_time as createTime,
			g.update_time as updateTime,
			case 
				when count(l.id) > 0 then
					json_arrayagg(json_object(
						'id', l.id,
						'name', l.name,
						'url', l.url,
						'icon', l.icon,
						'remark', l.remark,
						'createTime', l.create_time,
						'updateTime', l.update_time
					))
				else json_array()
			end as links
        from \`${group.name}\` as g
		left join ${link.name} as l on g.id = l.group_id and l.delete_time is null
        where g.id = ? and g.delete_time is null
		group by g.id, g.name, g.remark, g.create_time, g.update_time;
    `
	return execute(sql, [id])
}

export const getByName = (name: string) => {
	const sql = /*sql*/ `
        select 
			g.id,
			g.name,
			g.remark,
			g.create_time as createTime,
			g.update_time as updateTime,
			case 
				when count(l.id) > 0 then
					json_arrayagg(json_object(
						'id', l.id,
						'name', l.name,
						'url', l.url,
						'icon', l.icon,
						'remark', l.remark,
						'createTime', l.create_time,
						'updateTime', l.update_time
					))
				else json_array()
			end as links
        from \`${group.name}\` as g
		left join ${link.name} as l on g.id = l.group_id and l.delete_time is null
        where g.name = ? and g.delete_time is null
		group by g.id, g.name, g.remark, g.create_time, g.update_time;
    `
	return execute(sql, [name])
}

type CreateParams = {
	name: string
	remark?: string
}
export const create = (params: CreateParams) => {
	const { name, remark = '' } = params
	const sql = /*sql*/ `
        insert into \`${group.name}\` (name, remark) 
		values (?, ?)
    `
	return execute(sql, [name, remark])
}

export const deleteById = (id: number) => {
	const sql = /*sql*/ `
        update \`${group.name}\` set delete_time = now() 
        where id = ? and delete_time is null
    `
	return execute(sql, [id])
}

type UpdateParams = {
	name: string
	remark: string
}

export const updateById = (id: number, params: UpdateParams) => {
	const { name, remark } = params
	const sql = /*sql*/ `
        update \`${group.name}\` set name = ?, remark = ?, update_time = now()
        where id = ? and delete_time is null
    `
	return execute(sql, [name, remark, id])
}
