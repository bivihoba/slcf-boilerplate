module.exports = {
	assets: {
		files: 'bundles/__assets/**',
		tasks: ['newer:copy:assetsToDev'],
		options: {
			spawn: false
		}
	},
	xml: {
		files: 'bundles/*/pages/*.xml',
		tasks: '',
		options: {
			spawn: false
		}
	},
	stylus: {
		files: [
				'bundles/*/stylus.blocks/*.styl',
				'bundles/*/stylus.*.blocks/*.styl'
		],
		tasks: '',
		options: {
			spawn: false
		}
	},
	less: {
		files: [
				'bundles/*/less.blocks/*.less',
				'bundles/*/less.*.blocks/*.less'
		],
		tasks: '',
		options: {
			spawn: false
		}
	},
	css: {
		files: [
				'bundles/*/css.blocks/*.css',
				'bundles/*/css.*.blocks/*.css'
		],
		tasks: '',
		options: {
			spawn: false
		}
	}
};
