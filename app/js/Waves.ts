///<reference path="Common.ts" />
///<reference path="Invaders.ts" />
import Common = require("Common");
import Invaders = require("Invaders");
CartesianCoordinate = Common.CartesianCoordinate;
Dimensions_2D = Common.Dimensions_2D;
export var Wave1 = function () {
    var arr = []
    var horizontalGap = 10;
    var verticalGap = 10;
    for (var i = 0; i <= 6; i++) {
        for (var j = 0; j <= 3; j++) {
            var enemy:Invaders.Enemy;
            enemy = new Invaders.EnemyGrunt(new CartesianCoordinate(10 + i * (Invaders.Enemy.DEFAULT_WIDTH + horizontalGap), (j * (Invaders.Enemy.DEFAULT_HEIGHT + verticalGap))));
            enemy.vector.xVelocity = Invaders.Enemy.DEFAULT_HORIZONTAL_SPEED;
            arr.push(enemy);
        }

    }
    return arr;
}

export var Wave2 = function () {
    var arr = []
    var horizontalGap = 10;
    var verticalGap = 10;
    for (var i = 0; i <= 6; i++) {
        for (var j = 0; j <= 3; j++) {
            if (j == 0) {
                var enemy:Invaders.Enemy = new Invaders.EnemyBoss(new CartesianCoordinate(10 + i * (Invaders.Enemy.DEFAULT_WIDTH + horizontalGap), (j * (Invaders.Enemy.DEFAULT_HEIGHT + verticalGap))));
            } else {
                enemy = new Invaders.EnemyGrunt(new CartesianCoordinate(10 + i * (Invaders.Enemy.DEFAULT_WIDTH + horizontalGap), (j * (Invaders.Enemy.DEFAULT_HEIGHT + verticalGap))));
            }
            enemy.vector.xVelocity = Invaders.Enemy.DEFAULT_HORIZONTAL_SPEED;
            arr.push(enemy);
        }
    }
    return arr;
}

export var Wave3 = function () {
    var arr = []
    var horizontalGap = 10;
    var verticalGap = 10;
    for (var i = 0; i <= 8; i++) {
        for (var j = 0; j <= 3; j++) {
            if (j == 0 || j ===1 ){
                var enemy:Invaders.Enemy = new Invaders.EnemyBoss(new CartesianCoordinate(10 + i * (Invaders.Enemy.DEFAULT_WIDTH + horizontalGap), (j * (Invaders.Enemy.DEFAULT_HEIGHT + verticalGap))));
            } else {
                enemy = new Invaders.EnemyGrunt(new CartesianCoordinate(10 + i * (Invaders.Enemy.DEFAULT_WIDTH + horizontalGap), (j * (Invaders.Enemy.DEFAULT_HEIGHT + verticalGap))));
            }
            enemy.vector.xVelocity = Invaders.Enemy.DEFAULT_HORIZONTAL_SPEED;
            arr.push(enemy);
        }
    }
    return arr;
}

export var Wave4 = function () {
    var arr = []
    var horizontalGap = 10;
    var verticalGap = 10;
    for (var i = 0; i <= 7; i++) {
        for (var j = 0; j <= 3; j++) {
            var enemy:Invaders.Enemy = new Invaders.EnemyBoss(new CartesianCoordinate(10 + i * (Invaders.Enemy.DEFAULT_WIDTH + horizontalGap), (j * (Invaders.Enemy.DEFAULT_HEIGHT + verticalGap))));
            enemy.vector.xVelocity = Invaders.Enemy.DEFAULT_HORIZONTAL_SPEED;
            arr.push(enemy);
        }
    }
    return arr;
}