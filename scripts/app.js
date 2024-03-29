/**
 * grrd's Reversi
 * Copyright (c) 2022 Gerard Tyedmers, grrd@gmx.net
 * @license MPL-2.0
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

// todo: alle Steine animiert switchen
// todo: name in localstorage

(function () {
    "use strict";

    // Localization
    let nLang = 0;
    const lLoc = [{
        lCode: "en",
        lLang: "English",
        lDesc: "grrd's Reversi is a free HTML5 Game that works offline.",
        l2Players: "2 Players",
        lEasy: "Easy",
        lMedium: "Medium",
        lHard: "Hard",
        lOnline: "Online",
        lWait: "Waiting for player 2 ...",
        lWait2: "You can play a 1 player game meanwhile.",
        lLeft: "Your opponent has left the game.",
        lHelp: "Place your stone so that at least one of your opponent's stones is flanked by your stones. " +
            "All of your opponent's stones between your pieces are then flipped over to become your color. \n" +
            "The object of the game is to own more stones than your opponent when the game is over. ",
        lDev: "Developed by Gérard Tyedmers.",
        lLook: "Have a look at my other games:",
        lName: "Enter your name",
        lSelLang: "Select language",
        lDesign: "Select design",
        lStyle: ["Light", "Dark", "Automatic"],
        lShow: "Show possible moves",
        lSound: "Play sounds",
        lBegin: " begins.",
        lOver: "Game over. ",
        lWin: " wins!",
        lDraw: " It's a draw!",
        lTurn: "'s turn.",
        lNoMove: " can't move. ",
        lNobodyMove: "Game over, no player can move. ",
        lNotHere: " can't play here.",
        lComputer: "Computer",
        lPlayer: "Player",
        lStones: "Stones",
        lGames: "Games",
        lAgain: "Play again?",
        lYes: "Yes",
        lNo: "No"
    }, {
        lCode: "de",
        lLang: "Deutsch",
        lDesc: "grrd's Reversi ist ein kostenloses HTML5 Spiel, welches offline funktioniert.",
        l2Players: "2 Spieler",
        lEasy: "Einfach",
        lMedium: "Mittel",
        lHard: "Schwer",
        lOnline: "Online",
        lWait: "Warte auf Spieler 2 ...",
        lWait2: "Du kannst unterdessen ein Einzelspieler-Spiel starten.",
        lLeft: "Dein Gegner hat das Spiel verlassen.",
        lHelp: "Platziere deinen Stein so, dass er mindestens einen Stein deines Gegners einklemmt. " +
            "Alle eingeklemmten Steine werden dann umgedreht und wechseln zu deiner Farbe.\n" +
            "Ziel des Spiels ist es, beim Spielende mehr Steine als der Gegner zu haben. ",
        lDev: "Entwickelt von Gérard Tyedmers.",
        lLook: "Schau dir auch meine anderen Spiele an:",
        lName: "Namen eingeben",
        lSelLang: "Sprache wählen",
        lDesign: "Design wählen",
        lStyle: ["Hell", "Dunkel", "Automatisch"],
        lShow: "Mögliche Züge anzeigen",
        lSound: "Töne abspielen",
        lBegin: " beginnt.",
        lOver: "Spiel beendet. ",
        lWin: " gewinnt!",
        lDraw: " Unentschieden!",
        lTurn: " ist am Zug.",
        lNoMove: " kann nicht ziehen. ",
        lNobodyMove: "Spiel beendet, kein Spieler kann ziehen. ",
        lNotHere: " kann hier nicht spielen.",
        lComputer: "Computer",
        lPlayer: "Spieler",
        lStones: "Steine",
        lGames: "Spiele",
        lAgain: "Nochmals spielen?",
        lYes: "Ja",
        lNo: "Nein"
    }, {
        lCode: "fr",
        lLang: "Francais",
        lDesc: "grrd's Reversi est un jeu en HTML5 qui fonctionne hors ligne.",
        l2Players: "2 Joueurs",
        lEasy: "Simple",
        lMedium: "Moyens",
        lHard: "Difficile",
        lOnline: "En ligne",
        lWait: "En attente pour joueur 2 ...",
        lWait2: "Tu peux en attendant commencer un jeu à joueur unique.",
        lLeft: "Ton adversaire a quitté le match.",
        lHelp: "Place ton pion de manière à ce qu'il coince au moins un pion de ton adversaire. " +
            "Tous les pions coincés sont alors retournés et changent de couleur. " +
            "Le but du jeu est d'avoir plus de pions que l'adversaire à la fin de la partie. ",
        lDev: "Développé par Gérard Tyedmers.",
        lLook: "Regarde aussi mes autres jeux:",
        lName: "Choisir ton nom",
        lSelLang: "Choisir la langue",
        lDesign: "Choisir la vue",
        lStyle: ["Clair", "Sombre", "Automatique"],
        lShow: "Afficher les mouvements possibles",
        lSound: "Jouer des sons",
        lBegin: " commence.",
        lOver: "Jeu terminé. ",
        lWin: " gagne!",
        lDraw: " Match nul!",
        lTurn: " au tour.",
        lNoMove: " ne peut pas jouer. ",
        lNobodyMove: "Jeu terminé, aucun joueur ne peut bouger. ",
        lNotHere: " ne peut pas jouer ici.",
        lComputer: "Ordinateur",
        lPlayer: "Joueur",
        lStones: "Pions",
        lGames: "Jeux",
        lAgain: "Un autre jeu?",
        lYes: "Oui",
        lNo: "Non"
    }];

    // Spieler, welcher am Zug ist (0/1)
    let nCurrentPlayer = 0;
    // Spieler, welcher die Partie beginnt (0/1)
    let nStartPlayer = 0;
    // Rolle der beiden Spieler: human, easy, medium, hard, online
    let cModus = [];
    // Namen der beiden Spieler
    let cName = [];
    // Gewonnene Spiele pro Spieler
    let nGames = [];
    // Verbindung für Online-Spiele
    let socket;
    // Daten der Online-Spieler
    let user;
    // Zähler für die Runden einer Partie
    let nCountRound = 0;
    let nLastRound = 0;
    // Flag zum Verhindern doppelter Resets bei Online-Spielen
    let bResetNeeded = false;
    // Array der Farben der beiden Spieler
    const lColor = ["black","white"];
    // Array der Stein-Bilder der beiden Spieler
    const lStoneImg = ["<img class='w25' src='images/stone_black.svg' alt='Black'>", "<img class='w25' src='images/stone_white.svg' alt='White'>"];
    // Element mit der übergebenen ID zurückgeben
    const $ = function (oID) {
        return document.getElementById(oID);
    };
    // Spielfeld-Element mit allen Feldern als Children
    const oPlayground = $("iPlayground");
    // Nachricht
    const oMessage = $("iMessage")

    // mögliche Spielzüge anzeigen
    let bShowMoves = true;
    // Töne abspielen
    let bSound = true;

    // prüfen, ob LocalStorage verfügbar ist
    const localStorageOK = (function () {
        const mod = "modernizr";
        try {
            localStorage.setItem(mod, mod);
            localStorage.removeItem(mod);
            return true;
        } catch (ignore) {
            return false;
        }
    }());

    /**
     * URL-Parameter zurückgeben
     * @param {string} cKey - Schlüssel des URL-Parameters
     * @return {string} Gibt den Wert des angefragten URL-Parameters zurück
     */
    function fUrlParam(cKey) {
        let searchParams = new URLSearchParams(window.location.search);
        if (searchParams.has(cKey)) {
            return searchParams.get(cKey);
        } else {
            return false;
        }
    }

    /**
     * Texte übersetzen
     */
    function fSetLang() {
        if (nLang) {
            document.documentElement.setAttribute("lang", lLoc[nLang].lCode);
        }
        document.querySelector("meta[name='description']").setAttribute("content", lLoc[nLang].lDesc);
        document.querySelectorAll('#iStyle option').forEach(function(oOption,nIndex) {
            oOption.innerHTML = lLoc[nLang].lStyle[nIndex];
        });
        document.querySelectorAll(`[id^="l"]`).forEach(function(eElement) {
            eElement.innerHTML = lLoc[nLang][eElement.id];
        });
    }

    /**
     * Spielfeld zurücksetzen, damit ein neues Spiel möglich wird
     */
    function fResetGame () {
        let lPossibleMoves;
        for (const oStone of oPlayground.children) {
            oStone.className = "empty";
        }

        oPlayground.children[28].className = lColor[0];
        oPlayground.children[35].className = lColor[0];
        oPlayground.children[27].className = lColor[1];
        oPlayground.children[36].className = lColor[1];

        nCountRound = 0;
        nLastRound = 0;
        nCurrentPlayer = nStartPlayer;
        lPossibleMoves = fPossibleMoves(fCurrentPlayground ());
        oMessage.innerHTML = lStoneImg[nCurrentPlayer] + " " + cName[nCurrentPlayer] + " " + lLoc[nLang].lBegin;
        $("iScore1").innerHTML = lStoneImg[0] + " " + document.getElementsByClassName(lColor[0]).length;
        $("iScore2").innerHTML = document.getElementsByClassName(lColor[1]).length + " " + lStoneImg[1];

        if (cModus[nCurrentPlayer] !== "human" && cModus[nCurrentPlayer] !== "online") {
            fAI(lPossibleMoves)
        } else if (bShowMoves && cModus[nCurrentPlayer] === "human") {
            for (const oPossibleMove of lPossibleMoves) {
                oPlayground.children[oPossibleMove.nID].classList.add("ok");
            }
        }
        bResetNeeded = false;
    }

    /**
     * zu Spielpanel wechseln
     * @param {event} event - Click-Event auf einen der Buttons [human, easy, medium, hard]
     */
    function fStartGame(event) {
        cModus[0] = "human";
        cModus[1] = event.target.getAttribute("data-player2");

        if (cModus[1] === "online") {
            fOnline();
        } else {
            if ($("iName").value) {
                cName[0] = $("iName").value;
            } else {
                cName[0] = lLoc[nLang].lPlayer + " 1";
            }
            if (cModus[1] === "human") {
                cName[1] = lLoc[nLang].lPlayer + " 2";
            } else {
                cName[1] = lLoc[nLang].lComputer;
            }
            nStartPlayer = 0;
            nGames = [0, 0];
            fResetGame();
            iTitle.classList.remove("swipe-out-right");
            iGame.classList.remove("swipe-in-left");
            iTitle.classList.add("swipe-out");
            iGame.classList.add("swipe-in");
        }
    }

    /**
     * Spiel verlassen
     */
    function fQuitGame() {
        if (cModus[0] === "online" || cModus[1] === "online") {
            socket.disconnect();
            $("iOnline").disabled = false;
        }
        cModus = [];
        iTitle.classList.remove("swipe-out");
        iGame.classList.remove("swipe-in");
        iTitle.classList.add("swipe-out-right");
        iGame.classList.add("swipe-in-left");
    }

    /**
     * Gibt für einen Spielfeld-Index Zeile und Spalte zurück
     * @param {number} nIndex - 0-basierter Index im Spielfeld-Array
     * @return {object} nRow und nCol: Zeile und Spalte
     */
    function fRowCol(nIndex) {
        return {
            nRow: Math.trunc(nIndex / 8),
            nCol: nIndex % 8
        }
    }

    /**
     * Prüfen, ob im übergebenen Array auf der übergebenen Position ein Spielzug möglich ist
     * @param {number} nStoneID - Index des zu prüfenden Steines
     * @param {array} lPlayground - Liste aller Felder des zu prüfenden Spielstandes
     * @return {array} Gibt die Liste der umgedrehten Steine zurück
     */
    function fCheckStones(nStoneID, lPlayground) {
        const lDirections = [[0,1],[1,1],[1,0],[1,-1],[0,-1],[-1,-1],[-1,0],[-1,1]];
        let nIndex;
        let lStonesCaptured = [];
        if (lPlayground[nStoneID] !== "empty") {
            // kein leeres Feld
            return lStonesCaptured;
        }
        for (const lDirection of lDirections){
            let lStonesOpponent = [];
            nIndex = 1;
            while (0 <= nStoneID + nIndex * lDirection[0] * 8 + nIndex * lDirection[1]
            &&  nStoneID + nIndex * lDirection[0] * 8 + nIndex * lDirection[1] <= 63
            && Math.floor(nStoneID/8) === Math.floor((nStoneID + nIndex * lDirection[1])/8) ) {
                if (lPlayground[nStoneID + nIndex * lDirection[0] * 8 + nIndex * lDirection[1]] === lColor[1 - nCurrentPlayer]) {
                    // anliegender Stein des Gegners
                    lStonesOpponent.push(nStoneID + nIndex * lDirection[0] * 8 + nIndex * lDirection[1]);
                    nIndex += 1;
                } else if (lPlayground[nStoneID + nIndex * lDirection[0] * 8 + nIndex * lDirection[1]] ===lColor[nCurrentPlayer] && lStonesOpponent.length > 0) {
                    // einklemmender eigener Stein
                    lStonesCaptured = lStonesCaptured.concat(lStonesOpponent);
                    if (!lStonesCaptured.includes(nStoneID)) {
                        lStonesCaptured.push(nStoneID);
                    }
                    break;
                } else {
                    break;
                }
            }
        }
        return lStonesCaptured;
    }

    /**
     * Den aktuellen Spielstand als Array zurückgeben
     * @return {array} Liste aller Felder mit den Ausprägungen ["empty", "black", "white"]
     */
    function fCurrentPlayground () {
        let lPlayground = [];
        for (const oStone of oPlayground.children) {
            lPlayground.push(oStone.classList.contains(lColor[0]) ? lColor[0] : (oStone.classList.contains(lColor[1]) ? lColor[1] : "empty"));
        }
        return lPlayground;
    }

    /**
     * Liste aller möglichen Spielzüge generieren
     * @param {array} lPlayground - Liste aller Felder des zu prüfenden Spielstandes
     * @return {array} gibt eine Liste der möglichen Spielzüge zurück mit folgenden Eigenschaften:
     * - lPossibleMoves[].nID     - Index des spielbaren Steins
     * - lPossibleMoves[].lStones - Liste der Steine, die dabei gewonnen würden
     */
    function fPossibleMoves(lPlayground) {
        let lPossibleMoves = [];
        let lStonesCaptured = [];

        for (const [nStoneID, cStone] of lPlayground.entries()) {
            if (cStone === "empty") {
                lStonesCaptured = fCheckStones(nStoneID, lPlayground);
                if (lStonesCaptured.length > 0) {
                    lPossibleMoves.push({"nID": nStoneID, "lStones": lStonesCaptured});
                }
            }
        }
        return lPossibleMoves;
    }

    /**
     * Spielzug auf dem gewählten Feld durchführen
     * @param {element} oStone - Feld, auf welches gespielt werden soll
     */
    function fClickStone(oStone) {
        let nStoneID = Array.prototype.indexOf.call(oStone.parentNode.children, oStone);
        let lPlayground = fCurrentPlayground();
        let lPossibleMoves = [];
        const lStonesCaptured = fCheckStones(nStoneID, lPlayground);

        for (const oStone of oPlayground.getElementsByClassName("wrong")) {
            oStone.classList.remove("wrong");
        }

        if (lStonesCaptured.length > 0) {
            nCountRound += 1;
            // gespielter Stein an Online-Gegner senden
            if (cModus[1 - nCurrentPlayer] === "online") {
                socket.emit("playsend", {to: user.opponent, nStone: nStoneID, nRound: nCountRound});
            }
            // eingeklemmte Steine drehen
            for (const nStoneCaptured of lStonesCaptured) {
                if (oPlayground.children[nStoneCaptured].classList.contains("white") || oPlayground.children[nStoneCaptured].classList.contains("white")) {
                    oPlayground.children[nStoneCaptured].className = "";
                    /* todo: Steine mit verzögerung drehen, ohne dass AI zu früh auf alten Zustand losgeht
                    let cColor = lColor[nCurrentPlayer];
                    setTimeout(function () {
                        oPlayground.children[nStoneCaptured].className = cColor;
                    }, 50);
                    */
                    oPlayground.children[nStoneCaptured].className = lColor[nCurrentPlayer];
                } else {
                    oPlayground.children[nStoneCaptured].className = lColor[nCurrentPlayer];
                }
            }
            if (bSound) {
                document.getElementById("woosh_sound").play();
            }
            // Markierungen löschen
            for (const oStone of oPlayground.children) {
                oStone.classList.remove("ok");
            }
            if (document.getElementsByClassName("empty").length === 0) {
                // alle Felder besetzt, Spiel beendet
                $("iFinalMessage").innerHTML = lLoc[nLang].lOver;
                $("iPlayer1").innerHTML = lStoneImg[0] + " " + cName[0];
                $("iPlayer2").innerHTML = cName[1] + " " + lStoneImg[1];
                $("iFinalScore1").innerHTML = document.getElementsByClassName(lColor[0]).length;
                $("iFinalScore2").innerHTML = document.getElementsByClassName(lColor[1]).length;
                if (document.getElementsByClassName(lColor[0]).length > document.getElementsByClassName(lColor[1]).length) {
                    nGames[0] += 1;
                    oMessage.innerHTML = lStoneImg[0] + lLoc[nLang].lWin;
                    $("iFinalMessage").innerHTML += lStoneImg[0] + " " + cName[0] + " " + lLoc[nLang].lWin;
                } else if (document.getElementsByClassName(lColor[0]).length < document.getElementsByClassName(lColor[1]).length) {
                    nGames[1] += 1;
                    oMessage.innerHTML = lStoneImg[1] + lLoc[nLang].lWin;
                    $("iFinalMessage").innerHTML += lStoneImg[1] + " " + cName[1] + " " + lLoc[nLang].lWin;
                } else {
                    oMessage.innerHTML = lLoc[nLang].lDraw;
                    $("iFinalMessage").innerHTML += lLoc[nLang].lDraw;
                }
                $("iGames1").innerHTML = nGames[0];
                $("iGames2").innerHTML = nGames[1];
                setTimeout(function () {
                    nStartPlayer = 1 - nStartPlayer;
                    bResetNeeded = true;
                    fShowPopup($("iPopupGameOver"));
                    if (bSound) {
                        document.getElementById("ding_sound").play();
                    }
                }, 500);
            } else {
                // nächster Spieler dran
                nCurrentPlayer = 1 - nCurrentPlayer;
                lPossibleMoves = fPossibleMoves(fCurrentPlayground ());
                if (lPossibleMoves.length > 0) {
                    // nächster Spieler kann spielen
                    oMessage.innerHTML = lStoneImg[nCurrentPlayer] + " " + cName[nCurrentPlayer] + " " + lLoc[nLang].lTurn;
                    if (cModus[nCurrentPlayer] !== "human" && cModus[nCurrentPlayer] !== "online") {
                        fAI(lPossibleMoves)
                    } else if (bShowMoves && cModus[nCurrentPlayer] === "human") {
                        for (const oPossibleMove of lPossibleMoves) {
                            oPlayground.children[oPossibleMove.nID].classList.add("ok");
                        }
                    }
                } else {
                    nCurrentPlayer = 1 - nCurrentPlayer;
                    lPossibleMoves = fPossibleMoves(fCurrentPlayground ());
                    if (lPossibleMoves.length > 0) {
                        // nächster Spieler kann nicht spielen und wird übersprungen
                        oMessage.innerHTML = lStoneImg[1 - nCurrentPlayer] + lLoc[nLang].lNoMove +
                            lStoneImg[nCurrentPlayer] + " " + cName[nCurrentPlayer] + " " + lLoc[nLang].lTurn;
                        if (cModus[nCurrentPlayer] !== "human" && cModus[nCurrentPlayer] !== "online") {
                            fAI(lPossibleMoves)
                        } else if (bShowMoves && cModus[nCurrentPlayer] === "human") {
                            for (const oPossibleMove of lPossibleMoves) {
                                oPlayground.children[oPossibleMove.nID].classList.add("ok");
                            }
                        }
                    } else {
                        // kein Spieler kann mehr spielen, Spiel beendet
                        $("iFinalMessage").innerHTML = lLoc[nLang].lNobodyMove;
                        $("iPlayer1").innerHTML = lStoneImg[0] + " " + cName[0];
                        $("iPlayer2").innerHTML = cName[1] + " " + lStoneImg[1];
                        $("iFinalScore1").innerHTML = document.getElementsByClassName(lColor[0]).length;
                        $("iFinalScore2").innerHTML = document.getElementsByClassName(lColor[1]).length;
                        if (document.getElementsByClassName(lColor[0]).length > document.getElementsByClassName(lColor[1]).length) {
                            nGames[0] += 1;
                            oMessage.innerHTML = lStoneImg[0] + lLoc[nLang].lWin;
                            $("iFinalMessage").innerHTML += lStoneImg[0] + " " + cName[0] + " " + lLoc[nLang].lWin;
                        } else if (document.getElementsByClassName(lColor[0]).length < document.getElementsByClassName(lColor[1]).length) {
                            nGames[1] += 1;
                            oMessage.innerHTML = lStoneImg[1] + lLoc[nLang].lWin;
                            $("iFinalMessage").innerHTML += lStoneImg[1] + " " + cName[1] + " " + lLoc[nLang].lWin;
                        } else {
                            oMessage.innerHTML = lLoc[nLang].lDraw;
                            $("iFinalMessage").innerHTML += lLoc[nLang].lDraw;
                        }
                        $("iGames1").innerHTML = nGames[0];
                        $("iGames2").innerHTML = nGames[1];

                        setTimeout(function () {
                            nStartPlayer = 1 - nStartPlayer;
                            bResetNeeded = true;
                            fShowPopup($("iPopupGameOver"));
                            if (bSound) {
                                document.getElementById("ding_sound").play();
                            }
                        }, 500);
                    }
                }
            }
        } else {
            oMessage.innerHTML = lStoneImg[nCurrentPlayer] + lLoc[nLang].lNotHere;
            oPlayground.children[nStoneID].classList.add("wrong");
        }
        $("iScore1").innerHTML = lStoneImg[0] + " " + document.getElementsByClassName(lColor[0]).length;
        $("iScore2").innerHTML = document.getElementsByClassName(lColor[1]).length + " " + lStoneImg[1];
    }

    /**
     * Score von allen möglichen Zügen berechnen
     * @param {array} lPossibleMoves - Liste aller möglichen Spielzüge, welche bewertet werden sollen
     * @param {array} lPlayground - Liste aller Felder des zu prüfenden Spielstandes
     * @return {array} gibt die erweiterte Liste lPossibleMoves zurück:
     * - lPossibleMoves[].nScore              - Punktewertung des Zuges
     * - lPossibleMoves[].lPlayground         - Stand des Spielfeldes nach diesem Zug
     * - lPossibleMoves[].lPossibleGemstones  - Liste aller Steine, die bei diesem Spielstand nicht mehr verloren gehen könnten
     * - lPossibleMoves[].lGemstones          - Liste der effektiv bei diesem Spielzug gewonnenen Steine, die nicht mehr verloren gehen könnten
     */
    function fAIScore (lPossibleMoves, lPlayground) {
        const lBorderStones = [0, 1, 2, 3, 4, 5, 6, 7, 8, 15, 16, 23, 24, 31, 32, 39, 40, 47, 48, 55, 56, 57, 58, 59, 60, 61, 62, 63];
        const lNextBorderStones = [9, 10, 11, 12, 13, 14, 17, 22, 25, 30, 33, 38, 41, 46, 49, 50, 51, 52, 53, 54];
        let nIndex;

        for (const oPossibleMove of lPossibleMoves) {
            // Spielfeld nach dem möglichen Zug ablegen
            oPossibleMove.lPlayground = [...lPlayground];
            oPossibleMove.lStones.forEach(nStone => {
                oPossibleMove.lPlayground[nStone] = lColor[nCurrentPlayer];
            });

            // jeder gewonnene Stein ergibt einen Punkt
            oPossibleMove.nScore = oPossibleMove.lStones.length;
            // Steine am Rand bekommen zusätzliche 20 Punkte
            oPossibleMove.nScore += oPossibleMove.lStones.filter(nStone => lBorderStones.includes(nStone)).length * 20;

            // Gehört der Stein am Rand zu einer Kette von Steinen von mir? Punkte mal Länge der Kette
            if (lBorderStones.includes(oPossibleMove.nID)) {
                let lRand = [];
                let nStart;
                let nStep;
                let nPos;
                let nCount = 1;
                let nEnd = 0;

                //console.log(oPossibleMove.nID + " ist am Rand");
                //console.log(fRowCol(oPossibleMove.nID));
                if (fRowCol(oPossibleMove.nID).nRow === 0) {
                    nStart = 0;
                    nStep = 1;
                    nPos = fRowCol(oPossibleMove.nID).nCol;
                } else if (fRowCol(oPossibleMove.nID).nRow === 7) {
                    nStart = 56;
                    nStep = 1;
                    nPos = fRowCol(oPossibleMove.nID).nCol;
                } else if (fRowCol(oPossibleMove.nID).nCol === 0) {
                    nStart = 0;
                    nStep = 8;
                    nPos = fRowCol(oPossibleMove.nID).nRow;
                } else if (fRowCol(oPossibleMove.nID).nCol === 7) {
                    nStart = 7;
                    nStep = 8;
                    nPos = fRowCol(oPossibleMove.nID).nRow;
                }
                for (nIndex = 0; nIndex < 8; nIndex += 1) {
                    lRand.push(nStart + nIndex * nStep);
                }
                for (nIndex = nPos - 1; nIndex >= 0; nIndex -= 1) {
                    if (oPossibleMove.lPlayground[lRand[nIndex]] === oPossibleMove.lPlayground[lRand[nPos]]) {
                        // ein weiterer Stein in Kette
                        nCount += 1;
                    } else if (oPossibleMove.lPlayground[lRand[nIndex]] === "empty") {
                        // ein leeres Feld
                        nEnd += 1;
                        break;
                    } else {
                        // Stein des Gegners
                        nEnd += 2;
                        break;
                    }
                }
                for (nIndex = nPos + 1; nIndex < 8; nIndex += 1) {
                    if (oPossibleMove.lPlayground[lRand[nIndex]] === oPossibleMove.lPlayground[lRand[nPos]]) {
                        // ein weiterer Stein in Kette
                        nCount += 1;
                    } else if (oPossibleMove.lPlayground[lRand[nIndex]] === "empty") {
                        // ein leeres Feld
                        nEnd += 1;
                        break;
                    } else {
                        // Stein des Gegners
                        nEnd += 2;
                        break;
                    }
                }
                if (nCount > 1 && nEnd !== 3) {
                    oPossibleMove.nScore += nCount * 20;
                }
                // ist an einem Ende der Kette ein Stein des Gegners und am anderen Ende noch Platz? Dann keine Punkte
                if (nEnd === 3) {
                    oPossibleMove.nScore -= 20;
                }
                /*if (nCount > 1) {
                    let cMsg = "Auf Zeile " + fRowCol(oPossibleMove.nID).nRow + " Spalte " + fRowCol(oPossibleMove.nID).nCol + " kann eine Kette mit " + nCount + " Steinen gebildet werden, welche ";
                    cMsg += nEnd === 3 ? "" : " nicht ";
                    cMsg += "verloren gehen kann.";
                    console.log(cMsg);
                }*/
            }

            // Steine vor dem Rand bekommen drei Punkte abgezogen
            oPossibleMove.nScore -= oPossibleMove.lStones.filter(nStone => lNextBorderStones.includes(nStone)).length * 3;

            // Welche steine nach dem Spielzug kann mir keiner mehr nehmen? Wieviele davon sind in der Liste der zu gewinnenden Steine bei diesem Zug?
            oPossibleMove.lPossibleGemstones = [];

            let lCorners = [
                {nID: 0, lDir: [1, 1]},
                {nID: 7, lDir: [-1, 1]},
                {nID: 56, lDir: [1, -1]},
                {nID: 63, lDir: [-1, -1]}
            ]
            let nAddCol;
            let nAddRow;
            let nMaxCol;
            let nMaxRow;
            for (nIndex = 0; nIndex < 4; nIndex +=1) {
                // Loop über die vier Ecken
                nAddCol = 0;
                nAddRow = 0;
                nMaxCol = 7;
                while (nAddRow < 7) {
                    while (oPossibleMove.lPlayground[lCorners[nIndex].nID + nAddCol * lCorners[nIndex].lDir[0] + nAddRow * 8 * lCorners[nIndex].lDir[1]] === lColor[nCurrentPlayer] && nAddCol < nMaxCol) {
                        // Loop über Spalten
                        oPossibleMove.lPossibleGemstones.push(lCorners[nIndex].nID + nAddCol * lCorners[nIndex].lDir[0] + nAddRow * 8 * lCorners[nIndex].lDir[1]);
                        nAddCol +=1;
                    }
                    nMaxCol = nAddCol - 1;
                    nAddRow += 1;
                    nAddCol = 0;
                }
                nAddCol = 0;
                nAddRow = 0;
                nMaxRow = 7;
                while (nAddCol < 7) {
                    while (oPossibleMove.lPlayground[lCorners[nIndex].nID + nAddCol * lCorners[nIndex].lDir[0] + nAddRow * 8 * lCorners[nIndex].lDir[1]] === lColor[nCurrentPlayer] && nAddRow < nMaxRow) {
                        // Loop über Spalten
                        oPossibleMove.lPossibleGemstones.push(lCorners[nIndex].nID + nAddCol * lCorners[nIndex].lDir[0] + nAddRow * 8 * lCorners[nIndex].lDir[1]);
                        nAddRow +=1;
                    }
                    nMaxRow = nAddRow - 1;
                    nAddCol += 1;
                    nAddRow = 0;
                }
            }
            // doppelte Einträge löschen
            oPossibleMove.lPossibleGemstones = [...new Set(oPossibleMove.lPossibleGemstones)];

            // Steine, welche nicht mehr verloren werden können
            oPossibleMove.lGemstones = oPossibleMove.lStones.filter(nStone => oPossibleMove.lPossibleGemstones.includes(nStone));
            oPossibleMove.nScore += oPossibleMove.lGemstones.length * 1000;

            // Nachbarn von Steinen, welche nicht mehr verloren werden können, sind weniger cool
            // todo: lPossibleGemstonesNeighbours korrekt bestimmen
            oPossibleMove.lPossibleGemstonesNeighbours = [];
            if (oPossibleMove.lPlayground[0] === "empty") {
                oPossibleMove.lPossibleGemstonesNeighbours.push(1);
                oPossibleMove.lPossibleGemstonesNeighbours.push(9);
                oPossibleMove.lPossibleGemstonesNeighbours.push(8);
            }
            if (oPossibleMove.lPlayground[7] === "empty") {
                oPossibleMove.lPossibleGemstonesNeighbours.push(6);
                oPossibleMove.lPossibleGemstonesNeighbours.push(14);
                oPossibleMove.lPossibleGemstonesNeighbours.push(15);
            }
            if (oPossibleMove.lPlayground[56] === "empty") {
                oPossibleMove.lPossibleGemstonesNeighbours.push(48);
                oPossibleMove.lPossibleGemstonesNeighbours.push(49);
                oPossibleMove.lPossibleGemstonesNeighbours.push(57);
            }
            if (oPossibleMove.lPlayground[63] === "empty") {
                oPossibleMove.lPossibleGemstonesNeighbours.push(55);
                oPossibleMove.lPossibleGemstonesNeighbours.push(54);
                oPossibleMove.lPossibleGemstonesNeighbours.push(62);
            }
            if (oPossibleMove.lGemstones.length === 0) {
                oPossibleMove.lGemstonesNeighbours = oPossibleMove.lStones.filter(nStone => oPossibleMove.lPossibleGemstonesNeighbours.includes(nStone));
                oPossibleMove.nScore -= oPossibleMove.lGemstonesNeighbours.length * 80;
                // diagonal sind besonders schlimm
                oPossibleMove.nScore -= oPossibleMove.lGemstonesNeighbours.filter(nStone => [9, 14, 49, 54].includes(nStone)).length * 100;
            }
        }
        return lPossibleMoves;
    }

    /**
     * Spielzug auf einem der möglichen Felder durchführen
     * @param {array} lPossibleMoves - Liste aller möglichen Spielzüge, auf welchem ein Spielzug möglich wäre
     */
    function fAI(lPossibleMoves) {
        // aktuelles Spielfeld
        let lPlayground = fCurrentPlayground();

        // Score von allen möglichen Zügen berechnen
        //console.log("neuer Zug der CPU");
        lPossibleMoves = fAIScore(lPossibleMoves, lPlayground);

        // Score des nächsten Zuges des Gegners dazu davon abziehen
        nCurrentPlayer = 1 - nCurrentPlayer;
            for (const oPossibleMoves of lPossibleMoves) {
                oPossibleMoves.lPossibleMovesOpponent = fPossibleMoves(oPossibleMoves.lPlayground);
                if (oPossibleMoves.lPossibleMovesOpponent.length === 0) {
                    //console.log("wenn ich hier spiele, kann Gegner nicht spielen:");
                    //console.log(oPossibleMoves);
                    oPossibleMoves.nScore = Math.abs(oPossibleMoves.nScore) * 100000;
                } else {
                    //console.log("Zug des Gegners, nachdem CPU in " + oPossibleMoves.nID + " gespielt hat.");
                    oPossibleMoves.lPossibleMovesOpponent = fAIScore(oPossibleMoves.lPossibleMovesOpponent, oPossibleMoves.lPlayground);
                    oPossibleMoves.lPossibleMovesOpponent.sort((a,b) =>  b.nScore - a.nScore);
                    oPossibleMoves.nScore = oPossibleMoves.nScore - oPossibleMoves.lPossibleMovesOpponent[0].nScore * 0.8;
                    // Score des übernächsten Zuges des Spielers dazuzählen
                    nCurrentPlayer = 1 - nCurrentPlayer;
                    oPossibleMoves.lPossibleMovesOpponent[0].lPossibleMovesPlayer = fPossibleMoves(oPossibleMoves.lPossibleMovesOpponent[0].lPlayground);
                    if (oPossibleMoves.lPossibleMovesOpponent[0].lPossibleMovesPlayer.length > 0) {
                        //console.log("Zweiter Zug der CPU, nachdem Gegner in " + oPossibleMoves.lPossibleMovesOpponent[0].nID + " gespielt hat.");
                        oPossibleMoves.lPossibleMovesOpponent[0].lPossibleMovesPlayer = fAIScore(oPossibleMoves.lPossibleMovesOpponent[0].lPossibleMovesPlayer, oPossibleMoves.lPossibleMovesOpponent[0].lPlayground);
                        oPossibleMoves.lPossibleMovesOpponent[0].lPossibleMovesPlayer.sort((a,b) =>  b.nScore - a.nScore);
                        oPossibleMoves.nScore = oPossibleMoves.nScore + oPossibleMoves.lPossibleMovesOpponent[0].lPossibleMovesPlayer[0].nScore * 0.6;
                    }
                    nCurrentPlayer = 1 - nCurrentPlayer;
                }
            }
        nCurrentPlayer = 1 - nCurrentPlayer;

        lPossibleMoves.sort((a,b) =>  b.nScore - a.nScore);
        //console.log(lPossibleMoves);

        // Wieviele Möglichkeiten mit maximalem Score gibt es?
        let nMaxScore = lPossibleMoves[0].nScore;
        if (cModus[nCurrentPlayer] !== "hard") {
            // zweithöchsten Wert
            nMaxScore = (lPossibleMoves.filter((oPossibleMove) => oPossibleMove.nScore < nMaxScore)[0] ?? lPossibleMoves[0]).nScore;
        }
        if (cModus[nCurrentPlayer] === "medium") {
            //dritthöchsten Wert für Medium
            nMaxScore = (lPossibleMoves.filter((oPossibleMove) => oPossibleMove.nScore < nMaxScore)[0] ?? lPossibleMoves[lPossibleMoves.length - 1]).nScore;
        }
        if (cModus[nCurrentPlayer] === "easy") {
            //tiefsten Wert für Easy
            nMaxScore = lPossibleMoves[lPossibleMoves.length - 1].nScore;
        }
        //console.log(cModus[nCurrentPlayer] + " - Max: " + nMaxScore + " (" + lPossibleMoves.filter((oPossibleMove) => oPossibleMove.nScore >= nMaxScore).length + "/" + lPossibleMoves.length + " possible Moves)");

        const nCount = lPossibleMoves.filter((oPossibleMove) => oPossibleMove.nScore >= nMaxScore).length;
        // Davon eine wählen
        const nPick = Math.floor(Math.random() * nCount);
        // Spielzug auf gewähltem Feld durchführen
        setTimeout(function() {
            fClickStone(oPlayground.children[lPossibleMoves[nPick].nID]);
        }, 1000);
    }

    /**
     * Starten eines neuen Online-Spiels
     */
    function fOnline() {
        let oLastStart;
        let oLastQuit;
        fShowPopup($("iPopupOnline"));
        $("iOnline").disabled = true;

        //socket = io.connect("http://localhost:49153", {"forceNew": true});
        socket = io.connect("https://grrd.a2hosted.com:49153", {"forceNew": true});

        socket.heartbeatTimeout = 20000;
        socket.on("connect", function () {
            console.log("connected");
        });

        socket.on("startgame", function (data) {
            let nWaitTime = 0;
            user = data;
            if (user.id !== oLastStart) {
                socket.emit("usersend", {
                    to: user.opponent,
                    name: $("iName").value
                });
                oLastStart = user.id;

                if (document.getElementsByClassName("popup-show").length) {
                    nWaitTime += 500;
                }
                fHidePopup($("iPopupOnline"));
                fHidePopup($("iPopupInfo"));
                fHidePopup($("iPopupSettings"));

                if (iGame.classList.contains("swipe-in")) {
                    // ausstieg aus aktuellem Single-Player-Game
                    fHidePopup($("iPopupGameOver"));
                    fHidePopup($("iPopupLeft"));

                    setTimeout(function() {
                        iTitle.classList.remove("swipe-out");
                        iGame.classList.remove("swipe-in");
                        iTitle.classList.add("swipe-out-right");
                        iGame.classList.add("swipe-in-left");
                    }, nWaitTime);
                    nWaitTime += 500;
                }

                if (user.role === "0") {
                    if ($("iName").value) {
                        cName[0] = $("iName").value
                    } else {
                        cName[0] = lLoc[nLang].lPlayer + " 1";
                    }
                    cName[1] = lLoc[nLang].lOnline;
                } else {
                    if ($("iName").value) {
                        cName[1] = $("iName").value
                    } else {
                        cName[1] = lLoc[nLang].lPlayer + " 1";
                    }
                    cName[0] = lLoc[nLang].lOnline;
                }

                if (user.role === "0") {
                    cModus[0] = "human";
                    cModus[1] = "online";
                } else {
                    cModus[0] = "online";
                    cModus[1] = "human";
                }
                setTimeout(function() {
                    nStartPlayer = 0;
                    nGames = [0, 0];
                    fResetGame();
                    iTitle.classList.remove("swipe-out-right");
                    iGame.classList.remove("swipe-in-left");
                    iTitle.classList.add("swipe-out");
                    iGame.classList.add("swipe-in");
                }, nWaitTime);

            }
        });

        socket.on("playget", function (data) {
            if (data.nRound === 1 && nCountRound > 0) {
                // Online-Gegner beginnt neues Spiel, während popupDialog noch offen ist
                fResetGame();
            }
            if (data.nRound === nCountRound + 1 && nLastRound !== data.nRound) {
                nLastRound = data.nRound;

                // Spielzug des Online-Gegners auf empfangenem Feld durchführen
                setTimeout(function() {
                    fClickStone(oPlayground.children[data.nStone]);
                }, 10);
            }
        });

        socket.on("userget", function (data) {
            if (user.role === "0") {
                if (data.name.length > 0) {
                    cName[1] = data.name;
                }
            } else {
                if (data.name.length > 0) {
                    cName[0] = data.name;
                }
            }
        });

        socket.on("quit", function () {
            if (user.id !== oLastQuit && cModus.length &&  (cModus[0] === "online" || cModus[1] === "online" )) {
                oLastQuit = user.id;
                fShowPopup($("iPopupLeft"));
            }
        });
    }

    /**
     * Click-Handler für Felder generieren
     * @param {element} oStone - Feld, welches einen Klick-Handler bekommen soll
     * @return {function} Function, die beim Klick auf das Feld durchgeführt wird
     */
    function fClickHandler(oStone) {
        return function () {
            if (cModus[nCurrentPlayer] === "human") {
                fClickStone(oStone);
            }
        };
    }

    /**
     * Popup einblenden
     * @param {element} ePopup - Popup, welches angezeigt werden soll
     */
    function fShowPopup(ePopup) {
        $("iTitleFieldset").disabled = true;
        // Fix for Firefox OnKeydown
        document.activeElement.blur();
        ePopup.classList.remove("popup-init");
        ePopup.classList.remove("popup-hide");
        ePopup.classList.add("popup-show");
    }

    /**
     * Popup ausblenden
     * @param {element} ePopup - Popup, welches ausgeblendet werden soll
     */
    function fHidePopup(ePopup) {
        $("iTitleFieldset").disabled = false;
        ePopup.classList.remove("popup-show");
        ePopup.classList.add("popup-hide");
    }

    /**
     * Style setzen
     */
    function fSetStyle() {
        let bLightModeOn = window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches;
        let nStyle = parseInt($("iStyle").value);
        //console.log(`light mode is ${bLightModeOn ? '☀ on' : '🌒 off'}.`);
        if (nStyle === 0 || (nStyle === 2 && bLightModeOn)) {
            document.getElementsByTagName("body")[0].classList.add("light");
        } else {
            document.getElementsByTagName("body")[0].classList.remove("light");
        }
    }

    /**
     * Rotations-Animation für Titel-e
     */
    function  fRotateTitle() {
        // Anzahl der animierten e's im Titel
        const nCountE = document.getElementsByClassName("eWhite").length - 1;
        const nCurrentE = Math.floor(Math.random() * (nCountE + 1));
        const nTimeout = 500 + Math.floor(Math.random() * 1500);

        document.getElementsByClassName("eWhite")[nCurrentE].classList.toggle("vanishWhite");
        document.getElementsByClassName("eBlack")[nCurrentE].classList.toggle("vanish");

        setTimeout(function () {
            fRotateTitle();
        }, nTimeout);
    }

    /**
     * Spiel initialisieren
     */
    function fInit() {
        // Localize
        // Example usage - https://grrd01.github.io/TicTacToe/?lang=en
        const cLang = (fUrlParam("lang") || navigator.language || navigator.browserLanguage || (navigator.languages || ["en"])[0]).substring(0, 2).toLowerCase();
        if (cLang === "de") {
            nLang = 1;
        } else if (cLang === "fr") {
            nLang = 2;
        }
        if (localStorageOK) {
            nLang = (
                localStorage.getItem("s_reversi_lang") === null ? nLang : parseInt(localStorage.getItem("s_reversi_lang"))
            );
            $("iName").value = (
                localStorage.getItem("s_reversi_name") === null ? "" : localStorage.getItem("s_reversi_name")
            );
            $("iLang").value = nLang;
            $("iStyle").value = (
                localStorage.getItem("s_reversi_style") === null ? 1 : parseInt(localStorage.getItem("s_reversi_style"))
            );
            bShowMoves = (
                localStorage.getItem("s_reversi_show") === null ? true : localStorage.getItem("s_reversi_show") === "true"
            );
            $("iShowMoves").checked = bShowMoves;
            bSound = (
                localStorage.getItem("s_reversi_sound") === null ? true : localStorage.getItem("s_reversi_sound") === "true"
            );
            $("iSound").checked = bSound;
        }
        fSetLang();

        // ServiceWorker initialisieren
        if ("serviceWorker" in navigator) {
            window.addEventListener("load", function () {
                navigator.serviceWorker.register("sw.js").then(function (registration) {
                    console.log("ServiceWorker registration successful with scope: ", registration.scope);
                }, function (err) {
                    console.log("ServiceWorker registration failed: ", err);
                });
            });
        }

        if (!navigator.onLine || typeof io === "undefined") {
            // offline :(
            $("iOnline").disabled = true;
        }

        Array.from(document.getElementsByClassName("popup-head")).forEach(function (eHead) {
            eHead.appendChild($("iTitleImg").cloneNode(true));
        });

        Array.from(document.getElementsByClassName("eBlack")).forEach(function (eBlack) {
            eBlack.addEventListener("click", function (event) {
                event.target.classList.toggle("vanish");
                event.target.parentNode.getElementsByClassName("eWhite")[0].classList.toggle("vanishWhite");
                if (bSound) {
                    document.getElementById("woosh_sound").play();
                }
            });
        });

        setTimeout(function () {
            fRotateTitle()
        }, 1500);

        $("iInfo").addEventListener("click", function () {
            fShowPopup($("iPopupInfo"));
        });
        $("iInfoClose").addEventListener("click", function () {
            fHidePopup($("iPopupInfo"));
        });

        $("iSettings").addEventListener("click", function () {
            fShowPopup($("iPopupSettings"));
        });
        $("iSettingsClose").addEventListener("click", function () {
            nLang = $("iLang").value;
            fSetLang();
            bShowMoves = $("iShowMoves").checked;
            bSound = $("iSound").checked;
            if (localStorageOK) {
                localStorage.setItem("s_reversi_name", $("iName").value);
                localStorage.setItem("s_reversi_lang", nLang);
                localStorage.setItem("s_reversi_show", bShowMoves);
                localStorage.setItem("s_reversi_sound", bSound);
                localStorage.setItem("s_reversi_style", $("iStyle").value);
            }
            fHidePopup($("iPopupSettings"));
        });

        $("iOnlineClose").addEventListener("click", function () {
            fHidePopup($("iPopupOnline"));
        });
        $("iLeftClose").addEventListener("click", function () {
            fHidePopup($("iPopupLeft"));
            setTimeout(function () {
                fQuitGame();
            }, 500);
        });
        $("iNo").addEventListener("click", function () {
            fHidePopup($("iPopupGameOver"));
            fHidePopup($("iPopupLeft"));
            setTimeout(function () {
                fQuitGame();
            }, 500);

        });
        $("iYes").addEventListener("click", function () {
            fHidePopup($("iPopupGameOver"));
            if (bResetNeeded) {
                fResetGame();
            }
        });

        $("iLang").addEventListener("change", function() {
            nLang = $("iLang").value;
            fSetLang();
        });
        $("iStyle").addEventListener("change", function() {
            fSetStyle();
        });

        Array.from(document.getElementsByClassName("list-button")).forEach(function (rButton) {
            rButton.addEventListener("click", fStartGame);
        });

        $("iClose").addEventListener("click", fQuitGame);

        // Applikation initialisieren
        let nIndex;
        let oStone;
        // Grid für Steine aufbauen
        for (nIndex = 0; nIndex < 64; nIndex += 1) {
            oStone = document.createElement("div");
            oPlayground.appendChild(oStone);
            oStone.onclick = fClickHandler(oStone);
        }

        try {
            window.matchMedia("(prefers-color-scheme: light)").addEventListener("change", (e) => {
                fSetStyle();
            });
        }
        catch(err) {
            console.log(err.message);
        }
        fSetStyle();
    }

    fInit();

}());
