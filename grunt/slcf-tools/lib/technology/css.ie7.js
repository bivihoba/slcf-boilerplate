/**
 * Created by bivihoba on 22/01/14.
 */
"use strict";

module.exports = {
	Technology: function(bundle){

		var Parent = new (require('./css.js').Technology)(bundle),
			_ = require('underscore');

		var technology = {
			name: 'css.ie7',
			fileExtension: 'css'
		};

		var tech = _.extend({}, Parent, technology);

		return tech;

	}
}
