module.exports = {
	dev: {
		files: {
		  'code/dev/css/styles.css': ['code/dev/css/*.css', '!code/dev/css/*styles*.css']
		}
	},
    production: {
        expand: true,
        cwd: 'code/dev/css/',
        src: ['*.css', '!*.min.css'],
        dest: 'code/production/css/',
        ext: '.min.css'
    },
    concatProduction: {
        files: {
            'code/production/css/buffer.css': ['code/dev/css/main.*.css'],
            'code/production/css/template_styles.min.css': ['code/production/css/buffer.css','code/production/css/*.css','!code/production/css/main.*.css']
        }
    }
};
