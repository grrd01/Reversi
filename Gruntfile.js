module.exports = function(grunt) {
    require('load-grunt-tasks')(grunt);
    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        terser: {
            one: {
                options: {
                    compress: true,
                    mangle: true,
                    output: {
                        comments: 'some'
                    }
                },
                files: {
                    'dist/scripts/app.js': ['scripts/app.js']
                }
            },
            two: {
                options: {
                    compress: true,
                    mangle: true,
                    output: {
                        comments: 'some'
                    }
                },
                files: {
                    'dist/sw.js': ['sw.js']
                }
            }
        },
        svgmin: {
            options: {
                plugins: [
                    {removeUnknownsAndDefaults: false},
                    {removeViewBox: false}
                ]
            },
            dist: {
                files: [
                    {'dist/images/2online.svg': 'images/2online.svg'},
                    {'dist/images/2player.svg': 'images/2player.svg'},
                    {'dist/images/4inarow.svg': 'images/4inarow.svg'},
                    {'dist/images/bulp.svg': 'images/bulp.svg'},
                    {'dist/images/design.svg': 'images/design.svg'},
                    {'dist/images/dice.svg': 'images/dice.svg'},
                    {'dist/images/down.svg': 'images/down.svg'},
                    {'dist/images/easy.svg': 'images/easy.svg'},
                    {'dist/images/hard.svg': 'images/hard.svg'},
                    {'dist/images/icon.svg': 'images/icon.svg'},
                    {'dist/images/info.svg': 'images/info.svg'},
                    {'dist/images/language.svg': 'images/language.svg'},
                    {'dist/images/mail.svg': 'images/mail.svg'},
                    {'dist/images/medium.svg': 'images/medium.svg'},
                    {'dist/images/memo.svg': 'images/memo.svg'},
                    {'dist/images/ok.svg': 'images/ok.svg'},
                    {'dist/images/player.svg': 'images/player.svg'},
                    {'dist/images/puzzle.svg': 'images/puzzle.svg'},
                    {'dist/images/settings.svg': 'images/settings.svg'},
                    {'dist/images/sound_on.svg': 'images/sound_on.svg'},
                    {'dist/images/stone_black.svg': 'images/stone_black.svg'},
                    {'dist/images/stone_empty.svg': 'images/stone_empty.svg'},
                    {'dist/images/stone_white.svg': 'images/stone_white.svg'},
                    {'dist/images/tictactoe.svg': 'images/tictactoe.svg'},
                    {'dist/images/x.svg': 'images/x.svg'}
                ]
            }
        },
        imagemin: {
            dynamic: {
                options: {
                    optimizationLevel: 3
                },
                files: [{
                    expand: true,
                    cwd: 'images/',
                    src: ['**/*.{png,jpg,gif}'],
                    dest: 'dist/images'
                }]
            }
        },
        cssmin: {
            dist: {
                options: {
                    banner: "/*\n* grrd's Reversi\n* Copyright (c) 2022 Gerard Tyedmers, grrd@gmx.net\n* Licensed under the MPL-2.0 License\n*/\n"
                },
                files: {
                    'dist/styles/app.css': ['styles/app.css']
                }
            }
        },
        htmlmin: {
            dist: {
                options: {
                    removeComments: true,
                    collapseWhitespace: true
                },
                files: [{
                    expand: true,
                    src: 'index.html',
                    dest: 'dist/Reversi'
                }]
            }
        },
        replace: {
            dist: {
                options: {
                    patterns: [
                        {
                            match: /\<\!DOCTYPE html\>/g,
                            replacement: function () {
                                return "<!DOCTYPE html>\n<!-- \n* grrd's Reversi \n* Copyright (c) 2022 Gerard Tyedmers, grrd@gmx.net \n* Licensed under the MPL-2.0 License\n-->\n";
                            }
                        }
                    ]
                },
                files: [
                    {expand: true, flatten: true, src: ['dist/index.html'], dest: 'dist/'}
                ]
            }
        },
        copy: {
            main: {
                files: [
                    {expand: true, flatten: true, src: ['manifest/*'], dest: 'dist/manifest/'},
                    {expand: true, flatten: true, src: ['**.txt'], dest: 'dist/'},
                    {expand: true, flatten: true, src: ['**.md'], dest: 'dist/'},
                    {expand: true, flatten: true, src: ['sounds/*'], dest: 'dist/sounds/'},
                    {expand: true, flatten: true, src: ['CNAME'], dest: 'dist/'}
                ]
            }
        }
    });

    grunt.loadNpmTasks('grunt-terser');
    grunt.loadNpmTasks('grunt-contrib-imagemin');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-htmlmin');
    grunt.loadNpmTasks('grunt-replace');
    grunt.loadNpmTasks('grunt-contrib-copy');

    grunt.registerTask('default', [
        'terser',
        'svgmin',
        'imagemin',
        'cssmin',
        'htmlmin',
        'replace',
        'copy'
    ]);
};
