module.exports = {
	getDevCSS: {
		options: {
			bundle: '*',
			file: '*',
			techVariant: '*'
		},
		files: [{
			expand: 'true',
			cwd: 'bundles',
			src: '<%= copy.getDevCSS.options.bundle %>' +
				 '/' +
				 'css<%= copy.getDevCSS.options.techVariant %>.blocks' +
				 '/' +
				 '<%= copy.getDevCSS.options.file %>.css',
			dest: 'code/dev/css/',
			rename: function(dest, matchedSrcPath, options) {
				var path = require('path'),
					techVariant = matchedSrcPath.substring(matchedSrcPath.lastIndexOf('css.')+4, matchedSrcPath.lastIndexOf('.blocks')),
					bundle = matchedSrcPath.substring(0, matchedSrcPath.indexOf('/'));

					if (techVariant === '.') {
						techVariant = '';
					}
					else {
						techVariant = '.'+techVariant;
					}
					var newFilename = matchedSrcPath.replace('/css'+techVariant+'.blocks/','/');

					newFilename = newFilename.replace('.css',techVariant + '.css');
				return path.join(dest, newFilename);
			}
		}]

	},
	assetsToDev: {
		files: [
			{
				expand: true,
				cwd: 'bundles/__assets',
				src: ['**'],
				dest: 'code/dev/'
			}
		]
	},
	assetsToProduction: {
		files: [
			{
				expand: true,
				cwd: 'code/dev/',
				src: [
						'fonts/**',
						'images/**',
						'js/**'
				],
				dest: 'code/production/'
			},
			{
				expand: true,
				cwd: 'code/dev/',
				src: [
						'humans.txt',
						'favicon.ico'
				],
				dest: 'code/production/',
				filter: 'isFile'
			}
		]
	},
	htmlToProduction: {
		files: [{
			expand: 'true',
			cwd: 'code/dev/',
			src: '*.html',
			dest: 'code/production/',
			options: {
				process: function (content, srcpath) {
					return content.replace('href=\"css\/styles',"href=\"css\/template_styles");
				}
			}
		}]
	}
};
