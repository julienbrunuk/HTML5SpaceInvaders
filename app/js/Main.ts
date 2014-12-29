///<reference path="./Game.ts"/>

import Game = require("Game");

var game = new Game.Game();

//game.handleCollisions.bind(game);
window.addEventListener("keydown", (game.onKeyDown.bind(game)));
window.addEventListener("keyup", (game.onKeyUp.bind(game)));


function gameLoop() {
  requestAnimationFrame(gameLoop);
  // Drawing code goes here
  game.update();
  game.draw();
}
gameLoop();
