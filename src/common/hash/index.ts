import { project } from '#conf'
import bcrypt from 'bcrypt'

export const encode = (str: string) => {
	return bcrypt.hash(str, project.common.hash.salt)
}

export const compare = (plaintextStr: string, hashStr: string) => {
	return bcrypt.compare(plaintextStr, hashStr)
}

export default { encode, compare }