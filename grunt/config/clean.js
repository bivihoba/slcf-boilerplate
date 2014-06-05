module.exports = {
	newerCache: {
		src: [
//			Grunt-newer cache
			'grunt/newer-cache/**'
		]
	},
	styleDependencies: {
		src: [
//			dependencies
			'*/*/css*.blocks/blocks.auto.css',
			'*/*/css*.blocks/blocks.auto.used.css',
			'*/*/less*.blocks/blocks.auto.less',
			'*/*/less*.blocks/blocks.auto.used.less',
			'*/*/stylus*.blocks/blocks.auto.styl',
			'*/*/stylus*.blocks/blocks.auto.used.styl'
		]
	},
	pageSchemes: {
		src: [
//			page schemes
			'*/*/page-schemes/*.xml'
		]
	},
	dev: {
		src: [
//			dev files
			'code/dev/*/**',
			'code/dev/*',
			'!code/dev/readme.md'
		]
	},
	production: {
		src: [
//			production files
			'code/production/*/**',
			'code/production/*',
			'!code/production/readme.md'
		]
	},
	allGeneratedFiles: {
		src: [
//			Grunt-newer cache
			'<%= clean.newerCache.src %>',

//			dependencies
			'<%= clean.styleDependencies.src %>',

//			page schemes
			'<%= clean.pageSchemes.src %>',

//			dev files
			'<%= clean.dev.src %>',

//			production files
			'<%= clean.production.src %>'
		]
	},
	temporaryFiles: {
        src: [
            'code/production/css/buffer.css'
        ]
    },
    productionBuild: {
        src: [
            'code/production/css/template_styles.min.css'
        ]
    }
};
