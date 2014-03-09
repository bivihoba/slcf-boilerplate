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
				'bundles/*/styles.styl',
				'bundles/*/styles.*.styl',
				'bundles/*/stylus.blocks/*.styl',
				'bundles/*/stylus.*.blocks/*.styl',
				'!bundles/*/stylus.blocks/blocks.auto.styl',
				'!bundles/*/stylus.blocks/blocks.auto.used.styl',
				'!bundles/*/stylus.*.blocks/blocks.auto.styl',
				'!bundles/*/stylus.*.blocks/blocks.auto.used.styl'
		],
		tasks: '',
		options: {
			spawn: false
		}
	},
	less: {
		files: [
				'bundles/*/styles.less',
				'bundles/*/styles.*.less',
				'bundles/*/less.blocks/*.less',
				'bundles/*/less.*.blocks/*.less',
				'!bundles/*/less.blocks/blocks.auto.less',
				'!bundles/*/less.blocks/blocks.auto.used.less',
				'!bundles/*/less.*.blocks/blocks.auto.less',
				'!bundles/*/less.*.blocks/blocks.auto.used.less'
		],
		tasks: '',
		options: {
			spawn: false
		}
	},
	css: {
		files: [
				'bundles/*/styles.css',
				'bundles/*/styles.*.css',
				'bundles/*/css.blocks/*.css',
				'bundles/*/css.*.blocks/*.css',
				'!bundles/*/css.blocks/blocks.auto.css',
				'!bundles/*/css.blocks/blocks.auto.used.css',
				'!bundles/*/css.*.blocks/blocks.auto.css',
				'!bundles/*/css.*.blocks/blocks.auto.used.css'
		],
		tasks: '',
		options: {
			spawn: false
		}
	}
};
