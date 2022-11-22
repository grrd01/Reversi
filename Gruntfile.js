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
                    '../../2_Build/Reversi/scripts/app.js': ['scripts/app.js']
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
                    '../../2_Build/Reversi/sw.js': ['sw.js']
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
                    {'../../2_Build/Reversi/images/2online.svg': 'images/2online.svg'},
                    {'../../2_Build/Reversi/images/2player.svg': 'images/2player.svg'},
                    {'../../2_Build/Reversi/images/4inarow.svg': 'images/4inarow.svg'},
                    {'../../2_Build/Reversi/images/bulp.svg': 'images/bulp.svg'},
                    {'../../2_Build/Reversi/images/dice.svg': 'images/dice.svg'},
                    {'../../2_Build/Reversi/images/down.svg': 'images/down.svg'},
                    {'../../2_Build/Reversi/images/easy.svg': 'images/easy.svg'},
                    {'../../2_Build/Reversi/images/hard.svg': 'images/hard.svg'},
                    {'../../2_Build/Reversi/images/icon.svg': 'images/icon.svg'},
                    {'../../2_Build/Reversi/images/info.svg': 'images/info.svg'},
                    {'../../2_Build/Reversi/images/language.svg': 'images/language.svg'},
                    {'../../2_Build/Reversi/images/mail.svg': 'images/mail.svg'},
                    {'../../2_Build/Reversi/images/medium.svg': 'images/medium.svg'},
                    {'../../2_Build/Reversi/images/memo.svg': 'images/memo.svg'},
                    {'../../2_Build/Reversi/images/ok.svg': 'images/ok.svg'},
                    {'../../2_Build/Reversi/images/puzzle.svg': 'images/puzzle.svg'},
                    {'../../2_Build/Reversi/images/settings.svg': 'images/settings.svg'},
                    {'../../2_Build/Reversi/images/sound_on.svg': 'images/sound_on.svg'},
                    {'../../2_Build/Reversi/images/stone_black.svg': 'images/stone_black.svg'},
                    {'../../2_Build/Reversi/images/stone_empty.svg': 'images/stone_empty.svg'},
                    {'../../2_Build/Reversi/images/stone_white.svg': 'images/stone_white.svg'},
                    {'../../2_Build/Reversi/images/tictactoe.svg': 'images/tictactoe.svg'},
                    {'../../2_Build/Reversi/images/x.svg': 'images/x.svg'}
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
                    dest: '../../2_Build/Reversi/images'
                }]
            }
        },
        cssmin: {
            dist: {
                options: {
                    banner: "/*\n* grrd's Reversi\n* Copyright (c) 2022 Gerard Tyedmers, grrd@gmx.net\n* Licensed under the MPL-2.0 License\n*/\n"
                },
                files: {
                    '../../2_Build/Reversi/styles/app.css': ['styles/app.css']
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
                    dest: '../../2_Build/Reversi'
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
                    {expand: true, flatten: true, src: ['../../2_Build/Reversi/index.html'], dest: '../../2_Build/Reversi/'}
                ]
            }
        },
        copy: {
            main: {
                files: [
                    {expand: true, flatten: true, src: ['manifest/*'], dest: '../../2_Build/Reversi/manifest/'},
                    {expand: true, flatten: true, src: ['**.txt'], dest: '../../2_Build/Reversi/'},
                    {expand: true, flatten: true, src: ['**.md'], dest: '../../2_Build/Reversi/'},
                    {expand: true, flatten: true, src: ['sounds/*'], dest: '../../2_Build/Reversi/sounds/'}
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
