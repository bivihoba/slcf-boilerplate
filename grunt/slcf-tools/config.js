var config = {
	bundlesDirs: {
		vendor: 'vendors',
		project: 'bundles'
	},
	schemePagesDirectory: 'page-schemes',
	bemSyntax: {
		prefix: 'b-',
		elementDelimeter: '__',
		modifierDelimeter: '_'
	},
	specialBEMModes: [
		'type',
		'layout',
		'layout-type',
		'viewtype',
		'viewtype-theme',
		'size',
		'content',
		'content-type',
		'context' // depricated
	],
	technologies: [
		'html',
		'stylus',
		'less',
		'less.ie11',
		'less.ie10',
		'less.ie9',
		'less.ie8',
		'less.ie7',
		'xml',
		'css',
		'css.ie11',
		'css.ie10',
		'css.ie9',
		'css.ie8',
		'css.ie7'
	],
	CSS_technologies: [
		'css', 'css.ie11', 'css.ie10', 'css.ie9', 'css.ie8', 'css.ie7',
		'less', 'less.ie11', 'less.ie10', 'less.ie9', 'less.ie8', 'less.ie7',
		'stylus'
	]
};

module.exports = config;
