/**
 * grrd's Reversi
 * Copyright (c) 2022 Gerard Tyedmers, grrd@gmx.net
 * @license MPL-2.0
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

(function () {
    "use strict";

    // Spieler, welcher am Zug ist (0/1)
    let nCurrentPlayer = 0;
    // Modus des Spiels: human, easy, medium, hard, online
    let cModus;
    // Array der Farben der beiden Spieler
    const lColor = ["black","white"];
    // Element mit der übergebenen ID zurückgeben
    const $ = function (oID) {
        return document.getElementById(oID);
    };
    // Spielfeld-Element mit allen Feldern als Children
    const oPlayground = $("playground");
    // Nachricht
    const oMessage = $("message")

    /**
     * Spielfeld zurücksetzen, damit ein neues Spiel möglich wird
     */
    function fResetGame () {
        let lPossibleMovesID = [];
        for (const oStone of oPlayground.children) {
            oStone.className = "empty";
        }
        oPlayground.children[27].className = lColor[0];
        oPlayground.children[36].className = lColor[0];
        oPlayground.children[28].className = lColor[1];
        oPlayground.children[35].className = lColor[1];

        nCurrentPlayer = 0;
        fPossibleMoves(fCurrentPlayground ()).forEach(oMove => {lPossibleMovesID.push(oMove.nID)})
        oMessage.innerHTML = ("Player " + (nCurrentPlayer + 1) + "'s turn (" + lColor[nCurrentPlayer] + "). Possible moves: " + lPossibleMovesID);
    }

    /**
     * zu Spielpanel wechseln
     * @param {event} event - Click-Event auf einen der Buttons [human, easy, medium, hard]
     */
    function fStartGame(event) {
        cModus = event.target.getAttribute("data-player2");
        fResetGame();
        iTitle.classList.remove("swipe-out-right");
        iGame.classList.remove("swipe-in-left");
        iTitle.classList.add("swipe-out");
        iGame.classList.add("swipe-in");
    }

    /**
     * Spiel verlassen
     */
    function fQuitGame() {
        iTitle.classList.remove("swipe-out");
        iGame.classList.remove("swipe-in");
        iTitle.classList.add("swipe-out-right");
        iGame.classList.add("swipe-in-left");
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
            oMessage.innerHTML = ("field already taken");
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
            lPlayground.push(oStone.className);
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
        let lPossibleMovesID = [];
        const lStonesCaptured = fCheckStones(nStoneID, lPlayground);
        if (lStonesCaptured.length > 0) {
            // eingeklemmte Steine drehen
            for (const nStoneCaptured of lStonesCaptured) {
                oPlayground.children[nStoneCaptured].className = lColor[nCurrentPlayer];
            }
            if (document.getElementsByClassName("empty").length === 0) {
                // alle Felder besetzt, Spiel beendet
                oMessage.innerHTML = ("Game over. White " + document.getElementsByClassName("white").length + ", Black " + document.getElementsByClassName("black").length);
            } else {
                // nächster Spieler dran
                nCurrentPlayer = 1 - nCurrentPlayer;
                lPossibleMoves = fPossibleMoves(fCurrentPlayground ());
                if (lPossibleMoves.length > 0) {
                    // nächster Spieler kann spielen
                    lPossibleMoves.forEach(oPossibleMove => {lPossibleMovesID.push(oPossibleMove.nID)})
                    oMessage.innerHTML = ("Player " + (nCurrentPlayer + 1) + "'s turn (" + lColor[nCurrentPlayer] + "). Possible moves: " + lPossibleMovesID);
                    if (cModus !== "human" && nCurrentPlayer === 1) {
                        fAI(lPossibleMoves)
                    }
                } else {
                    nCurrentPlayer = 1 - nCurrentPlayer;
                    lPossibleMoves = fPossibleMoves(fCurrentPlayground ());
                    if (lPossibleMoves.length > 0) {
                        // nächster Spieler kann nicht spielen und wird übersprungen
                        lPossibleMoves.forEach(oPossibleMove => {lPossibleMovesID.push(oPossibleMove.nID)})
                        oMessage.innerHTML = ("Player " + (1 - nCurrentPlayer) + " can't move." +
                            "Player " + (nCurrentPlayer + 1) + "'s turn (" + lColor[nCurrentPlayer] + "). Possible moves: " + lPossibleMovesID);
                        if (cModus !== "human" && nCurrentPlayer === 1) {
                            fAI(lPossibleMoves)
                        }
                    } else {
                        // kein Spieler kann mehr spielen, Spiel beendet
                        oMessage.innerHTML = ("Game over, no player can move. White " + document.getElementsByClassName("white").length + ", Black " + document.getElementsByClassName("black").length)
                    }
                }
            }
        } else {
            oMessage.innerHTML = ("you can't play here");
        }
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
        const lDirections = [[0,1],[1,0],[1,1],[1,-1]];

        for (const oPossibleMove of lPossibleMoves) {
            oPossibleMove.nScore = oPossibleMove.lStones.length;
            // Spielfeld nach dem möglichen Zug ablegen
            oPossibleMove.lPlayground = [...lPlayground];
            oPossibleMove.lStones.forEach(nStone => {
                oPossibleMove.lPlayground[nStone] = lColor[nCurrentPlayer];
            });

            oPossibleMove.lPossibleGemstones = [];
            for (const [nIndex, oStone] of oPossibleMove.lPlayground.entries()){
                // Loop durch alle Steine
                // Welche steine nach dem Spielzug kann mir keiner mehr nehmen? Wieviele davon sind in der Liste der zu gewinnenden Steine bei diesem Zug?
                // todo: es reicht nicht, zu prüfen ob ein gegnerischer Stein links oder rechts ist, es braucht auf der anderen Seite auch ein leeres Feld, dass der Stein nicht sicher ist

                let nDirOK = 0;
                for (const lDirection of lDirections){
                    // Loop durch alle Richtungen
                    // Falls alle (links oder rechts von mir) und (über oder unter mir) mir gehören, ist Stein sicher
                    let bLeftOK = true;
                    let bRightOK = true;

                    for (let nIndex2 = 1; nIndex2 <= 7; nIndex2++) {
                        if (0 <= nIndex + nIndex2 * lDirection[0] * 8 + nIndex2 * lDirection[1]
                            &&  nIndex + nIndex2 * lDirection[0] * 8 + nIndex2 * lDirection[1] <= 63
                            && Math.floor(nIndex/8) === Math.floor((nIndex + nIndex2 * lDirection[1]) / 8)
                            && oPossibleMove.lPlayground[nIndex + nIndex2 * lDirection[0] * 8 + nIndex2 * lDirection[1]] !== lColor[nCurrentPlayer]) {
                            bLeftOK = false;
                        }
                        if (0 <= nIndex + nIndex2 * (-1) * lDirection[0] * 8 + nIndex2 * (-1) * lDirection[1]
                            && nIndex + nIndex2 * (-1) * lDirection[0] * 8 + nIndex2 * (-1) * lDirection[1] <= 63
                            && Math.floor(nIndex/8) === Math.floor((nIndex + nIndex2 * (-1) * lDirection[1]) / 8)
                            && oPossibleMove.lPlayground    [nIndex + nIndex2 * (-1) * lDirection[0] * 8 + nIndex2 * (-1) * lDirection[1]] !== lColor[nCurrentPlayer]
                        ) {
                            bRightOK = false;
                        }
                    }
                    if (bLeftOK ||  bRightOK) {
                        nDirOK += 1;
                    }
                }
                if (nDirOK ===  lDirections.length) {
                    oPossibleMove.lPossibleGemstones.push(nIndex);
                }

            }

            // Steine, welche nicht mehr verloren werden können
            oPossibleMove.lGemstones = oPossibleMove.lStones.filter(nStone => oPossibleMove.lPossibleGemstones.includes(nStone));
            oPossibleMove.nScore += oPossibleMove.lGemstones.length * 100;
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
        lPossibleMoves = fAIScore(lPossibleMoves, lPlayground);

        // Score des nächsten Zuges des Gegners dazu davon abziehen
        nCurrentPlayer = 1 - nCurrentPlayer;
            for (const oPossibleMoves of lPossibleMoves) {
                oPossibleMoves.lPossibleMovesOpponent = fPossibleMoves(oPossibleMoves.lPlayground);
                if (oPossibleMoves.lPossibleMovesOpponent.length === 0) {
                    console.log("wenn ich hier spiele, kann Gegner nicht spielen:");
                    console.log(oPossibleMoves);
                    oPossibleMoves.nScore = oPossibleMoves.nScore * 10;
                } else {
                    oPossibleMoves.lPossibleMovesOpponent = fAIScore(oPossibleMoves.lPossibleMovesOpponent, oPossibleMoves.lPlayground);
                    oPossibleMoves.lPossibleMovesOpponent.sort((a,b) =>  b.nScore - a.nScore);
                    oPossibleMoves.nScore = oPossibleMoves.nScore - oPossibleMoves.lPossibleMovesOpponent[0].nScore * 0.9;
                    // Score des übernächsten Zuges des Spielers dazuzählen
                    nCurrentPlayer = 1 - nCurrentPlayer;
                    oPossibleMoves.lPossibleMovesOpponent[0].lPossibleMovesPlayer = fPossibleMoves(oPossibleMoves.lPossibleMovesOpponent[0].lPlayground);
                    if (oPossibleMoves.lPossibleMovesOpponent[0].lPossibleMovesPlayer.length > 0) {
                        oPossibleMoves.lPossibleMovesOpponent[0].lPossibleMovesPlayer = fAIScore(oPossibleMoves.lPossibleMovesOpponent[0].lPossibleMovesPlayer, oPossibleMoves.lPossibleMovesOpponent[0].lPlayground);
                        oPossibleMoves.nScore = oPossibleMoves.nScore + oPossibleMoves.lPossibleMovesOpponent[0].lPossibleMovesPlayer[0].nScore * 0.8;
                    }
                    nCurrentPlayer = 1 - nCurrentPlayer;
                }
            }
        nCurrentPlayer = 1 - nCurrentPlayer;

        lPossibleMoves.sort((a,b) =>  b.nScore - a.nScore);
        console.log(lPossibleMoves);

        // Wieviele Möglichkeiten mit maximalem Score gibt es?
        let nMaxScore = lPossibleMoves[0].nScore;
        if (cModus !== "hard") {
            // zweithöchsten Wert für Medium
            nMaxScore = (lPossibleMoves.filter((oPossibleMove) => oPossibleMove.nScore < nMaxScore)[0] ?? lPossibleMoves[0]).nScore;
        }
        if (cModus === "easy") {
            //dritthöchsten Wert für Easy
            nMaxScore = (lPossibleMoves.filter((oPossibleMove) => oPossibleMove.nScore < nMaxScore)[0] ?? lPossibleMoves[lPossibleMoves.length - 1]).nScore;
        }
        console.log(cModus + " - Max: " + nMaxScore + " (" + lPossibleMoves.filter((oPossibleMove) => oPossibleMove.nScore >= nMaxScore).length + "/" + lPossibleMoves.length + " possible Moves)");

        const nCount = lPossibleMoves.filter((oPossibleMove) => oPossibleMove.nScore >= nMaxScore).length;
        // Davon eine wählen
        const nPick = Math.floor(Math.random() * nCount);
        // Spielzug auf gewähltem Feld durchführen
        setTimeout(function() {
            fClickStone(oPlayground.children[lPossibleMoves[nPick].nID]);
        }, 1000);
    }

    /**
     * Click-Handler für Felder generieren
     * @param {element} oStone - Feld, welches einen Klick-Handler bekommen soll
     * @return {function} Function, die beim Klick auf das Feld durchgeführt wird
     */
    function fClickHandler(oStone) {
        return function () {
            if (nCurrentPlayer === 0 || cModus === "human") {
                fClickStone(oStone);
            }

        };
    }

    /**
     * Popup Info einblenden
     */
    function fShowPopupInfo() {
        $("iTitleFieldset").disabled = true;
        // Fix for Firefox OnKeydown
        document.activeElement.blur();
        iPopupInfo.classList.remove("popup-init");
        iPopupInfo.classList.remove("popup-hide");
        iPopupInfo.classList.add("popup-show");
    }

    /**
     * Popup Info ausblenden
     */
    function fHidePopupInfo() {
        $("iTitleFieldset").disabled = false;
        iPopupInfo.classList.remove("popup-show");
        iPopupInfo.classList.add("popup-hide");
    }

    /**
     * Spiel initialisieren
     */
    function fInit() {
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

        $("iInfo").addEventListener("click", fShowPopupInfo);
        $("iInfoClose").addEventListener("click", fHidePopupInfo);

        Array.from(document.getElementsByClassName("list-button")).forEach(function (rButton) {
            rButton.addEventListener("click", fStartGame);
        });

        $("iClose").addEventListener("click", fQuitGame);

        // Applikation initialisieren
        let nIndex;
        let oStone;
        // Grid für eigene Bilder aufbauen
        for (nIndex = 0; nIndex < 64; nIndex += 1) {
            oStone = document.createElement("div");
            oPlayground.appendChild(oStone);
            oStone.onclick = fClickHandler(oStone);
        }
        fResetGame();
    }

    fInit();

}());
