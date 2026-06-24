/*
 * grrd's Reversi
 * Copyright (c) 2022 Gerard Tyedmers, grrd@gmx.net
 * Licensed under the MPL License
 *
 * Instructions:
 * - Install node (https://nodejs.org/en/)
 * - Install dependencies: npm install (in the path where package.json is)
 * - Start the application: node reversi_server.js (in the path where reversi_server.js is)
 * - Start in background (Linux): nohup node reversi_server.js &
 *
 * Useful Commands:
 * - get Version of Node: node -v
 * - get Version of NPM: npm -v
 * - get installed Packages: npm ls --depth=0
 * - set debug level: set DEBUG=*
 * - see running node-apps: pm2 list
 *
 * Useful Paths:
 * - /srv/reversi/reversi_server.js - Node-Script
 * - /etc/nginx/sites-available/default - WebServer-Config
 * - /var/www/html - WebServer Root-Verzeichnis
 * - /etc/letsencrypt/live/grrd.duckdns.org - letsencrypt-Zertifikate
 */

/*jslint browser:true, for:true */ /*global  require __dirname */

(function () {
    "use strict";

    const fs = require("fs");

    const options = {
        key: fs.readFileSync("/etc/letsencrypt/live/grrd.duckdns.org/privkey.pem"),
        cert: fs.readFileSync("/etc/letsencrypt/live/grrd.duckdns.org/fullchain.pem")
    };

    function handler(ignore, res) {
        fs.readFile(
            __dirname + "/index.html",
            function (err, data) {
                if (err) {
                    res.writeHead(500);
                    return res.end("Error loading index.html");
                }

                res.writeHead(200);
                res.end(data);
            }
        );
    }

    // Start App on Server:
    const app = require("https").createServer(options, handler);

    // Start App on LocalHost:
    //const app = require("http").createServer(handler);

    const io = require("socket.io")(app, {
        cors: {
            origin: "*"
        }
    });
    const Moniker = require("moniker");
    app.listen(4000);

    const users = [];

    const startgame = function () {
        for (let i = 0; i < users.length; i += 1) {
            if (i === users.length - 1) {
                // kein freier Gegner
                io.to(users[i].id).emit("waiting");
            } else {
                // Gegner vorhanden
                if (users[i].opponent === null) {
                    users[i].opponent = users[users.length - 1].id;
                    users[i].role = "0";
                    io.to(users[i].id).emit("startgame", users[i]);
                    users[users.length - 1].opponent = users[i].id;
                    users[users.length - 1].role = "1";
                    io.to(users[users.length - 1].id).emit("startgame", users[users.length - 1]);
                    break;
                }
            }
        }
    };

    const addUser = function (socket) {
        const user = {
            name: Moniker.choose(),
            id: socket.id,
            role: null,
            opponent: null
        };
        users.push(user);
        startgame();
        return user;
    };

    const removeUser = function (user) {
        for (let i = 0; i < users.length; i += 1) {
            if (user.name === users[i].name) {
                users.splice(i, 1);
                return;
            }
        }
    };

    io.on("connection", function (socket) {
        const user = addUser(socket);

        socket.on("disconnect", function () {
            if (user.opponent !== null) {
                io.to(user.opponent).emit("quit", user);
            }
            removeUser(user);
        });

        socket.on("playsend", function (data) {
            io.to(data.to).emit("playget", data);
        });

        socket.on("usersend", function (data) {
            io.to(data.to).emit("userget", data);
        });

    });

}());
