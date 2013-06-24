module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      options: {
        undef: true,
        unused: false,
        browser: true,
        devel: true,
        globals: {
          require: false,
          define: false
        }
      },
      files: ['client/scripts/**/*.js']
      // files: ['client/scripts/main.js']
    },
    watch: {
      files: ['<%= jshint.files %>'],
      tasks: ['jshint']
    },
    notify_hooks: {
      options: {
        enabled: true,
        max_jshint_notifications: 1, // maximum number of notifications from jshint output
      }
    }
  });

  grunt.loadNpmTasks('grunt-notify');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');

  // Default task(s).
  grunt.registerTask('default', ['jshint']);

  // This is required if you use any options.
  grunt.task.run('notify_hooks');
};