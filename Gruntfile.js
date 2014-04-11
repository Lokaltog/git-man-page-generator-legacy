module.exports = function (grunt) {
	var matchdep = require('matchdep'),
	    jsFiles,
	    stylFiles,
	    jadeFiles

	matchdep.filter('grunt-*').forEach(grunt.loadNpmTasks)

	jsFiles = {
		'webroot/static/js/main.js': [
			'app/assets/js/baba/src/baba.js',
			'app/assets/js/baba/src/grammar/common.js',
			'app/assets/js/baba/src/grammar/git-manual.js',
			'app/assets/js/seedrandom/seedrandom.js',
			'app/assets/js/main.js',
		],
	}
	stylFiles = [{
		'webroot/static/css/main.css': [
			'app/assets/styl/main.styl',
		],
	}]
	jadeFiles = [{
		expand: true,
		cwd: 'app/views',
		src: '**/*.jade',
		dest: 'webroot/',
		ext: '.html',
	}]

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		clean: {
			all: [
				'webroot/{static,views}',
			],
		},
		sync: {
			all: {
				files: [{
					cwd: 'app/assets',
					src: '{font,img,etc}/**',
					dest: 'webroot/static/',
				}],
			},
		},
		stylus: {
			development: {
				files: stylFiles,
				options: {
					debug: true,
					compress: false,
					'include css': true,
					use: [
						require('nib'),
					],
					'import': [
						'nib',
					],
				},
			},
			production: {
				files: stylFiles,
				options: {
					debug: false,
					compress: true,
					'include css': true,
					use: [
						require('nib'),
					],
					'import': [
						'nib',
					],
				},
			},
		},
		jade: {
			development: {
				files: jadeFiles,
				options: {
					pretty: true,
				},
			},
			production: {
				files: jadeFiles,
				options: {
					pretty: false,
				},
			},
		},
		cssmin: {
			all: {
				files: [{
					expand: true,
					cwd: 'webroot/static/css',
					src: '**/*.css',
					dest: 'webroot/static/css',
				}],
			},
		},
		htmlmin: {
			all: {
				options: {
					collapseWhitespace: true,
					collapseBooleanAttributes: true,
					removeAttributeQuotes: true,
					removeRedundantAttributes: true,
					removeEmptyAttributes: true,
					removeOptionalTags: true,
				},
				files: [{
					expand: true,
					cwd: 'webroot/',
					src: '**/*.html',
					dest: 'webroot/',
				}],
			},
		},
		uglify: {
			development: {
				files: jsFiles,
				options: {
					compress: {
						global_defs: {
							DEBUG: true,
						},
					},
					beautify: true,
					mangle: false,
					warnings: true,
				},
			},
			production: {
				files: jsFiles,
				options: {
					compress: {
						drop_console: true,
						unsafe: true,
						global_defs: {
							DEBUG: false,
						},
					},
					beautify: false,
					mangle: {
						toplevel: true,
					},
					warnings: true,
				},
			},
		},
		watch: {
			options: {
				spawn: false,
				atBegin: true,
			},
			sync: {
				files: ['app/assets/{img,font,etc}/**'],
				tasks: ['sync:all'],
			},
			uglify: {
				files: ['app/assets/js/**/*.js'],
				tasks: ['uglify:development'],
			},
			stylus: {
				files: ['app/assets/styl/**/*.styl'],
				tasks: ['stylus:development'],
			},
			jade: {
				files: ['app/views/**/*.jade'],
				tasks: ['jade:development'],
			},
			livereload: {
				files: ['webroot/static/css/**/*.css'],
				tasks: [],
				options: {
					livereload: true,
				},
			},
		},
		smoosher: {
			all: {
				files: {
					'webroot/index.html': 'webroot/index.html',
				},
			},
		},
		imageEmbed: {
			all: {
				src: ['webroot/static/css/main.css'],
				dest: 'webroot/static/css/main.css',
				options: {
					maxImageSize: 0,
					baseDir: 'webroot',
				},
			},
		},
	})

	grunt.registerTask('development', [
		'watch',
	])

	grunt.registerTask('production', [
		'clean:all',
		'sync:all',
		'stylus:production',
		'jade:production',
		'uglify:production',
		'cssmin:all',
		'htmlmin:all',
		'imageEmbed:all',
		'smoosher:all',
		'clean:all',
	])
}
