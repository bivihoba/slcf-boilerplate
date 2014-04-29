/**
 * Created by bivihoba on 22/01/14.
 */
"use strict";

module.exports = {
	Technology: function(bundle){

		var Parent = new (require('./abstract.js').Abstract)(bundle),
			_ = require('underscore'),
			fs = require('fs'),
			path = require('path'),
			libxmljs = require("libxmljs");

		var technology = {
			name: 'xml',
			fileExtension: 'xml',

			getPath: function (filename) {
				return bundle.dir + '/' + this.schemePagesDirectory;
			},
			getPageFile: function (filepath) {
				var datafile =  fs.existsSync(filepath) ? fs.readFileSync(filepath) : undefined;
				return this.cleanXMLDataTreeWhitespaces(datafile);
			},
			cleanXMLDataTreeWhitespaces: function (xml) {
				return (xml + '').replace(/\n/g,'').replace(/\t/g,'');
			},
			getPageEntitiesFromXML: function(xml) {
				var that = this,
					xmlDoc = libxmljs.parseXml(xml),
					xmlEntites = xmlDoc.root().childNodes(),
					entities = xmlEntites.map(function (item) {
									return that.parseXmlEntity(item);
								});
				return entities;
			},
			parseXmlEntity: function(item) {
				var entity = '';

					switch(item.attr('type').value()) {
						case 'block': {
							entity = item.attr('block').value();
							break;
						}
						case 'element': {
							entity = item.attr('block').value() +
									 this.bemSyntax.elementDelimeter +
									 item.attr('element').value();
							break;
						}
						case 'modifier': {
							entity = item.attr('block').value();

							if (item.attr('element')) {
								entity = entity +
										 this.bemSyntax.elementDelimeter +
										 item.attr('element').value();
							}

							entity = entity + this.bemSyntax.modifierDelimeter +
									 item.attr('modifier').value();

							if (item.attr('modifier-value')) {
								entity = entity +
										 this.bemSyntax.modifierDelimeter +
										 item.attr('modifier-value').value();
							}
							break;
						}
						default:
							break;
					}

					entity = this.bemSyntax.prefix + entity;

				return entity;
			},
			getEntitiesUsedInXML: function () {
				var that = this,
					files = this.getSchemePageFiles(),
					filepaths = this.getSchemePageFilePaths(files),
					entities = filepaths.map(function(filepath){ return that.getPageFile(filepath); });
					entities = entities.map(function(xml){ return that.getPageEntitiesFromXML(xml); });
					entities = _(entities).flatten();
					entities = _(entities).uniq()
				;

				return entities;
			},
			getSchemePageFiles: function () {
				var that = this,
					files = fs.readdirSync(this.getPath()).filter(function (filename) {
						return path.extname(filename) ===  '.' + that.fileExtension;
					});

				return files;
			},
			getSchemePageFilePaths: function (files, schemePagesDirectory) {
				var that = this;
					schemePagesDirectory = schemePagesDirectory || this.schemePagesDirectory;
				var schemePagesPaths = files.map(function (filename) {
						return path.join(path.normalize(that.getPath()), filename);
					});

				return schemePagesPaths;
			},
			getPureDeps: function (libEntities, bundleEntities, libDeps) {
				var pureDeps = [],
					pureEntities = [];

					for (var i = 0; i < libEntities.length; i++) {

						for (var j = 0; j < bundleEntities.length; j++) {
//
//							if (i == '463' && j == '430') {
//								console.log('Либа ' + i + ' Блок ' + libEntities[i] + ' Шаг ' + j + ' Блок ' +bundleEntities[j]);
//							}

							if (libEntities[i] == bundleEntities[j]) {
								pureEntities.push(libEntities[i]);
								break
							}
							else if (libEntities[i] == bundleEntities[j].substring(0, libEntities[i].length) && libEntities[i].indexOf('_') != -1  && libEntities[i].indexOf('_') === libEntities[i].lastIndexOf('_')) {
								pureEntities.push(libEntities[i]);
								break
							}
							else if (libEntities[i] + '_' == bundleEntities[j].substring(0, (libEntities[i]+'_').length) && libEntities[i].indexOf('__') != -1) {
								pureEntities.push(libEntities[i]);
								break
							}
							else if (j == bundleEntities.length-1) {
								pureEntities.push('');
								break
							}
						}
					}

					pureDeps = libDeps.map(function(elem, i){
						if (pureEntities[i] !== '') {
							return elem;
						}
					});

					pureDeps = _(pureDeps).compact();

				return pureDeps
			},
			hardDepsComeBack: function(imports, techhology) {
				var hardDepsPath = techhology.getPath() + '/' + techhology.hardDepsImportsFileName + '.' + techhology.fileExtension,
					hardImports = techhology.getImports(imports, hardDepsPath);

				return hardImports
			},
			createUsedImportsFile: function () {
				var that = this;

					_(bundle.getTechnologies()).each(function(technology){
						// TODO tech as param

						if (_.include(bundle.getTools().config.CSS_technologies, technology) === true) {

							var libDeps = that.getLibDeps(that.getLibFilepath(technology)),
								libEntities = that.getLibEntities(technology, libDeps),
								usedEntities = that.getEntitiesUsedInXML(),
								pureEntities = that.getPureDeps(libEntities, usedEntities, libDeps);
								console.log('Technology:     '+ technology);
								console.log(
										'Declarations:   ' +
										libEntities.length +
										'\nUsed:           ' +
										usedEntities.length +
										'\nAfter matching: ' +
										pureEntities.length +
										'\n'
								);

								pureEntities = that.hardDepsComeBack(pureEntities, bundle.technologies[technology]);

							var content = pureEntities.join('\n'),
								filePath = path.join(path.normalize(bundle.technologies[technology].getPath()),
												bundle.technologies[technology].usedImportsFileName +
												'.' +
												bundle.technologies[technology].fileExtension);

							if (pureEntities.length > 0) {
								fs.writeFileSync(filePath, content);
							}
						}

					});

				return;
			},
			getLibFilepath: function(technology) {
				var filepath = bundle.technologies[technology].getPath() + '/' +
								bundle.technologies[technology].autoImportsFileName +
								'.' + bundle.technologies[technology].fileExtension;
				return filepath;
			},
			getLibDeps: function (filepath) {
				if (!fs.existsSync(filepath)) throw Error("Missing file: "+filepath+"!");

				var file = fs.readFileSync(filepath),
					files = (file.toString()).split('\n'),
					deps = files.map(function(elem){
						if ((elem.indexOf('@import') != -1) && (elem.indexOf('b-') != -1) && (elem.indexOf('//') == -1) && (elem.indexOf('/*') == -1)) {
							return elem;
						}
					});

					deps = _(deps).compact();

				return deps;
			},
			getLibEntities: function (technology, libDeps) {
				var libEntities = libDeps.map(function(elem){
					var dirName = '/'+ bundle.getTechnologyFileName(technology) +'/';

						if (elem.indexOf(dirName) != -1) {
							return elem.substring(elem.indexOf(dirName) + dirName.length, elem.indexOf('";'));
						}
						else {
							return elem.substring(elem.indexOf('"b-') + 1, elem.indexOf('";'));
						}
					});

					libEntities = libEntities.map(function(elem){
						elem = elem.replace('.' + bundle.technologies[technology].fileExtension, '').replace('.nojs', '').replace('.media', '').replace('.print', '');
					return elem;
					});

				return libEntities;
			},
			getXSLT_processorCommandForPage: function(filename, prefix, bundle, bundleGroup) {
				var bundleGroup = bundleGroup || this.bundle.bundleGroup.getName(),
					bundle = bundle || this.bundle.getName(),
					filename = filename || 'index',
					command = 'xsltproc',
					command__options = '--xinclude ',
					command__sourceFilePath = path.join(bundleGroup, bundle, 'pages', filename + '.' + this.fileExtension),
					command__sourceDir = path.join('..', '..', bundleGroup, bundle, this.schemePagesDirectory) + path.sep,
					command__sourceFileName = filename + '.' + this.fileExtension,
					command__outputFilePath = path.join('code', 'dev', bundle + '__' + filename + '.' + 'html'),

					stringCommand = command + ' ' + command__options +
									command__sourceFilePath + ' ' +
									'--stringparam filename ' + command__sourceFileName + ' ' +
									'--stringparam filepath ' + command__sourceDir +
								 	' --output '+ command__outputFilePath;
				return stringCommand;
			},
			getXSLT_processorCommandOptionsForPage: function(filename, prefix, bundle, bundleGroup) {
				var bundleGroup = bundleGroup || this.bundle.bundleGroup.getName(),
					bundle = bundle || this.bundle.getName(),
					filename = filename || 'index',
					command__sourceFilePath = path.join(bundleGroup, bundle, 'pages', filename + '.' + this.fileExtension),
					stringCommand = command__sourceFilePath;
				return stringCommand;
			},
			build: function(){
				if (this.bundle.isPageSchemesExists() === true) {
					console.log('\nBuild deps for: ' + this.getBundle().dir);
					this.createUsedImportsFile();
				}
			}
		};
		technology.schemePagesDirectory = bundle.getTools().config.schemePagesDirectory;
		technology.bemSyntax = bundle.getTools().config.bemSyntax;

		var tech = _.extend({}, Parent, technology);

		return tech;

	}
}
