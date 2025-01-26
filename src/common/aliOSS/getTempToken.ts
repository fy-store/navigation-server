import { project } from '#conf'
import OSS from 'ali-oss'

const { aliOSS } = project.common
let sts: OSS.STS = null
const getSts = () => {
	sts = new OSS.STS({
		accessKeyId: aliOSS.sts.accessKeyId,
		accessKeySecret: aliOSS.sts.accessKeySecret
	})
}

interface AnyOjb {
	[key: string]: any
}

export interface Options {
	/**
	 * 自定义权限策略，用于进一步限制STS临时访问凭证的权限, 此参数将覆盖配置文件参数
	 */
	policy?: string | AnyOjb
	/**
	 * 用于自定义角色会话名称，用来区分不同的令牌(只能英文), 默认为 ''
	 */
	sessionName?: string
}

/**
 * 获取临时凭证
 * @param options 获取临时凭证的配置选项
 */
export default async (options: Options = {}) => {
	if (!sts) getSts()
	const { expirationSeconds, policy, roleArn } = aliOSS.sts
	const result = await sts.assumeRole(roleArn, options.policy ?? policy, expirationSeconds, options.sessionName ?? '')
	return result.credentials
}
