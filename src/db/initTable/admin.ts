import { mysql } from '#conf'
const { name } = mysql.tables.admin
const { nameLength, passwordLength, accountLength } = mysql.tables.admin.fields

export default /*sql*/ `
create table if not exists ${name} (
    \`id\` int auto_increment primary key,
    \`name\` varchar(${nameLength}) not null,
    \`account\` varchar(${accountLength}) not null,
    \`password\` varchar(${passwordLength}) not null,
    \`create_time\` datetime default current_timestamp,
    \`update_time\` datetime default current_timestamp on update current_timestamp,
    \`delete_time\` datetime default null,
    index index_name (\`name\`),
    index index_account (\`account\`),
    index index_create_time (\`create_time\`),
    index index_update_time (\`update_time\`),
    index index_delete_time (\`delete_time\`)
)
`
