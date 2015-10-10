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
        eqnull: true
      },
      gruntfile: {
        src: 'Gruntfile.js'
      },
      ledger: {
        options: {
          '-W055': true,
          '-W064': true,
          globals: {
            jQuery: true,
            document: true,
            define: true,
            require: true,
            window: true
          }
        },
        src: ['public/js/ledger/**/*.js']
      }
    },

    copy: {
      vendor: {
        files: [
          { src: 'bower_components/backbone/backbone.js', dest: 'public/js/vendor/backbone.js' },
          { src: 'bower_components/backbone.marionette/lib/backbone.marionette.js', dest: 'public/js/vendor/backbone.marionette.js' },
          { src: 'bower_components/bootstrap/docs/assets/js/bootstrap.js', dest: 'public/js/vendor/bootstrap.js' },
          { src: 'bower_components/d3/d3.js', dest: 'public/js/vendor/d3.js' },
          { src: 'bower_components/jquery/jquery.js', dest: 'public/js/vendor/jquery.js' },
          { src: 'bower_components/nvd3/build/nv.d3.js', dest: 'public/js/vendor/nv.d3.js' },
          { src: 'bower_components/nvd3/build/nv.d3.css', dest: 'public/css/vendor/nv.d3.css' },
          { src: 'bower_components/react/react.js', dest: 'public/js/vendor/react.js' },
          { src: 'bower_components/requirejs/require.js', dest: 'public/js/vendor/require.js' },
          { src: 'bower_components/requirejs-tpl/tpl.js', dest: 'public/js/vendor/tpl.js' },
          { src: 'bower_components/underscore/underscore.js', dest: 'public/js/vendor/underscore.js' }
        ]
      }
    },

    react: {
      jsx: {
        files: [
          {
            expand: true,
            cwd: 'public/js/ledger',
            src: [ '**/*.jsx' ],
            dest: 'public/js/ledger',
            ext: '.js'
          }
        ]
      }
    },

    recess: {
      dist: {
        src: [
          'bower_components/bootstrap/less/bootstrap.less',
          'bower_components/bootstrap/less/responsive.less',
          'public/css/less/app.less'
        ],
        dest: 'public/css/main.css',
        options: {
          compile: true,
          compress: true
        }
      }
    },

    requirejs: {
      compile: {
        options: {
          baseUrl: 'public/js/ledger',
          mainConfigFile: 'public/js/ledger/main.js',
          name: 'main',
          out: 'public/js/ledger.js'
        }
      }
    },

    watch: {
      gruntfile: {
        files: '<%= jshint.gruntfile.src %>',
        tasks: ['jshint:gruntfile']
      },
      lib: {
        files: '<%= jshint.lib.src %>',
        tasks: ['jshint:lib']
      },
      react: {
        files: 'public/js/ledger/**/*.jsx',
        tasks: ['react']
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-requirejs');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-react');
  grunt.loadNpmTasks('grunt-recess');

  // Default task.
  grunt.registerTask('default', ['copy', 'recess', 'requirejs']);
};