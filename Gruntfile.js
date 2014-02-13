module.exports = function(grunt) {

	grunt.initConfig({

		pkg: grunt.file.readJSON('package.json'),

		projectSettings: {
			projectName: '<%= pkg.repository.name %>',
			repositoryUrl: '<%= pkg.repository.url %>',
			dev: {
				htmlPath: 'code/dev'
			}
		},
		bemxml: {

			file: {
				name: 'index',
				bundle: 'main', // by default
				cwd: 'bundles/<%= bemxml.file.bundle %>/pages/',
				inputFileName: '<%= bemxml.file.name %>.xml',
				inputFilePath: '<%= bemxml.file.cwd %><%= bemxml.file.inputFileName %>',
				dest: 'code/dev/',
				outputFileName: '<%= bemxml.file.bundle %>__<%= bemxml.file.name %>.html',
				outputFilePath: '<%= bemxml.file.dest %><%= bemxml.file.outputFileName %>',

				src: ''
			},
			files: 'bundles/**/pages/*.xml'
		},
		shell: {
			initProject: {
				command: [
					'git init .',
					'git remote add origin <%= projectSettings.repositoryUrl %>',
					'git add .',
					'git submodule add https://github.com/bivihoba/slcf-compiler.git vendors/slcf-compiler',
					'git submodule add https://github.com/bivihoba/slcf-docs.git vendors/slcf-docs',
					'git submodule init',
					'git submodule update',
					'git add .',
					'git commit -am \"SLCF boilerplate\"'
				  ].join('&&')
				,
				options: {
					stdout: true
				}
			},
			bemxml: {
				command: 'xsltproc --xinclude <%= shell.bemxml.options.input %> --output <%= shell.bemxml.options.output %>',
				options: {
					input : '<%= bemxml.file.inputFilePath %>',
					output : '<%= bemxml.file.outputFilePath %>'
				}
			},
			bemxmlOnce: {
				command:
					function () {

						var fs = require('fs');
						var path = require('path');

						var bundles = fs.readdirSync('bundles');

						var realBundles = [];
						var allPages = [];

						bundles.forEach(getRealBundles);

							function getRealBundles(item) {
								var bundlePath = 'bundles/'+item+'/pages/';
								if (grunt.file.exists(bundlePath)) {
									return realBundles.push(item)
								}
							}

						realBundles.forEach(getPages);

							function getPages(bundle) {
								var pages = fs.readdirSync('bundles/'+bundle+'/pages');

								return pages.forEach(function(page) {allPages.push('bundles/'+bundle+'/pages/'+page)})
							}

						var output = allPages.map(function(file){
							var filename = path.basename(file, '.xml');

							var bundleCwd = 'bundles/';
							var bundleName = file.substring(bundleCwd.length , file.indexOf('/', bundleCwd.length));

							var string = 'xsltproc --xinclude '+file+' --output '+'code/dev/'+bundleName+'__'+filename+'.html';

							console.log(string);
							return string;
					}).join(' & ');

					return output;
				},
				options: {
					stdout: true
				}
			}
		},
		replace: {
			cleanHTML: {
				options: {
					path: '<%= projectSettings.dev.htmlPath %>/*.html'
				},
				src: '<%= replace.cleanHTML.options.path %>',

				overwrite: true,
				replacements: [
					{
						from: ' SYSTEM \"http:\/\/www.w3.org\/TR\/xhtml1\/DTD\/xhtml1-transitional.dtd\"',
						to: ''
					},
					{
						from: 'html xmlns=\"http:\/\/www\.w3\.org\/1999\/xhtml\"',
						to: 'html'
					},
					{
						from: ' xml:lang=\"ru\"',
						to: ''
					},
					{
						from: '\<meta http-equiv=\"Content-Type\" content=\"text/html; charset=UTF-8\" />',
						to: ''
					},
					{
						from: ' xmlns:d=\"http:\/\/slcf\/templates\/settings\/bem-scheme\/data\"',
						to: ''
					}
				]
			},
			prettifyXML: {
				src: 'bundles/*/pages/*.xml',

				overwrite: true,
				replacements: [
					{
						from: '\<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n' +
								'\<?xml-stylesheet type=\"text/xml\" href=\"../../../project.xsl\"?>\n' +
								'\<page\n' +
								'\t\txmlns:a=\"http://slcf/templates/settings/bem-scheme/additional\"\n' +
								'\t\txmlns:b=\"http://slcf/templates/settings/bem-scheme/block\"\n' +
								'\t\txmlns:d=\"http://slcf/templates/settings/bem-scheme/data\"\n' +
								'\t\txmlns:e=\"http://slcf/templates/settings/bem-scheme/element\"\n' +
								'\t\txmlns:p=\"http://slcf/templates/settings/bem-scheme/pointer\"\n' +
								'\t\txmlns:m=\"http://slcf/templates/settings/bem-scheme/modification\"\n' +
								'\t\txmlns:t=\"http://slcf/templates/settings/bem-scheme/template\"\n' +
								'\t\txmlns:x=\"http://slcf/templates/settings/bem-scheme/xhtml\"\n' +
								'\t\txmlns:un=\"http://slcf/templates/settings/bem-scheme/unknown-namespace\"\n' +
								'\t\txmlns:alxc=\"http://slcf/templates/settings/bem-scheme/additional-legacy-xhtml-class\"\n' +
								'\t\t>',
						to: '\<?xml version=\"1.0\" encoding=\"UTF-8\"?>' +
								'\<?xml-stylesheet type=\"text/xml\" href=\"../../../project.xsl\"?>' +
								'\<page' +
								' xmlns:a=\"http://slcf/templates/settings/bem-scheme/additional\"' +
								' xmlns:b=\"http://slcf/templates/settings/bem-scheme/block\"' +
								' xmlns:d=\"http://slcf/templates/settings/bem-scheme/data\"' +
								' xmlns:e=\"http://slcf/templates/settings/bem-scheme/element\"' +
								' xmlns:p=\"http://slcf/templates/settings/bem-scheme/pointer\"' +
								' xmlns:m=\"http://slcf/templates/settings/bem-scheme/modification\"' +
								' xmlns:t=\"http://slcf/templates/settings/bem-scheme/template\"' +
								' xmlns:x=\"http://slcf/templates/settings/bem-scheme/xhtml\"' +
								' xmlns:un=\"http://slcf/templates/settings/bem-scheme/unknown-namespace\"' +
								' xmlns:alxc=\"http://slcf/templates/settings/bem-scheme/additional-legacy-xhtml-class\"' +
								'>\n'
					},
					{
						from: '\<\/project>\n' +
								'\t\<meta>',
						to: '\<\/project>\n\n' +
								'\t\<meta>'
					},
					{
						from: '\<\/project>\n' +
								'    \<meta>',
						to: '\<\/project>\n\n' +
								'\t\<meta>'
					},
					{
						from: '\<\/project>\n' +
								'\t\<templates>',
						to: '\<\/project>\n\n' +
								'\t\<templates>'
					},
					{
						from: '\<\/project>\n' +
								'    \<templates>',
						to: '\<\/project>\n\n' +
								'\t\<templates>'
					},
					{
						from: '\<\/meta>\n' +
								'\t\<templates>',
						to: '\<\/meta>\n\n' +
								'\t\<templates>'
					},
					{
						from: '\<\/meta>\n' +
								'    \<templates>',
						to: '\<\/meta>\n\n' +
								'\t\<templates>'
					},
					{
						from: '\<meta>\n\t\t\n',
						to: '\<\meta>\n'
					},
					{
						from: '\<title handle=\"\">\<\/title>',
						to: ''
					},
					{
						from: '\<description handle=\"\">\<\/description>',
						to: ''
					}
				]
			},
			renameCSSFilesInHTML: {
				src: 'code/production/*.html',

				overwrite: true,
				replacements: [
					{
						from: 'href="css/styles',
						to:'href="css/template_styles'
					},
					{
						from: '\<link rel=\"stylesheet\" media=\"screen\" href=\"css\/ie\.css" \/\>',
						to:''
					}, //TODO rewrite
					{
						from: 'href="css/ie.css',
						to:'href="css/template_styles_ie.css'
					},
					{
						from: 'href="css/ie_',
						to:'href="css/template_styles_ie_'
					}
				]
			}
		},
		clean: {
			devHtml: {
				src: ['code/dev/*.html']
			},
			devStyles: {
				src: ['code/dev/css/styles*.css']
			},
			productionHtml: {
				src: [
						'code/production/images/**',
						'code/production/fonts/**',
						'code/production/css/**',
						'code/production/*',
						'!code/production/readme.md'
				]
			}
		},
		copy: {
			productionAssets: {
				files: [
					{
						expand: true,
						cwd: 'code/dev/',
						src: ['images/**', 'fonts/**', 'js/**'],
						dest: 'code/production/'
					},
					{
						expand: true,
						cwd: 'code/dev/',
						src: ['humans.txt', 'favicon.ico'],
						dest: 'code/production/',
						filter: 'isFile'
					}
				]
			},
			productionHtml: {
				files: [
					{expand: true, cwd: 'code/dev/', src: ['*.html'], dest: 'code/production/', filter: 'isFile'}
				]
			},
			productionIECSS: {
				files: [
					{expand: true, cwd: 'code/dev/css', src: ['ie8.css', 'ie9.css'], dest: 'code/production/css', filter: 'isFile'}
				]
			}
		},
		less: {
			dev: {
				files: [{
					expand: 'true',
					cwd: 'bundles',
					src: '*/styles.less',
					dest: 'code/dev/css/',
					ext: '.css',
					rename: function(dest, matchedSrcPath, options) {
						var path = require('path');
						var bundle = matchedSrcPath.substring(0, matchedSrcPath.indexOf('/'));
						var newFilename = matchedSrcPath.replace(bundle + '/','');
							newFilename = newFilename.replace('styles','styles_' + bundle);
						return path.join(dest, newFilename);
					}
				},
				// and for media print
				{
					expand: 'true',
					cwd: 'bundles',
					src: '*/styles.print.less',
					dest: 'code/dev/css/',
					ext: '.print.css',
					rename: function(dest, matchedSrcPath, options) {
						var path = require('path');
						var bundle = matchedSrcPath.substring(0, matchedSrcPath.indexOf('/'));
						var newFilename = matchedSrcPath.replace(bundle + '/','');
							newFilename = newFilename.replace('styles','styles_' + bundle);
						return path.join(dest, newFilename);
					}
				}
				]
			}
		},
		csso: {
			production: {
				options: {
					bundle: '*',
					paths: ['code/dev/css/styles_*.css']
				},
				files: [
					{
						expand: 'true',
						cwd: 'code/dev/',
						src: [
							'css/styles_<%= csso.production.options.bundle %>.css',
							'!css/styles_<%= csso.production.options.bundle %>.print.css'
							],
						dest: 'code/production/',
						ext: '.css',
						rename: function(dest, matchedSrcPath, options) {
							var path = require('path');
							var newFilename;
							newFilename = matchedSrcPath.replace('styles_','template_styles_');
							return path.join(dest, newFilename);
						}
					},
					{
						expand: 'true',
						cwd: 'code/dev/',
						src: [
							'css/styles_<%= csso.production.options.bundle %>.print.css'
						],
						dest: 'code/production/',
						ext: '.print.css',
						rename: function(dest, matchedSrcPath, options) {
							var path = require('path');
							var newFilename;
							newFilename = matchedSrcPath.replace('styles_','template_styles_');
							return path.join(dest, newFilename);
						}
					}
				]
			}
		},
		concat: {
			productionCSScommon: {
			 src: 'code/production/css/template_styles_main.css',
			 dest: 'code/production/css/template_styles.css'
		   },
			productionIE: {
				files: {
					'code/production/css/template_styles_ie.css': ['code/dev/css/ie7.css', 'code/dev/css/ie7_main.css']
				}
		   }
		},
//		cssmin: {
//			productionIE: {
//				files: {
//					'code/production/css/template_styles_ie.css': ['code/dev/css/ie7.css', 'code/dev/css/ie7_main.css']
//				}
//			}
////			productionIE: {
////				options: {
////					bundle: '*',
////					paths: ['code/dev/css/ie_*.css']
////				},
////				expand: 'true',
////				cwd: 'code/dev/',
////				src: [[
////					'css/ie.css',
////					'css/ie_<%= cssmin.productionIE.options.bundle %>.css'
////					]],
////				dest: 'code/production/',
////				ext: '.css',
////				rename: function(dest, matchedSrcPath, options) {
////					var path = require('path');
////					var newFilename;
////					newFilename = matchedSrcPath.replace('ie','template_styles_ie__');
////					return path.join(dest, newFilename);
////				}
////			}
//		},
		prettify: {
			options: {
				"condense": true,
				"indent_size": 1,
				"indent_char": "	",
				"preserve_newlines": false
			},
			production: {

				expand: true,
				cwd: 'code/production/',
				ext: '.html',
				src: ['*.html'],
				dest: 'code/production/'
			}
		},
		watch: {
			xml: {
				files: '<%= bemxml.files %>',
				tasks: ['shell:bemxml', 'replace:cleanHTML'],
				options: {
					spawn: false
				}
			},
			less: {
				files: 'bundles/**/*.less',
				tasks: ['less','csso'],
				options: {
					spawn: false
				}
			},
			css: {
				files: '<%= csso.production.options.paths %>',
				tasks: ['csso'],
				options: {
					spawn: false
				}
			}
		}
	});

	grunt.event.on('watch', function(action, filepath, target) {
	  grunt.log.writeln(target + ': ' + filepath + ' has ' + action);
	});

	grunt.event.on('watch', function(action, filepath, target) {

		var path = require('path');

		var filename = path.basename(filepath, '.xml');
		var bundleCwd = 'bundles/';
		if(filepath.indexOf('/', bundleCwd.length) != -1) {
			var bundleName = filepath.substring(bundleCwd.length , filepath.indexOf('/', bundleCwd.length));
		} else {
			var bundleName = filepath.substring(bundleCwd.length , filepath.indexOf('\\', bundleCwd.length));
		}

		var htmlFile = 'code/dev/'+bundleName+'__'+path.basename(filepath, '.xml')+'.html';

		if (target == 'css') {
			bundleName = path.basename(filepath, '.css').replace('styles_','');
		}
		grunt.config(['bemxml', 'file', 'name'], filename);
		grunt.config(['bemxml', 'file', 'bundle'], bundleName);
		grunt.config(['csso', 'production', 'options', 'bundle'], bundleName);
		grunt.config(['replace', 'cleanHTML', 'options', 'path'], htmlFile );

		grunt.log.writeln(htmlFile);
	});

	grunt.loadNpmTasks('grunt-prettify');
	grunt.loadNpmTasks('grunt-parallel');
	grunt.loadNpmTasks('grunt-text-replace');
	grunt.loadNpmTasks('grunt-csso');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-shell');

	grunt.registerTask('cleanBoilerplate', 'DANGER!!! Delete .git .', function() {

		var cleanConfig = grunt.config.get("clean");
		cleanConfig['boilerplate'] = {
					src: [
							'.git',
							'.gitmodules',
							'vendors/*',
							'!vendors/readme.md'
					]
		};
		grunt.config.set('clean', cleanConfig);
		grunt.task.run('clean:boilerplate');
	});
	grunt.registerTask(
		'default', [
			'clean:productionHtml',
			'copy:productionAssets',
			'copy:productionHtml',
			'copy:productionIECSS',
			'replace:renameCSSFilesInHTML',
			'csso:production',
			'concat:productionCSScommon',
			'concat:productionIE'
//			'prettify:production' TODO fix whitespaces
		]
	);
	grunt.registerTask(
		'initProject', [
			'cleanBoilerplate',
			'shell:initProject'
		]
	);
	grunt.registerTask(
		'createDev', [
			'shell:bemxmlOnce',
			'replace:cleanHTML',
			'less:dev'
		]
	);
	grunt.registerTask(
		'cleanProject', [
			'clean:devHtml',
			'clean:devStyles',
			'clean:productionHtml'
		]
	);
	grunt.registerTask(
		'cleanProjectDev', [
			'clean:devHtml',
			'clean:devStyles'
		]
	);
	grunt.registerTask(
		'all', [
			'cleanProject',
			'createDev',
			'default'
		]
	);
};
