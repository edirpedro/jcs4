module.exports = function(grunt) {

    require('load-grunt-tasks')(grunt);

    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),

		// Processing Animate.css
        concat: {
            dist: {
                src: ['css/animate/_base.css', 'css/animate/**/*.css'],
                dest: 'css/animate.css'
            }
        },

        autoprefixer: { // https://github.com/nDmitry/grunt-autoprefixer
            options: {
                browsers: ['last 2 versions', 'bb 10']
            },
            no_dest: {
                src: 'css/animate.css'
            }
        },

        cssmin: {
            minify: {
                src: ['css/animate.css'],
                dest: 'css/animate.min.css',
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
            css: {
                files: ['css/animate/**/*', 'js/jquery.jcs4.js'],
                tasks: ['default']
            }
        }

    });

    // register task
    grunt.registerTask('default', ['concat', 'autoprefixer', 'cssmin', 'uglify']);
    grunt.registerTask('dev', ['watch']);

};