/**
 * Created by bivihoba on 22/01/14.
 */
"use strict";

module.exports = {
	BundleGroup: function(tools, dir){

		var _ = require('underscore'),
			fs = require('fs'),
			path = require('path'),
			Bundle = require('./bundle.js').Bundle,
			bundleGroup = {};

		bundleGroup = {
			tools: tools,
			bundles: {},

			getName: function(){
				return dir;
			},
			getTools: function(){
				return this.tools;
			},
			getBundlePath: function(name){
				return dir+'/'+name;
			},
			getBundlesName: function () {
				var that = this,
					files = fs.readdirSync(dir);

				var bundles = files.filter(function (expectedBundle) {
					return fs.lstatSync(that.getBundlePath(expectedBundle)).isDirectory();
				});

				return bundles;
			}
		}

		var bundleNames = bundleGroup.getBundlesName();

		_(bundleNames).each(function(name){
			bundleGroup.bundles[name] = new Bundle(bundleGroup, bundleGroup.getBundlePath(name));
		});

		return bundleGroup;

	}
}
