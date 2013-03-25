/*global module:false*/
module.exports = function(grunt) {
  grunt.initConfig({
    jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        unused: true,
        boss: true,
        eqnull: true,
        globals: {
          jQuery: true
        }
      },
      gruntfile: {
        src: 'Gruntfile.js'
      },
      lib_test: {
        src: ['lib/**/*.js', 'test/**/*.js']
      }
    },
    recess: {
      dist: {
        src: [
          'components/bootstrap/less/bootstrap.less',
          'components/bootstrap/less/responsive.less',
          'public/css/less/app.less'
        ],
        dest: 'public/css/main.css',
        options: {
          compile: true,
          compress: true
        }
      }
    },
    concat: {
      js: {
        src: [
          'components/jquery/jquery.min.js',
          'components/modernizr/modernizr.js'
        ],
        dest: 'public/js/scripts.js'
      }
    },
    watch: {
      gruntfile: {
        files: '<%= jshint.gruntfile.src %>',
        tasks: ['jshint:gruntfile']
      },
      lib_test: {
        files: '<%= jshint.lib_test.src %>',
        tasks: ['jshint:lib_test', 'nodeunit']
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-recess');
    
  // Default task.
  grunt.registerTask('default', ['jshint', 'recess', 'concat']);
};