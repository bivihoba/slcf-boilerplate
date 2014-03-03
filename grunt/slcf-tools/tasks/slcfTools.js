/**
 * Created by bivihoba on 23/01/14.
 */

'use strict';

module.exports = function (grunt) {

	var path = require('path'),
		_ = require('underscore'),
		SlcfTools = require('../lib/slcf.js').Tools,
		config = require('../config.js'),
		slcf = new SlcfTools(config);

	grunt.registerTask('bemxmlPage', 'Run SLCF Compiler for one page', function (page, bundle, bundleGroup) {
		var shellBEMXML_config = grunt.config.get("shell");

			page = page || 'index';
			bundle = bundle || 'main';
			bundleGroup = bundleGroup || 'project';

			var stringCommand = slcf.bundles[bundleGroup].bundles[bundle].technologies.xml.getXSLT_processorCommandForPage(page),
				stringCommandOptions = slcf.bundles[bundleGroup].bundles[bundle].technologies.xml.getXSLT_processorCommandOptionsForPage(page);

				stringCommandOptions = [].concat(stringCommandOptions);
				stringCommandOptions.push(slcf.bundles[bundleGroup].getName() + '/' + slcf.bundles[bundleGroup].bundles[bundle].getName() + '/' + 'templates');

				shellBEMXML_config[page] = {
					command: stringCommand,
					src: stringCommandOptions,
					options: {
						stdout: true
					}
				};

			grunt.config.set('shell', shellBEMXML_config);
			grunt.task.run('newer:shell:' + page);
			grunt.log.writeln('Build ' + page + ' from ' + bundle);

			grunt.config.set('replace.cleanUpAfterXSLT.options.page', page);
			grunt.config.set('replace.cleanUpAfterXSLT.options.bundle', bundle);

			grunt.task.run('replace:cleanUpAfterXSLT');
	});

	grunt.registerTask('bemxmlBundle', 'Run SLCF Compiler for all pages in bundle', function (bundle, bundleGroup) {
		var shellBEMXML_config = grunt.config.get("shell");

			bundle = bundle || 'main';
			bundleGroup = bundleGroup || 'project';

			var stringCommand = slcf.bundles[bundleGroup].bundles[bundle].getXSLT_processorCommandForAllBundlePages(),
				stringCommandOptions = slcf.bundles[bundleGroup].bundles[bundle].getXSLT_processorCommandOptionsForAllBundlePages();

				stringCommandOptions = [].concat(stringCommandOptions);
				stringCommandOptions.push(slcf.bundles[bundleGroup].getName() + '/' + slcf.bundles[bundleGroup].bundles[bundle].getName() + '/' + 'templates/*');

				shellBEMXML_config[bundle] = {
					command: stringCommand.join('&'),
					src: stringCommandOptions,
					options: {
						stdout: true
					}
				};

			grunt.config.set('shell', shellBEMXML_config);
			grunt.task.run('newer:shell:' + bundle);

			grunt.config.set('replace.cleanUpAfterXSLT.options.bundle', bundle);
			grunt.task.run('replace:cleanUpAfterXSLT');

	});

	grunt.registerTask('bemxmlProject', 'Run SLCF Compiler for project bundles', function () {
		_(slcf.bundles.project.bundles).each(function(bundle){
			if (bundle.isPagesDirectoryExists()) {
				grunt.task.run('bemxmlBundle:'+bundle.getName());
			}
		});
	});

	grunt.event.on('watch', function(action, filepath, target) {
			grunt.log.writeln(target + ': ' + filepath + ' has ' + action);

		var bundleCwd = 'bundles/',
			tech = target || 'xml',
			bundleName = filepath.substring(bundleCwd.length, filepath.indexOf(path.sep, bundleCwd.length)),
			fileName = filepath.substring(filepath.lastIndexOf(path.sep)+1, filepath.lastIndexOf('.'+tech));

			if (target == 'xml') {
				grunt.task.run('bemxmlPage:'+ fileName + ':' + bundleName);
				grunt.task.run('buildUsedDeps:'+ bundleName);
			}

			if (target == 'stylus') {
				var techVariant = filepath.substring(filepath.lastIndexOf('stylus.')+7, filepath.lastIndexOf('.blocks'));

					if (techVariant === '.') {
						techVariant = 'stylus';
					}

					grunt.task.run('buildDeps:'+ techVariant);
					grunt.task.run('buildUsedDeps:'+ bundleName);
					grunt.task.run('generateBundleStylus_Tech:'+ techVariant + ':' + bundleName);
			}
			if (target == 'less') {
				var techVariant = filepath.substring(filepath.lastIndexOf('less.')+5, filepath.lastIndexOf('.blocks'));

					if (techVariant === '.') {
						techVariant = 'less';
					}


					grunt.task.run('buildDeps:'+ techVariant);
					grunt.task.run('buildUsedDeps:'+ bundleName);
					grunt.task.run('generateBundleLESS_Tech:'+ techVariant + ':' + bundleName);
			}
			if (target == 'css') {
				var techVariant = filepath.substring(filepath.lastIndexOf('css.')+4, filepath.lastIndexOf('.blocks'));

					if (techVariant === '.') {
						techVariant = 'css';
					}

					grunt.task.run('buildDeps:'+ techVariant);
					grunt.task.run('buildUsedDeps:'+ bundleName);
					grunt.task.run('generateBundleCSS_Tech:'+ fileName + ':' + techVariant + ':' + bundleName);
			}
	});

	grunt.registerTask('generateBundleStylus_Tech', 'Stylus for bundle', function (techVariant, bundle) {
			techVariant = '.' + techVariant || '';
			bundle = bundle || '*';

			if (techVariant === '.stylus') {
				techVariant = '';
			}

			grunt.config.set('stylus.dev.options.techVariant', techVariant);
			grunt.config.set('stylus.dev.options.bundle', bundle);
			grunt.task.run('stylus:dev');
	});

	grunt.registerTask('generateBundleLESS_Tech', 'LESS for bundle', function (techVariant, bundle) {
			techVariant = '.' + techVariant || '';
			bundle = bundle || '*';

			if (techVariant === '.less') {
				techVariant = '';
			}

			grunt.config.set('less.dev.options.techVariant', techVariant);
			grunt.config.set('less.dev.options.bundle', bundle);
			grunt.task.run('less:dev');
	});

	grunt.registerTask('generateBundleCSS_Tech', 'CSS for bundle', function (fileName, techVariant, bundle) {
			techVariant = '.' + techVariant || '';
			fileName = fileName || '*';
			bundle = bundle || '*';


			if (techVariant === '.css') {
				techVariant = '';
			}

			grunt.config.set('copy.getDevCSS.files.options.techVariant', techVariant);
			grunt.config.set('copy.getDevCSS.files.options.file', fileName);
			grunt.config.set('copy.getDevCSS.files.options.bundle', bundle);
			grunt.task.run('copy:getDevCSS');
	});

	grunt.registerTask('buildDeps', '', function (technology) {
		var CSS_basedTechnologies = slcf.getConfig().CSS_technologies;

		if (technology !== undefined) {
			CSS_basedTechnologies = [].concat(technology);
		}

		_(CSS_basedTechnologies).each(function(technology) {
			buildCSS_basedTechnologyDeps(technology);
		});

		function buildCSS_basedTechnologyDeps(technology) {

			var rightBundles = _(slcf.getBundles()).filter(function (bundle) {
						return bundle.isTechnologyExists(technology) === true;
				}),
				dependentBundles = _(rightBundles).filter(function (bundle) {
					if (bundle.technologies[technology].buildDeps().length > 0) {
						return bundle;
					}
				}),
				independentBundles = _(rightBundles).reject(function (bundle) {
					if (bundle.technologies[technology].buildDeps().length > 0) {
						return bundle;
					}
				});

			_.mixin({
				containsAll: function (first, second) {
					return _(first).intersection(second).length == second.length;
				}
			});

			var finalDepsList = _(independentBundles).map(function (bundle) { return bundle.getDir(); }),
				dependentBundlesNames = _(dependentBundles).map(function (bundle) {
					return bundle.getDir();
				}),
				dependentBundlesDeps = _(dependentBundles).map(function (bundle) {
					return bundle.technologies[technology].getLibsDependencies();
				});

			for (var i = 0; i < dependentBundlesNames.length; i++) {

				if (_.containsAll(finalDepsList, dependentBundlesDeps[i]) === true) {

					finalDepsList.push(dependentBundlesNames[i]);

					dependentBundlesNames.splice(i,1);
					dependentBundlesDeps.splice(i,1);

					i--;
				}
			}

			rightBundles = _(rightBundles).sortBy(function(bundle) {
				return finalDepsList.indexOf(bundle.getDir());
			});

			_(rightBundles).each(function(bundle) {
				bundle.technologies[technology].build();
			});
		}
	});

	grunt.registerTask('buildUsedDeps', '', function (bundleName, bundleGroup) {
		var bundles =  slcf.getBundles();
			bundleGroup =  bundleGroup || slcf.bundles.project.getName();

		if (bundleName !== undefined) {
			bundles = _(bundles).filter(function (bundle) {
				return bundle.getDir() === bundleGroup + '/' + bundleName;
			})
		}

		var rightBundles = _(bundles).filter(function (bundle) {
				return bundle.isPagesDirectoryExists() === true;
			});

			_(rightBundles).each(function (bundle) {
				bundle.technologies['xml'].build();
			});
	});
};
