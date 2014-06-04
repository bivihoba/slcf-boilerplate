/**
 * Created by bivihoba on 22/01/14.
 */
"use strict";

module.exports = {
	Abstract: function(bundle){

		var _ = require('underscore'),
			fs = require('fs'),
			abstract = {};

		abstract = {
			name: 'abstract',
			bundle: bundle,

			getTools: function(){
				return this.bundle.getTools();
			},

			getBundle: function(){
				return this.bundle;
			},
			getPath: function () {
				return this.getBundle().getBlocksInTechnologyPath(this.name);
			},
			buildDeps: function() {
//				console.log('Build Deps: '+this.name);
			},
			build: function(){
//				console.log('Builded: '+this.name);
			}
		}

		return abstract;

	}
}
