module.exports = function (grunt)
{
  grunt.initConfig ({

    // UGLIFY TASK {

    uglify: {
      options: {
        report:           'min',
        compress:         true,
        mangle:           true,
        beautify:         false,
        preserveComments: false,
        banner:           '/* Copyright 2014 Cláudio Silva */\n'
      },
      lib:     {
        src:  'minitemp.js',
        dest: 'minitemp.min.js'
      }
    }

  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks ('grunt-contrib-uglify');

  //------------------------------------------------------------------------------------------------------------------------
  // Default task: Build All
  //------------------------------------------------------------------------------------------------------------------------
  grunt.registerTask ('default', ['uglify:lib']);

};
