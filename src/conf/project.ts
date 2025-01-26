import { readonly } from 'uxiu'

export default readonly({
	common: {
		hash: {
			salt: 10
		},
		encipher: {
			/** 16字节 */
			iv: 'wwIuTwSXoKx2oQOA',
			/** 32字节 */
			key: '8nopTodt4hlJNb3a3k2B8qthJf54DOTk'
		},
		logger: {
			storagePath: '/logs'
		},
		aliOSS: {
			/** 临时凭证配置 */
			sts: {
				/** 用户 key */
				accessKeyId: '',
				/** 用户 密钥 */
				accessKeySecret: '',
				/** 角色 */
				roleArn: '',
				/**
				 * - 自定义权限策略，用于进一步限制 STS 临时访问凭证的权限。
				 * - 如果不指定 Policy，则返回的 STS 临时访问凭证默认拥有指定角色的所有权限
				 * - 使用字符串或对象配置, 不配置请置为空字符串
				 */
				policy: '',
				/** 临时访问凭证有效时间单位为秒(取值最小15分钟, 最大1小时) */
				expirationSeconds: 900
			},
			/** 客户端操作配置 */
			client: {
				/** Bucket所在地域, 示例："oss-cn-guangzhou" */
				region: '',
				/** 存储空间名称 */
				bucket: ''
			}
		}
	},
	/** 登录验证 */
	loginVerify: {
		/** 到期间隔时长 */
		expireInterval: 1000 * 60 * 60 * 24 * 7
	}
})
