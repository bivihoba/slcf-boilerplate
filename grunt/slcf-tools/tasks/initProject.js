'use strict';

module.exports = function (grunt) {

	grunt.registerTask(	'initProject',
						'One-time task. Run it for init project instead to do much git commands by hand.',
	function () {
		var shellConfig = grunt.config.get("shell");
		shellConfig['initProject'] = {
			command: [
				'git init .',
				'git remote add origin <%= pkg.repository.url %>',
				'git add .',
				'git submodule add https://github.com/bivihoba/slcf-compiler.git vendors/slcf-compiler',
				'git submodule add https://github.com/askaza/slcf-nano-core.git vendors/slcf-nano-core',
				'git submodule add https://github.com/bivihoba/slcf-docs.git vendors/slcf-docs',
				'git submodule init',
				'git submodule update',
				'git add .',
				'git commit -am \"Initialize SLCF project from boilerplate.\"'
			  ].join('&&')
			,
			options: {
				stdout: true
			}
		};
		grunt.config.set('shell', shellConfig);
		grunt.task.run('shell:initProject');
	});

};
