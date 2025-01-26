import { readonly } from 'uxiu'
import mysql from './mysql.js'
import project from './project.js'

export default readonly({
	mysql,
	project
})

export { mysql, project }
