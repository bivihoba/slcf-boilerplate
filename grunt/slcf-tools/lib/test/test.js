/**
 * Created by bivihoba on 22/01/14.
 */
var SlcfTools = require('../slcf.js').Tools,
	_ = require('underscore');

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
		'less',
		'less.ie10',
		'less.ie9',
		'less.ie8',
		'less.ie7',
		'xml',
		'css',
		'css.ie10'
//		,
//		'css.ie9',
//		'css.ie8',
//		'css.ie7',
//		'less',
//		'img',
//		'psd',
//		'md'
	]
};

var slcf = new SlcfTools(config);

//console.dir(slcf);
//console.log(slcf.bundles.project.getBundle('main'));
//slcf.bundles.project.bundles.main.technologies.css.callMeNigga();
//console.dir(slcf.bundles.project.bundles.main);
//console.log(slcf.bundles.project.bundles.main.getDir());
//console.log(slcf.getBundles());
//console.log(slcf.bundles.project.getBundlePath('main'));
//console.log(slcf.bundles.project.bundles.main.getTechnologies());
//console.log(slcf.bundles.project.bundles.main.technologies.less.getPath());
//console.log(slcf.bundles.project.bundles.main.technologies.less.getImports());
//console.log(slcf.bundles.project.bundles.main.technologies.xml.getPageFile('404.xml'));
//console.log(slcf.bundles.project.bundles.main.technologies.xml.getPath());
//console.log(slcf.bundles.project.bundles.main.isPageSchemesExists());
//console.log(slcf.bundles.project.bundles.main.technologies.less.getLibsDependencies());
//console.log(slcf.bundles.vendor.bundles["_sl-common-core"].technologies.less.getLibsDependencies());
//console.log(slcf.getBundles());


//_(bundles).each(function(bundle){
//	if (BundleTool.isTechnologyExists(bundle, 'less')) {
//		BundleTool.createImportsFile(bundle);
//	}
//});

var bundles = Object.getOwnPropertyNames(slcf.getBundles()),
	depsBundles = [],
	depsValuesBundles = {},
	independentBundles = [];

console.log('All bundles:');
console.log(bundles);

_(slcf.getBundles()).each(function(bundle) {
	var bundleName = bundle.getName();
	var bundleDeps = bundle.technologies.less.buildDeps();
	if (bundleDeps.length > 0) {
//		console.log(bundleDeps);
		depsBundles.push(bundleName);
		depsValuesBundles[bundleName] = bundleDeps;
	}
	else {
		independentBundles.push(bundleName);
	}
//	_(bundle.technologies).invoke('buildDeps');
//	_(bundle.technologies).invoke('build');
});

console.log('Independent:');
console.log(independentBundles);

console.log('With dependends:');
console.log(depsBundles);
console.log(depsValuesBundles);

console.log('Build independents:');

_(slcf.getBundles()).each(function(bundle) {
	var bundleName = bundle.getName();

	if (!(bundleName in depsValuesBundles)) {
		_(bundle.technologies).invoke('build');
	}
});

var buildedBundles = independentBundles;


_.mixin({
    containsAll: function (first, second) {
        return _(first).intersection(second).length == second.length;
    }
});
console.log(buildedBundles);
function buildDepsChain (depsBundles, buildedBundles) {

	for (var i = 0; i < depsBundles.length; i++) {

		console.log(_.containsAll(buildedBundles, depsValuesBundles[depsBundles[i]]));
//
		if (_.containsAll(buildedBundles, depsValuesBundles[depsBundles[i]]) === true) {
			console.log(depsBundles[i]);

			buildedBundles.push(depsBundles[i]);



			_(slcf.getBundles()).each(function(bundle) {
				var bundleName = bundle.getName();

				if (bundleName == depsBundles[i]) {
					_(bundle.technologies).invoke('buildDeps');
					_(bundle.technologies).invoke('build');
				}
			});
		}
	}
	return;
}

//console.log(depsBundles.length);

buildDepsChain(depsBundles, buildedBundles);




//_(slcf.getBundles()).each(function(bundle){
//	_(bundle.technologies).invoke('build');
//})