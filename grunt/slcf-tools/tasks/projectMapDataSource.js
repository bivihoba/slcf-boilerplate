/**
 * Created by bivihoba on 07/12/13.
 */

//module.exports = function (grunt) {
//	grunt.registerTask('projectMapDataSource', ' create XML-data with pages ', function () {
//		var fs = require('fs'),
//			path = require('path'),
//			data2xml = require('data2xml')(),
//			libxmljs = require("libxmljs");
//
//		var allPages = [];
//
//		function isEmpty(obj) {
//			for (var key in obj) {
//				if (obj.hasOwnProperty(key))
//					return false;
//			}
//			return true;
//		}
//
//		function createFileIndex() {
//
//			var bundles = fs.readdirSync('bundles'),
//					realBundles = [];
//
//			bundles.forEach(getRealBundles);
//
//			function getRealBundles(item) {
//				var bundlePath = 'bundles/' + item + '/pages/';
//				if (grunt.file.exists(bundlePath)) {
//					return realBundles.push(item)
//				}
//			}
//
//			realBundles.forEach(getPages);
//
//			function getPages(bundle) {
//				var pages = fs.readdirSync('bundles/' + bundle + '/pages');
//
//				return pages.forEach(function (page) {
//					allPages.push([bundle, 'bundles/' + bundle + '/pages/' + page, path.basename(page, '.xml')])
//				})
//			}
//
//			//			console.log(allPages);
//		}
//
//		function getPageFile(filepath) {
//			return grunt.file.read(filepath);
//		}
//
//		function getPageData(filecontent, filename, bundle) {
//			var file = libxmljs.parseXml(filecontent),
//					page = {},
//					pageTitle,
//					pageDescription;
//
//			pageTitle = file.get('//page/meta/title');
//			pageDescription = file.get('//page/meta/description');
//
//			if (pageTitle !== undefined) {
//				page.title = pageTitle.text();
//			}
//			if (pageDescription !== undefined) {
//				page.description = pageDescription.text();
//			}
//
//
//			if (!isEmpty(page)) {
//				if (typeof filename !== 'undefined') {
//					page.filename = bundle + '__' + filename;
//				}
//				if (typeof bundle !== 'undefined') {
//					page.bundle = bundle;
//				}
//			}
//
//			return page;
//		}
//
//		function createPageData() {
//			var data = [];
//
//			for (var i = 0; i < allPages.length; i++) {
//
//				var file = getPageFile(allPages[i][1]),
//						fileData = getPageData(file, allPages[i][2], allPages[i][0]);
//
//				if (!isEmpty(fileData)) {
//					data.push(fileData);
//				}
//			}
//			return data;
//		}
//
//		function createXMLTree() {
//			var data = createPageData();
//			var xmlData = data2xml(
//					'data',
//					{
//						"project-map": {
//							page: data
//						}
//					}
//			);
//			return xmlData;
//		}
//
//		function createDataSourceFile(path, XML) {
//			grunt.file.write(path, XML);
//		}
//
//		var outputPath = 'bundles/tech/data-sources/project-map.xml';
//
//		createFileIndex();
//		createDataSourceFile(outputPath, createXMLTree());
//
//	});
//}