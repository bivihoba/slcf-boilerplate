'use strict';

module.exports = function (grunt) {

	grunt.registerTask('cleanBoilerplate', 'DANGER!!! Delete .git .', function () {

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


};
