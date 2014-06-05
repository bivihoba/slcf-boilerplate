module.exports = {
	cleanUpAfterXSLT: {
		options: {
			page: '*',
			bundle: '*',
			path: 'code/dev/<%= replace.cleanUpAfterXSLT.options.bundle %>__<%= replace.cleanUpAfterXSLT.options.page %>.html'
		},
		src: '<%= replace.cleanUpAfterXSLT.options.path %>',
		overwrite: true,
		replacements: [
			{
				from: ' SYSTEM \"http:\/\/www.w3.org\/TR\/xhtml1\/DTD\/xhtml1-transitional.dtd\"',
				to: ''
			},
			{
				from: 'html xmlns=\"http:\/\/www\.w3\.org\/1999\/xhtml\"',
				to: 'html'
			},
			{
				from: '\<meta http-equiv=\"Content-Type\" content=\"text/html; charset=UTF-8\" />',
				to: ''
			},
			{
				from: ' xmlns:d=\"http:\/\/slcf\/templates\/settings\/bem-scheme\/data\"',
				to: ''
			}
		]
	},
	renameCSS_ProductionFiles: {
		src: 'code/production/*.html',
		overwrite: true,
		replacements: [
			{
				from: '.styles.css',
				to:'.min.css'
			}
		]
	}
};
