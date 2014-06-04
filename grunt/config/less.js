module.exports = {
	dev: {
		options: {
			bundle: '*',
			techVariant: '*'
		},
		files: [{
			expand: 'true',
			cwd: 'bundles',
			src: '<%= less.dev.options.bundle %>/styles<%= less.dev.options.techVariant %>.less',
			dest: 'code/dev/css/',
			rename: function(dest, matchedSrcPath, options) {
				var path = require('path');
				var bundle = matchedSrcPath.substring(0, matchedSrcPath.indexOf('/'));
				var newFilename = matchedSrcPath.replace(bundle + '/','');
					newFilename = newFilename.replace('styles', bundle + '.styles');
					newFilename = newFilename.replace('.less', '.css');
				return path.join(dest, newFilename);
			}
		}]
	}
};
