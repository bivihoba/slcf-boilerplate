/**
 * Created by bivihoba on 22/01/14.
 */
"use strict";

module.exports = {
	Technology: function(bundle){

		var Parent = new (require('./abstract.js').Abstract)(bundle),
			_ = require('underscore');

		var technology = {
			name: 'html',
			fileExtension: 'html',

			build: function(){
//				Parent.build.call(this);
//				console.log('Не буду ничо собирать в жопу идите');
			}
		};

		var tech = _.extend({}, Parent, technology);

		return tech;

	}
}
