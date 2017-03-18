module.exports = function(grunt) {
    'use strict';

    grunt.loadNpmTasks('assemble-less');
    grunt.loadNpmTasks("grunt-browserify");
    grunt.loadNpmTasks("grunt-contrib-watch");
    grunt.loadNpmTasks("grunt-contrib-copy");

    grunt.initConfig({
        copy: {
            main: {
                files: [
                    {src: ["src/index.html"], dest: "build/index.html"}
                ]
            }
        },
        browserify: {
            options: {
                browserifyOptions: {
                    debug: true
                },
                transform: [
                    ["babelify", {presets: ["es2015", "stage-0", "react"]}]
                ]
            }, 
            main: {
                dest: "build/main.js",
                src: "src/main.js"
            }
        },

        less: {
            dev: {
                files: {
                    'build/css/app.css': 'src/less/app.less'
                }
            }
        },

        watch: {
            scripts: {
                files: "src/**/*.js",
                tasks: ["browserify"]
            },
            less: {
                files: ['src/less/**/*.less'],
                tasks: ['less'],
            },
            html: {
                files: ["src/index.html"],
                tasks: ["copy"]
            }
        }
    });

    grunt.registerTask('default', ['copy', 'less', 'browserify']);
    grunt.registerTask('dev', ['default', 'watch']);
};
