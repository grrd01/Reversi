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
                    'dist/Reversi/scripts/app.js': ['scripts/app.js']
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
                    'dist/Reversi/sw.js': ['sw.js']
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
                    {'dist/Reversi/images/2online.svg': 'images/2online.svg'},
                    {'dist/Reversi/images/2player.svg': 'images/2player.svg'},
                    {'dist/Reversi/images/4inarow.svg': 'images/4inarow.svg'},
                    {'dist/Reversi/images/bulp.svg': 'images/bulp.svg'},
                    {'dist/Reversi/images/design.svg': 'images/design.svg'},
                    {'dist/Reversi/images/dice.svg': 'images/dice.svg'},
                    {'dist/Reversi/images/down.svg': 'images/down.svg'},
                    {'dist/Reversi/images/easy.svg': 'images/easy.svg'},
                    {'dist/Reversi/images/hard.svg': 'images/hard.svg'},
                    {'dist/Reversi/images/icon.svg': 'images/icon.svg'},
                    {'dist/Reversi/images/info.svg': 'images/info.svg'},
                    {'dist/Reversi/images/language.svg': 'images/language.svg'},
                    {'dist/Reversi/images/mail.svg': 'images/mail.svg'},
                    {'dist/Reversi/images/medium.svg': 'images/medium.svg'},
                    {'dist/Reversi/images/memo.svg': 'images/memo.svg'},
                    {'dist/Reversi/images/ok.svg': 'images/ok.svg'},
                    {'dist/Reversi/images/player.svg': 'images/player.svg'},
                    {'dist/Reversi/images/puzzle.svg': 'images/puzzle.svg'},
                    {'dist/Reversi/images/settings.svg': 'images/settings.svg'},
                    {'dist/Reversi/images/sound_on.svg': 'images/sound_on.svg'},
                    {'dist/Reversi/images/stone_black.svg': 'images/stone_black.svg'},
                    {'dist/Reversi/images/stone_empty.svg': 'images/stone_empty.svg'},
                    {'dist/Reversi/images/stone_white.svg': 'images/stone_white.svg'},
                    {'dist/Reversi/images/tictactoe.svg': 'images/tictactoe.svg'},
                    {'dist/Reversi/images/x.svg': 'images/x.svg'}
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
                    dest: 'dist/Reversi/images'
                }]
            }
        },
        cssmin: {
            dist: {
                options: {
                    banner: "/*\n* grrd's Reversi\n* Copyright (c) 2022 Gerard Tyedmers, grrd@gmx.net\n* Licensed under the MPL-2.0 License\n*/\n"
                },
                files: {
                    'dist/Reversi/styles/app.css': ['styles/app.css']
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
                    {expand: true, flatten: true, src: ['dist/Reversi/index.html'], dest: 'dist/Reversi/'}
                ]
            }
        },
        copy: {
            main: {
                files: [
                    {expand: true, flatten: true, src: ['manifest/*'], dest: 'dist/Reversi/manifest/'},
                    {expand: true, flatten: true, src: ['**.txt'], dest: 'dist/Reversi/'},
                    {expand: true, flatten: true, src: ['**.md'], dest: 'dist/Reversi/'},
                    {expand: true, flatten: true, src: ['sounds/*'], dest: 'dist/Reversi/sounds/'},
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
