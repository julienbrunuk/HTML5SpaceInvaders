/**
 * Created by Nikos on 28/07/2014.
 */
'use strict';

angular.module('HTML5SpaceApp')
	.controller('UICtrl', function ($scope, $http, Auth, User) {

		$http.get('/api/users').success(function (users) {
			$scope.users = users;
		});

		$scope.startGame = function (user) {
			alert("started");
		};

		var game = new Game();

		//game.handleCollisions.bind(game);
		window.document.addEventListener("keydown", (game.onKeyDown.bind(game)));
		window.document.addEventListener("keyup", (game.onKeyUp.bind(game)));

		//$(document).keyup(game.onKeyUp.bind(game));
		setInterval(function () {
			game.update();
			game.draw();
		}, 1000 / game.FPS);

	});
