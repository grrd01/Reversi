#!/bin/env node
//  Reversi - Online version

(function() {

    var handler = function(req, res) {
        fs.readFile('./index.html', function (err, data) {
            if(err) throw err;
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.end(data);
        });
    };
    var app = require('http').createServer(handler);
    var io = require('socket.io').listen(app);
    var fs = require('fs');
    var usersPlaying = []; // array for all currently playing users
    var usersRegistered = []; // array for signin and register
    var ranking = []; // array for ranking

    //app.listen(process.env.OPENSHIFT_NODEJS_PORT, process.env.OPENSHIFT_NODEJS_IP);
    app.listen(3000);

    // a new player connects to the server:
    io.on('connection', function(socket){
        // create a new user
        var user = {
            id: socket.id, // the id of the new user (generated by socket.io)
            name: null,    // the name of the user after signin or register
            role: null,    // the role of the new player (player 1 or player 2)
            opponent: null // the id of his opponent
        };
        io.to(socket.id).emit("connected", user);

        // the player is registering in with username/password
        socket.on("register", function (data) {
            for(var i=0; i<usersRegistered.length; i++) {
                if (data.name == usersRegistered[i].name) {
                    io.to(user.id).emit("registerNameOccupied");
                    return;
                }
            }
            var newUser = {
                name: data.name,
                password: data.password,
                gamesPlayed: 0,
                gamesWon: 0,
                pointsWon: 0
            };
            // add new user to registered users
            usersRegistered.push(newUser);
            user.name = data.name;
            io.to(user.id).emit("registerOk");
        });

        // the player is logging in with username/password
        socket.on("signIn", function (data) {
            for(var i=0; i<usersRegistered.length; i++) {
                if (data.name == usersRegistered[i].name) {
                    if (data.password == usersRegistered[i].password) {
                        user.name = data.name;
                        io.to(user.id).emit("signInOk");
                    } else {
                        io.to(user.id).emit("signInWrongPw");
                    }
                    return;
                }
            }
            io.to(user.id).emit("signInUnknownUser");
        });

        // request to start a game
        socket.on("startPlay", function () {
            // add new user to array of all currently playing users
            user.opponent = null;
            usersPlaying.push(user);
            // try to start a game
            startPlay();
        });

        // the player played a move
        socket.on("play", function (data) {
            // send the move to his opponent
            io.to(data.to).emit("play", data);
        });

        // the player quit the game
        socket.on("stopPlay", function () {
            // tell his opponene, that the player left and the game ended
            if (user.opponent != null) {
                removeUser(user.opponent);
                io.to(user.opponent).emit("stopPlay");
            }
            // remove user from array of all currently playing users
            removeUser(user.id);
            user.opponent = null;
        });

        // the player disconnected:
        socket.on('disconnect', function () {
            // tell his opponene, that the player left and the game ended
            if (user.opponent != null) {
                removeUser(user.opponent);
                io.to(user.opponent).emit("stopPlay");
            }
            // remove user from array of all currently playingusers
            removeUser(user.id);
        });

        // the player sent metadata (name, image, ...)
        socket.on("userData", function (data) {
            // send metadata to his opponent
            io.to(data.to).emit("userData", data);
        });

        // the player asks for the ranking
        socket.on("ranking", function () {
            //create an array with the best 10 players plus the connected player (if connected)
            var ranking = [];
            var ranker;
            for(var i=0; i<usersRegistered.length; i++) {
                if (user.name == usersRegistered[i].name || i < 10) {
                    ranker = {
                        rank: i+1,
                        name: usersRegistered[i].name,
                        gamesPlayed: usersRegistered[i].gamesPlayed,
                        gamesWon: usersRegistered[i].gamesWon,
                        pointsWon: usersRegistered[i].pointsWon
                    };
                    ranking.push(ranker);
                }
            }
            // send the current ranking to the player
            io.to(user.id).emit("ranking", ranking);
        });

        // the player wants to update his score
        socket.on("rankingUpdate", function (data) {
            // update ranking
            for(var i=0; i<usersRegistered.length; i++) {
                if (data.name == usersRegistered[i].name && data.password == usersRegistered[i].password) {
                    usersRegistered[i].gamesPlayed++;
                    usersRegistered[i].gamesWon+= data.gamesWon;
                    usersRegistered[i].pointsWon+= data.pointsWon;
                }
            }
            usersRegistered.sort(function(a, b) {
                var x;
                x = a.pointsWon > b.pointsWon ? -1 : 1;
                return x;
            });
        });

    });

    // remove a user from the array of all currently playing users
    var removeUser = function(id) {
        for(var i=0; i<usersPlaying.length; i++) {
            if(id === usersPlaying[i].id) {
                usersPlaying.splice(i, 1);
                return;
            }
        }
    };

    // start a game if two players can be connected or tell the new player to wait for opponent
    var startPlay = function() {
        for(var i=0; i<usersPlaying.length; i++) {
            if (i == usersPlaying.length-1) {
                // no opponent available - tell the player he is connected and waiting for an opponent
                io.to(usersPlaying[i].id).emit("wait");
            } else {
                // opponent available
                if (usersPlaying[i].opponent == null) {
                    // set opponent-id for waiting player
                    usersPlaying[i].opponent = usersPlaying[usersPlaying.length-1].id;
                    // set role of waiting player to player 1
                    usersPlaying[i].role = "0";
                    // tell waiting player, the game has starded
                    io.to(usersPlaying[i].id).emit("startPlay", usersPlaying[i]);
                    // set opponent-id for new player
                    usersPlaying[usersPlaying.length-1].opponent = usersPlaying[i].id;
                    // set role of new player to player 2
                    usersPlaying[usersPlaying.length-1].role = "1";
                    // tell new player, the game has started
                    io.to(usersPlaying[usersPlaying.length-1].id).emit("startPlay", usersPlaying[usersPlaying.length-1]);
                    break;
                }
            }
        }
    };

})();
