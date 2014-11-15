module.exports = {
	dev: {
		options: {
			bundle: '*',
			techVariant: '*'
		},
		files: [{
			expand: 'true',
			cwd: 'bundles',
			src: '<%= stylus.dev.options.bundle %>/styles<%= stylus.dev.options.techVariant %>.styl',
			dest: 'code/dev/css/',
			rename: function(dest, matchedSrcPath, options) {
				var path = require('path');
				var bundle = matchedSrcPath.substring(0, matchedSrcPath.indexOf('/'));
				var newFilename = matchedSrcPath.replace(bundle + '/','');
					newFilename = newFilename.replace('styles', bundle + '.styles');
					newFilename = newFilename.replace('styles.styl', 'styles.css');
				return path.join(dest, newFilename);
			}
		}]
	}
};
