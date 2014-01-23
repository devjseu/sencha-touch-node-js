/*global module, global*/
module.exports = function (grunt) {

    grunt.initConfig({
        /**
         * Validate the source code files to ensure they
         * follow our coding convention and
         * dont contain any common errors.
         */
        jshint: {
            all: [
                "Gruntfile.js",
                "public/app.js",
                "public/app/**/*.js",
                "public/app-test/specs/*.js",
                "!touch/**/*.js",
                "application/**/*.js",
                "application-test/**/*.js",
                "direct/*.js"
            ],
            options: {
                trailing: true,
                eqeqeq: true
            }
        },
        /**
         * Setup Jasmine and runs them using PhantomJS.
         */
        sencha_touch_jasmine: {
            options: {
                specs: ["public/app-test/specs/**/*.js"],
                extFramework: "public/touch",
                extLoaderPaths: {
                    "TutsApp": "public/app"
                },
                extAppName: 'TutsApp'
            },
            app: {
                extLoaderPaths: {
                    "TutsApp": "public/app"
                }
            }
        },
        nodeunit: {
            all: ['application-test/test/**/*.js']
        },
        watch: {
            backend: {
                files: [
                    'application-test/**/*.js',
                    'application/**/*.js',
                    'direct/*.js'
                ],
                tasks: ['jshint', 'nodeunit'],
                options: {
                    spawn: true
                }
            },
            frontend : {
                files: [
                    'public/app/**/*.js',
                    'public/app-test/**/*.js',
                    'public/app.js'
                ],
                tasks: ['jshint', 'sencha_touch_jasmine:app'],
                options: {
                    spawn: true
                }
            }
        },
        nodemon: {
            dev: {
                options: {
                    file: 'app.js',
                    args: ['production'],
                    nodeArgs: ['--debug'],
                    ignoredFiles: ['README.md', 'node_modules/**', '/public'],
                    watchedExtensions: ['js'],
                    watchedFolders: [
                        'application',
                        'application/helper',
                        'application/model',
                        'direct'
                    ],
                    delayTime: 1,
                    legacyWatch: true,
                    env: {
                        PORT: '8181'
                    },
                    cwd: __dirname
                }
            }
        },
        'node-inspector': {
            custom: {
                options: {
                    'web-port': 8182,
                    'web-host': 'localhost',
                    'debug-port': 5858,
                    'save-live-edit': true
                }
            }
        },
        concurrent: {
            dev: {
                tasks: ['node-inspector', 'nodemon'],
                options: {
                    logConcurrentOutput: true
                }
            }
        }
    });

    grunt.loadNpmTasks("grunt-contrib-jshint");
    grunt.loadNpmTasks("grunt-sencha-jasmine");
    grunt.loadNpmTasks("grunt-contrib-watch");
    grunt.loadNpmTasks("grunt-contrib-nodeunit");
    grunt.loadNpmTasks('grunt-nodemon');
    grunt.loadNpmTasks('grunt-node-inspector');
    grunt.loadNpmTasks('grunt-concurrent');

    grunt.registerTask("default", [
        "jshint"
    ]);
    grunt.registerTask("test-frontend", ["watch:frontend"]);
    grunt.registerTask("test-backend", ["watch:backend"]);
    grunt.registerTask("server", ["concurrent"]);

};