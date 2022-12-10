/**
 * grrd's Reversi
 * Copyright (c) 2022 Gerard Tyedmers, grrd@gmx.net
 * @license MPL-2.0
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

/*jslint devel: true, browser: true, long: true */ /*global self fetch */

const CACHE_NAME = "grrds-Reversi-cache";
const CACHE_VERSION = "v2.0";
const CACHE = CACHE_NAME + "-" + CACHE_VERSION;

const urlsToCache = [
    "index.html",

    "images/2online.svg",
    "images/2player.svg",
    "images/4inarow.svg",
    "images/bulp.svg",
    "images/design.svg",
    "images/dice.svg",
    "images/down.svg",
    "images/easy.svg",
    "images/hard.svg",
    "images/icon.svg",
    "images/icon_ios.png",
    "images/info.svg",
    "images/language.svg",
    "images/mail.svg",
    "images/medium.svg",
    "images/memo.svg",
    "images/ok.svg",
    "images/player.svg",
    "images/puzzle.svg",
    "images/settings.svg",
    "images/sound_on.svg",
    "images/stone_black.svg",
    "images/stone_empty.svg",
    "images/stone_white.svg",
    "images/tictactoe.svg",
    "images/x.svg",
    "scripts/app.js",
    "styles/app.css"
];

self.addEventListener("install", function (event) {
    "use strict";
    // Perform install steps
    event.waitUntil(
        caches.open(CACHE).then(function (cache) {
            console.log("Opened cache");
            return cache.addAll(urlsToCache);
        })
    );
});

self.addEventListener("fetch", function (event) {
    "use strict";
    event.respondWith(
        caches.match(event.request).then(function (response) {
            // Cache hit - return response
            if (response) {
                return response;
            }

            // IMPORTANT: Clone the request. A request is a stream and
            // can only be consumed once. Since we are consuming this
            // once by cache and once by the browser for fetch, we need
            // to clone the response.
            const fetchRequest = event.request.clone();

            return fetch(fetchRequest).then(
                function (response) {
                    // Check if we received a valid response
                    if (!response || response.status !== 200 || response.type !== "basic") {
                        return response;
                    }

                    // IMPORTANT: Clone the response. A response is a stream
                    // and because we want the browser to consume the response
                    // as well as the cache consuming the response, we need
                    // to clone it so we have two streams.
                    const responseToCache = response.clone();

                    caches.open(CACHE).then(function (cache) {
                        cache.put(event.request, responseToCache);
                    });

                    return response;
                }
            );
        })
    );
});

self.addEventListener("activate", function (event) {
    "use strict";
    event.waitUntil(
        caches.keys().then(function (cacheNames) {
            return Promise.all(cacheNames.map(function (cacheName) {
                if (cacheName.indexOf(CACHE_NAME) === 0 && cacheName.indexOf(CACHE_VERSION) === -1) {
                    console.log(cacheName + " deleted");
                    return caches.delete(cacheName);
                }
            }));
        })
    );
});
