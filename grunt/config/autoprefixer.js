module.exports = {
	options: {
		browsers: ['> 1%', 'last 2 versions', 'Firefox 3.6', 'Firefox ESR', 'Opera 12.1', 'BlackBerry 10']
	},
	dev: {
		src: ['code/dev/css/*.css', '!code/dev/css/*.ie7.css']
	}
};
