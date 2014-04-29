module.exports = {
	production: {
		options: {
			bundle: '*',
			paths: ['code/dev/css/*styles*.css']
		},
		files: [{
			expand: 'true',
			cwd: 'code/dev/',
			src: [
				'css/*styles.css',
				'!css/*styles.ie*.css'
				],
			dest: 'code/production/',
			rename: function(dest, matchedSrcPath, options) {
				var path = require('path');
				var newFilename;
				newFilename = matchedSrcPath.replace('styles','template_styles');
				return path.join(dest, newFilename);
			}
		}]
	}
};
