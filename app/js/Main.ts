///<reference path="./Game.ts"/>

import Game = require("Game");

var game = new Game.Game();

//game.handleCollisions.bind(game);
window.addEventListener("keydown", (game.onKeyDown.bind(game)));
window.addEventListener("keyup", (game.onKeyUp.bind(game)));

//$(document).keyup(game.onKeyUp.bind(game));
setInterval(function () {
    game.update();
    game.draw();
}, 1000 / game.FPS);
