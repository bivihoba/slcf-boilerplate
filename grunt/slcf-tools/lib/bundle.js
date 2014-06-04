/**
 * Created by bivihoba on 22/01/14.
 */
"use strict";

module.exports = {
	Bundle: function (bundleGroup, dir) {
		var fs = require('fs'),
			path = require('path'),
			_ = require('underscore'),
			bundle = {};

		bundle = {
			bundleGroup: bundleGroup,
			dir: dir,
			technologies: {},
			technologyDirSuffix: '.blocks',


			getTools: function () {
				return this.bundleGroup.getTools();
			},

			getDir: function () {
				return this.dir;
			},
			getName: function () {
				return dir.substring(dir.indexOf('/') + 1, dir.length);
			},
			getPagesDirectory: function () {
				return this.getDir() + '/' +'pages'
			},
			getPages: function () {
				var that = this,
					pages = this.getPageNames().map(function (page) {
					return page = that.getPagesDirectory() + '/' + page
				});

				return pages
			},
			getPageNames: function () {
				var directoryFiles = fs.readdirSync(this.getPagesDirectory());

					directoryFiles = directoryFiles.filter(function (filename) {
						if (path.extname(filename) === '.xml') {
							return filename;
						}
					});

				return directoryFiles;
			},
			isPagesDirectoryExists: function (directory) {
				var pagesFilepath = directory || this.getDir() + '/' +'pages';

					try {
						if (fs.lstatSync(pagesFilepath).isDirectory()) {
							return true;
						}
					}
					catch (error) {
						return false;
					}
			},
			getTechnologies: function (expectedTechnologies) {
				var that = this;
					expectedTechnologies = expectedTechnologies || this.knownTechnologies;

				var technologies = expectedTechnologies.map(function(technology){
					if (that.isTechnologyExists(technology) === true) {
						return technology;
					}
					else {
						return '';
					}
				});

					technologies = _(technologies).compact();

				return technologies;
			},
			isTechnologyExists: function (technology) {
				var realTechnology = this.getBlocksInTechnologyPath(technology);
					try {
						if (fs.lstatSync(realTechnology).isDirectory()) {
							return true;
						}
					}
					catch (error) {
						// console.log('\"'+ technology + '\" technology not declared in ' + dir)
						return false;
					}
			},
			getBlocksInTechnologyPath: function (technology) {
				var filepath = this.getDir() + '/' + this.getTechnologyFileName(technology);
//					console.log(filepath);
				return filepath;
			},
			getTechnologyFileName: function (technology, suffix) {
				var suffix = suffix || this.technologyDirSuffix,
					filename = technology + suffix;

				return filename;
			},
			getXSLT_processorCommandForAllBundlePages: function () {
				var that = this,
					pageNames = this.getPageNames().map(function (filename) {
						return path.basename(filename, '.xml');
					}),
					stringCommand = pageNames.map(function (filename) {
						return that.technologies['xml'].getXSLT_processorCommandForPage(filename);
					});
				return stringCommand;
			},
			getXSLT_processorCommandOptionsForAllBundlePages: function () {
				var that = this,
					pageNames = this.getPageNames().map(function (filename) {
						return path.basename(filename, '.xml');
					}),
					stringCommand = pageNames.map(function (filename) {
						return that.technologies['xml'].getXSLT_processorCommandOptionsForPage(filename);
					});
				return stringCommand;
			},
			isPageSchemesExists: function () {
					try {
						if (fs.lstatSync(bundle.dir + '/' + bundle.getTools().config.schemePagesDirectory).isDirectory()) {
							return true;
						}
					}
					catch (error) {
						// console.log('\"'+ technology + '\" technology not declared in ' + dir)
						return false;
					}
			}
		}

		bundle.knownTechnologies = bundle.getTools().getConfig().technologies;

		_(bundle.getTools().getConfig().technologies).each(function(tech){
			var technology = require('./technology/'+tech+'.js');
			bundle.technologies[tech] = new (technology.Technology)(bundle);
		});

		return bundle;
	}
};