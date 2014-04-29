/**
 * Created by bivihoba on 22/01/14.
 */
"use strict";

module.exports = {
	Tools: function(config){

		var BundleGroup = require('./bundleGroup.js').BundleGroup,
			_ = require('underscore');

		var SlcfTools = {};

		SlcfTools = {
			config: config,
			bundles: {},

			getConfig: function() {
				return this.config;
			},

			getBundles: function() {
				var bundles = {};
				_(SlcfTools.bundles).map(function(bundleGroup){
					_(bundleGroup.bundles).each(function(bundle, name){
						bundles[bundle.getDir()] = bundle;
					});
				});

				return bundles;
			}
		}

		_(config.bundlesDirs).each(function(dir, name) {
			SlcfTools.bundles[name] = new BundleGroup(SlcfTools, dir);
		});

		return SlcfTools;

	}
}
