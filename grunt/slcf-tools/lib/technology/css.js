/**
 * Created by bivihoba on 22/01/14.
 */
"use strict";

module.exports = {
	Technology: function(bundle){

		var Parent = new (require('./abstract.js').Abstract)(bundle),
			_ = require('underscore'),
			fs = require('fs'),
			path = require('path');

		var technology = {
			baseTech: Parent.name,
			name: 'css',
			fileExtension: 'css',
			autoImportsFileName: 'blocks.auto',
			depsImportsFileName: 'blocks.deps',
			hardDepsImportsFileName: 'blocks.hard.deps',
			usedImportsFileName: 'blocks.auto.used',

			getBemFiles: function () {
				var directoryFiles = fs.readdirSync(this.getPath()),
					files = directoryFiles.filter(function (filename) {
						return filename.substr(0, 2) === 'b-';
					});

				return files;
			},
			getImports: function (imports, depsPath) {
				var that = this,
					depsPath = depsPath || path.join(this.getPath(), this.depsImportsFileName + '.' + this.fileExtension),
					modifiedBEMModes = _(this.specialBEMModes).map(function(elem){ return elem; }),
					imports = imports || this.getAutoImports(),
					deps = fs.existsSync(depsPath) ? fs.readFileSync(depsPath) : undefined
				;
				if (deps) {
					//какой кошмар
//					deps = deps.replace(/\n/g, '').replace(/\t/g, '');
					deps = deps.toString().split('\n');
					imports = deps.concat(imports);
				}

				imports = _.flatten(imports.map(function (filename) { return that.getBlocksCollection(filename); }));

				var specialImports = _(modifiedBEMModes)
					.chain()
						.map(function (mask) {
							return _(imports).filter(function(elem){
								var trueMask1 = '_' + mask + '_',
									trueMask2 = '_' + mask + '.less'
								;

								if (elem.indexOf(trueMask1) != -1) {
									return elem;
								}
								if (elem.indexOf(trueMask2) != -1) {

									var insideImports = modifiedBEMModes.map(function (item) {
										if (elem.indexOf('_' + item + '_') != -1) {

											return item
										}
									});

									insideImports = _(insideImports).compact();

									if (insideImports.length == 0) {
										return elem;
									}
								}
							});
						})
						.flatten()
					.value()
				;
				var simpleImports = _(imports)
					.chain()
							.filter(function(elem){
								return !_(modifiedBEMModes).find(function(mode){
									var trueMask1 = '_' + mode + '_',
										trueMask2 = '_' + mode + '.less'
									;


									if ((elem.indexOf(trueMask1) != -1)) {
										return elem;
									}
									if ((elem.indexOf(trueMask2) != -1)) {

										var insideImports = modifiedBEMModes.map(function (item) {

											if (elem.indexOf('_' + item + '_') != -1) {
												return item
											}

										});

										insideImports = _(insideImports).compact();

										if (insideImports.length == 0) {
											return elem;
										}
									}
								});
							})
							.compact()
					.value()
				;
				var sortedImports = [].concat(
						simpleImports,
						specialImports
				);
				var finalImports = [].concat(sortedImports);

					finalImports = _(finalImports)
						.chain()
							.flatten()
							.compact()
							.filter(function (item) {
								return (item.indexOf('.print.') == -1);
							})
						.value();

				return finalImports;
			},
			getLibsDependencies: function () {
				var that = this,
					depsPath = path.join(this.getPath(),this.depsImportsFileName + '.' + this.fileExtension),
					imports = '',
					deps = fs.existsSync(depsPath) ? fs.readFileSync(depsPath) : undefined
				;

				if (deps) {
					var depsDir = bundle.getTools().getConfig().bundlesDirs.vendor;

						deps = deps.toString().split('\n');
						imports = deps.concat(imports);
						imports = _.flatten(imports.map(function (importString) { return that.getBundleNamesDependencies(importString, depsDir); }));
						imports = _.compact(imports);
				}

				return imports;
			},
			getBundleNamesDependencies: function (importString, depsDir) {
				var blocksCollectionFileName = this.autoImportsFileName + '.' + this.fileExtension;

				if (importString.indexOf(blocksCollectionFileName) != -1 && importString.indexOf('../../../' + depsDir) != -1) {
					var dirName = bundle.getTechnologyFileName(this.name),
						bundleName = importString.replace('../../../' + depsDir + '/', depsDir + '/').replace('@import "', '').replace('";', '');

						bundleName = bundleName.substring(0, bundleName.indexOf(dirName + '/')-1);

					return bundleName;
				}

				return '';
			},
			getBlocksCollection: function (elem) {
				var blocksAutoCollectionFileName = this.autoImportsFileName + '.' + this.fileExtension,
					blocksHardDepsCollectionFileName = this.hardDepsImportsFileName + '.' + this.fileExtension;

				if (elem.indexOf(blocksAutoCollectionFileName) != -1 || elem.indexOf(blocksHardDepsCollectionFileName) != -1) {

					var vendorsDir = bundle.getTools().getConfig().bundlesDirs.vendor,
						bundlesDir = bundle.getTools().getConfig().bundlesDirs.project,
						depsDir = '';

						if (elem.indexOf('../../../' + vendorsDir) != -1) {
							depsDir = vendorsDir;
						}
						else if (elem.indexOf('../../../' + bundlesDir) != -1) {
							depsDir = bundlesDir;
						}
						else {
							console.log(elem);
							console.log('AAAAAAAAAAAAA');
						}
						/*TODO to rewrite */

					var depsBundle = elem.substring(elem.indexOf(depsDir+'/')+(depsDir+'/').length, elem.indexOf('/'+this.name+'.blocks')),
						techDirName = bundle.getTechnologyFileName(this.name),
						depsFileName = elem.substring(elem.lastIndexOf('/'),elem.lastIndexOf('"')),
						filePath = path.join(depsDir, depsBundle, techDirName, depsFileName),
						fullPath = '@import "../../../' + depsDir + '/' + depsBundle + '/' + techDirName +'/' + 'b-',
						blocksCollection =  fs.readFileSync(filePath).toString().replace(/@import \"b-/g, fullPath).split('\n');

					return blocksCollection;
				}
				return elem;
			},
			getAutoImports: function () {
				var that = this,
					imports = this.getBemFiles().map(function (filename) { return '@import "' + filename + '";'; })
				;

					imports = _.flatten(imports.map(function (filename) { return that.getBlocksCollection(filename); }));

				return imports
			},
			createImportsFile: function () {
				var contentSource = this.getImports(),
					filePath = path.join(path.normalize(this.getPath()), this.autoImportsFileName + '.' + this.fileExtension);

					fs.writeFileSync(filePath, contentSource.join('\n'));

				return;
			},
			buildDeps: function() {
				var libDeps = this.getLibsDependencies();
				return libDeps;
			},
			build: function(){
				if (bundle.isTechnologyExists(this.name) === true) {
					this.createImportsFile();
//					console.log('Builded deps: '+this.name+": "+ this.getBundle().dir);
				}
			}
		};

		technology.specialBEMModes = bundle.getTools().getConfig().specialBEMModes;

		var tech = _.extend({}, Parent, technology);

		return tech;

	}
}
