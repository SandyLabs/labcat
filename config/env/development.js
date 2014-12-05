'use strict';

module.exports = {
	db: 'mongodb://localhost/labcat-dev',
	app: {
		title: 'labcat - Development Environment'
	},
	facebook: {
		clientID: process.env.FACEBOOK_ID || '992421137439775',
		clientSecret: process.env.FACEBOOK_SECRET || '2b2cfc29eb207dceaa6206befcca10b4',
		callbackURL: '/auth/facebook/callback'
	},
	twitter: {
		clientID: process.env.TWITTER_KEY || 'FrEoTi0A8doWdAXGAmYRdG1Ug',
		clientSecret: process.env.TWITTER_SECRET || 't7NFV1WrhONeKXPPfKA8csaOjKVjqQVKSptAGrUgP5Uw5wsUpb',
		callbackURL: '/auth/twitter/callback'
	},
	google: {
		clientID: process.env.GOOGLE_ID || '913367088973-hamr4l2rasg61rtb6kkpa4plm5pe4iue.apps.googleusercontent.com',
		clientSecret: process.env.GOOGLE_SECRET || 'NcIhrnbxEHzVnymw3n3O5yjV',
		callbackURL: '/auth/google/callback'
	},
	linkedin: {
		clientID: process.env.LINKEDIN_ID || '77au6pwzw6wj7f',
		clientSecret: process.env.LINKEDIN_SECRET || '8TSiHyB2dPbdGFBS',
		callbackURL: '/auth/linkedin/callback'
	},
	github: {
		clientID: process.env.GITHUB_ID || '2767b141f0e8ead6f41e',
		clientSecret: process.env.GITHUB_SECRET || '784b5216dec57814df7b9e16b329e29ec8018db9',
		callbackURL: '/auth/github/callback'
	},
	mailer: {
		from: process.env.MAILER_FROM || 'MAILER_FROM',
		options: {
			service: process.env.MAILER_SERVICE_PROVIDER || 'MAILER_SERVICE_PROVIDER',
			auth: {
				user: process.env.MAILER_EMAIL_ID || 'MAILER_EMAIL_ID',
				pass: process.env.MAILER_PASSWORD || 'MAILER_PASSWORD'
			}
		}
	}
};
