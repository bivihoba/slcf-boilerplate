module.exports = function(grunt) {

	var path = require('path');

		require('load-grunt-tasks')(grunt);
		require('load-grunt-config')(grunt, {
			configPath: path.join(process.cwd(), 'grunt/config'),
			init: true,
			config: {
				pkg: grunt.file.readJSON('package.json'),
				test: false
			}
		});
		require('time-grunt')(grunt);

	grunt.loadTasks('grunt/slcf-tools/tasks');

	grunt.registerTask(
		'cleanProject', [
			'clean:allGeneratedFiles'					// Удаляем все сгенерированные файлы, в т.ч кэш сборщика.
		]												// Для удаления частностей см. конфиг для clean
	);

	grunt.registerTask(
		'buildProjectDev', [
			'newer:copy:assetsToDev',					// Копируем картинки и другую парашу из __assets в dev
			'bemxmlProject',							// Компилируем все страницы из BEMXML
			'buildDeps',								// Собираем зависимости по технологиям
			'buildUsedDeps',							// Чистим технологии, исходя их проиндексированных BEMXML-деревьев
			'less:dev',									// Собираем стили из LESS-технологии
			'copy:getDevCSS'							// Копируем собранные стили из CSS-файлов в dev-папку
		]
	);

	grunt.registerTask(
		'buildProjectProduction', [
			'newer:copy:htmlToProduction',				// Копируем html-файлы из dev в production
			'replace:renameCSS_ProductionFiles',		// В html-файлах из production меняем имена в путях к CSS-файлам
			'newer:copy:assetsToProduction',			// Копируем картинки и другую парашу из dev в production
			'csso:production',							// Оптимизируем production-стили через csso
			'newer:imagemin:production'					// Оптимизируем картинки
		]
	);

	grunt.registerTask(
		'buildProjectStyles', [							// Собираем только стили (предполагаем, что XML не менялся).
			'buildDeps',
			'buildUsedDeps',
			'less:dev',
			'copy:getDevCSS',
			'csso:production'
		]
	);

	grunt.registerTask(
		'buildProject', [								// Собираем всё.
			'buildProjectDev',
			'buildProjectProduction'
		]
	);

	grunt.registerTask(
		'default', [ 'buildProjectProduction' ]			// Дефолтной таской собираем production.
	);
};
