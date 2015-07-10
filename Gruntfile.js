module.exports = function(grunt) {

	require('load-grunt-tasks')(grunt);
	
	grunt.initConfig({

		pkg: grunt.file.readJSON('package.json'),

		// Processing Animations
		concat: {
			dist: {
				src: ['css/animations/_base.css', 'css/animations/**/*.css'],
				dest: 'css/animations.css'
			}
		},

		autoprefixer: { // https://github.com/nDmitry/grunt-autoprefixer
			options: {
				browsers: ['last 2 versions', 'bb 10']
			},
			no_dest: {
				src: 'css/animations.css'
			}
		},

		cssmin: {
			minify: {
				src: ['css/animations.css'],
				dest: 'css/animations.min.css'
			}
		},
		
		animationlist: {
			files: {
				src: ['css/animations/**/*.css'],
				dest: 'animations.json'
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
	grunt.registerMultiTask('animationlist', 'Creating the animations JSON list', function () {	

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


	// Register task
	grunt.registerTask('animations', ['concat', 'autoprefixer', 'cssmin', 'animationlist']);
	grunt.registerTask('jcs4', ['uglify']);
	grunt.registerTask('default', ['concat', 'autoprefixer', 'cssmin', 'animationlist', 'uglify']);
	grunt.registerTask('dev', ['watch']);

};