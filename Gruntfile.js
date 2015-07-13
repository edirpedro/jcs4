module.exports = function(grunt) {

	require('load-grunt-tasks')(grunt);
	
	grunt.initConfig({

		pkg: grunt.file.readJSON('package.json'),

		// Processing Animations
		concat: {
			dist: {
				files: {
					'css/animations.css': ['css/animations/**/*.css'],
				}
			}
		},

		autoprefixer: { // https://github.com/nDmitry/grunt-autoprefixer
			options: {
				browsers: ['last 2 versions', 'bb 10']
			},
			no_dest: {
				src: ['css/animations.css', 'css/animations.pack.css']
			}
		},

		cssmin: {
			target: {
				files: [{
					src: ['css/animations.css'],
					dest: 'css/animations.min.css'
				},
				{
					src: ['css/animations.pack.css'],
					dest: 'css/animations.pack.min.css'
				}]
			}
		},
		
		animationslist: {
			files: {
				src: ['css/animations/**/*.css'],
				dest: 'animations.json'
			}
		},
		
		animationspack: {
			files: {
				src: ['animations.pack.json'],
				dest: 'css/animations.pack.css'
			}
		},

		// Processing jCS4
		uglify: {
			options: {
				preserveComments: 'some'
			},
			my_target: {
				files: {
					'js/jquery.jcs4.min.js': ['js/jquery.jcs4.js']
				}
			}
		},

		// Whaching
		watch: {
			animations: {
				files: ['css/animations/**/*'],
				tasks: ['animations']
			},
			jcs4: {
				files: ['js/jquery.jcs4.js'],
				tasks: ['jcs4']
			}
		}

	});
	
	// Creating the animations JSON list
	grunt.registerMultiTask('animationslist', 'Creating the animations JSON list', function () {	

		this.files.forEach(function(f) {
			var animations = {};
			var pattern = /css\/animations\/(\w+)\/(\w+)\.css/;
			
			f.src.map(function(filepath, index) {
				var matches = pattern.exec(filepath);
				if (matches) {
					var cat = matches[1];
					var animation = matches[2];
					if (!(cat in animations))
						animations[cat] = [];
					animations[cat].push(animation);
				}
			});
			
			grunt.file.write(f.dest, JSON.stringify(animations, null, '\t'));              
			grunt.log.writeln('File "' + f.dest + '" created.');
		});
			
	});


	// Creating the animations pack, with only the animations used in the project
	grunt.registerMultiTask('animationspack', 'Creating the animations package', function () {	
	
		this.files.forEach(function(f) {
			var categories = grunt.file.readJSON(f.src);
			var target = [];
			var count = 0;
			
			for (category in categories) {
				if (categories.hasOwnProperty(category)) {
					files = categories[category];
					for (file in files) {
						if (files.hasOwnProperty(file) && files[file]) {
							target.push('css/animations/' + category + '/' + files[file] + '.css');
							count += 1;
						}
					}
				}
			}

			var concat = grunt.config.get('concat');
			concat.dist.files[f.dest] = target;
			
			grunt.config('concat', concat);
			grunt.log.writeln('Animations pack with ' + count + ' effects.');
		});
		
	});


	// Register task
	grunt.registerTask('animations', ['animationslist', 'animationspack', 'concat', 'autoprefixer', 'cssmin']);
	grunt.registerTask('jcs4', ['uglify']);
	grunt.registerTask('default', ['animationslist', 'animationspack', 'concat', 'autoprefixer', 'cssmin', 'uglify']);
	grunt.registerTask('dev', ['watch']);

};