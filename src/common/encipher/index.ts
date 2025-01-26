import { project } from '#conf'
import crypto from 'crypto'

const { iv, key } = project.common.encipher

export const encryption = (plaintext: string) => {
	const cipher = crypto.createCipheriv('aes-256-cbc', key, iv)
	return cipher.update(plaintext, 'utf8', 'hex') + cipher.final('hex')
}

export const decrypted = (encrypted: string) => {
	const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv)
	return decipher.update(encrypted, 'hex', 'utf8') + decipher.final('utf8')
}

export default { encryption, decrypted }
