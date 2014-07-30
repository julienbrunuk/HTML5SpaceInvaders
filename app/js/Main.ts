/**
 * Created by Nikos on 30/07/2014.
 */

///<reference path="./Game.ts"/>

import Game = require("Game");
angular.module('HTML5SpaceApp', []);

angular.module('HTML5SpaceApp')
    .controller('UICtrl', function ($scope, $http) {

        /*   $http.get('/api/users').success(function (users) {
         $scope.users = users;
         });

         $scope.startGame = function (user) {
         alert("started");
         };*/


        angular.element(document).ready(function () {
            var game = new Game.Game();

            //game.handleCollisions.bind(game);
            window.document.addEventListener("keydown", (game.onKeyDown.bind(game)));
            window.document.addEventListener("keyup", (game.onKeyUp.bind(game)));

            //$(document).keyup(game.onKeyUp.bind(game));
            setInterval(function () {
                game.update();
                game.draw();
            }, 1000 / game.FPS);

        });


    });