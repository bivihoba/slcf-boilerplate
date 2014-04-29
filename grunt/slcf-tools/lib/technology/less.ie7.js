/**
 * Created by bivihoba on 22/01/14.
 */
"use strict";

module.exports = {
	Technology: function(bundle){

		var Parent = new (require('./less.js').Technology)(bundle),
			_ = require('underscore'),
			fs = require('fs');

		var technology = {
			name: 'less.ie7',
			fileExtension: 'less'
		};

		var tech = _.extend({}, Parent, technology);

		return tech;

	}
}
