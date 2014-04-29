module.exports = {
	production: {
		options: {
			progressive: false,
			pngquant: false
		},
		files: [{
			expand: 'true',
			cwd: 'code/dev/images/',
			src: [
				'**/*.{png,jpg,gif}'
				],
			dest: 'code/production/images/'
		}]
	}
};
