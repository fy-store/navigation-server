import { mysql } from '#conf'
const { name } = mysql.tables.link
const { nameLength } = mysql.tables.link.fields

export default /*sql*/ `
create table if not exists \`${name}\` (
    \`id\` int auto_increment primary key,
    \`group_id\` int not null,
    \`name\` varchar(${nameLength}) not null,
    \`url\` text not null,
    \`icon\` text not null,
    \`remark\` text not null,
    \`create_time\` datetime default current_timestamp,
    \`update_time\` datetime default current_timestamp on update current_timestamp,
    \`delete_time\` datetime default null,
    index index_group_id (\`group_id\`),
    index index_name (\`name\`),
    index index_url (\`url\`(255)),
    index index_icon (\`icon\`(255)),
    index index_remark (\`remark\`(255)),
    index index_update_time (\`update_time\`),
    index index_delete_time (\`delete_time\`)
)
`
