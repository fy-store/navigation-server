import { readonly } from 'uxiu'
export default readonly({
	connect: {
		host: 'localhost',
		port: 3306,
		database: 'test',
		user: 'root',
		password: '123456'
	},
	tables: {
		admin: {
			name: 'admin',
			fields: {
				nameLength: 50,
				accountLength: 50,
				passwordLength: 500
			}
		},
		userSession: {
			name: 'user_session',
			fields: {
				sessionIdLength: 80
			}
		},
		group: {
			name: 'group',
			fields: {
				nameLength: 50
			}
		},
		link: {
			name: 'link',
			fields: {
				nameLength: 50
			}
		}
	}
})
